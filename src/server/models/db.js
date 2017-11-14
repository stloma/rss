import session from 'express-session'
import { MongoClient, ObjectId } from 'mongodb'
import connectMongo from 'connect-mongodb-session'
import { fetchFeeds } from '../scripts/get'

const MongoDBStore = connectMongo(session)

const store = new MongoDBStore(
  {
    uri: 'mongodb://localhost/rssapp',
    collection: 'sessions'
  })

store.on('error', (error) => {
  if (error) throw error
})

const db = {}

MongoClient.connect('mongodb://localhost/rssapp')
  .then((connection) => {
    db.rssDb = connection
  })
  .catch((error) => {
    console.log(`Error connection to db: ${error}`)
  })

async function getFeeds(userDb, cb) {
  try {
    const data = await db.rssDb.collection(userDb).findOne({ slug: 'data' }, { _id: 0, slug: 0 })
    if (data === null) {
      await db.rssDb.collection(userDb).insert({
        slug: 'data',
        categories: {},
        favorites: [],
        favoritesLookup: {},
        read: {},
        metadata: { updated: new Date() }
      })
      getFeeds(userDb, cb)
    }
    const finalResult = data
    const ids = []
    const categories = data.categories
    Object.keys(categories).forEach((id) => {
      ids.push(categories[id])
    })
    const categoryIds = ids.map(id => ObjectId(id))
    let feeds = await db.rssDb.collection(userDb).find({
      _id: { $in: categoryIds } }, { _id: 0 }).toArray()

    feeds = feeds.map((feedParam) => {
      const feed = feedParam
      const keys = Object.keys(feed).filter(key => key !== 'name')
      let count = 0
      keys.forEach((key) => {
        count += feed[key].articles.length
      })
      feed.count = count
      return feed
    })
    finalResult.feeds = feeds

    cb(null, { data: finalResult })
  } catch (error) { console.log(`Failed getting feeds: ${error}`); cb(error) }
}

async function markRead(category, feed, titleParam, link, userDb, cb) {
  let title = titleParam
  try {
    // Get all category reference ids
    const filter = category === 'all' ? { _id: 0, categories: 1 } : { [`categories.${category}`]: 1 }
    let catIds = await db.rssDb.collection(userDb).findOne(
      { slug: 'data' },
      filter
    )

    // Assign category id, this assumes only marking one category as read
    catIds = Object.values(catIds.categories)
    let finalRead = {}
    let allReadArticles = {}
    const origReadArticles = await db.rssDb.collection(userDb).findOne({ slug: 'data' }, { _id: 0, read: 1 })

    // If we're just removing one article
    if (title) {
      await db.rssDb.collection(userDb).update(
        { _id: new ObjectId(catIds[0]) },
        { $pull: { [`${category}.articles.${title}`]: title } }
      )
      title = title.replace(/\.|\$/g, '_')
      allReadArticles = { [title]: link }

    // For each category by document reference
    } else {
      catIds.forEach(async (catId) => {
        // Get articles, one feed/s per category
        const getArticles = feed === 'all' ? { _id: 0 } : { _id: 0, [`${feed}.articles`]: 1 }
        const articles = await db.rssDb.collection(userDb).findOne({
          _id: new ObjectId(catId) }, getArticles)
        const feeds = Object.keys(articles).filter(key => key !== 'name')
        let readArticles = []

        // For each feed
        feeds.forEach(async (eachFeed) => {
          readArticles = [...readArticles, ...articles[eachFeed].articles]
          await db.rssDb.collection(userDb).update(
            { _id: new ObjectId(catId) },
            { $set: { [`${eachFeed}.articles`]: [], [`${eachFeed}.metadata.count`]: 0 } }
          )
        })
        // Replace periods and dollar signs so article titles can be stored as
        // keys for quick lookup
        readArticles.forEach((article) => {
          const newTitle = article.title.replace(/\.|\$/g, '_')
          allReadArticles[newTitle] = article.link
        })
      })
    }
    finalRead = Object.assign({}, finalRead, origReadArticles.read, allReadArticles)
    await db.rssDb.collection(userDb).update({ slug: 'data' }, { $set: { read: finalRead } })
    cb(null)
  } catch (error) { console.log(`Failed marking ${category}: ${feed} as read: ${error}`); cb(error) }
}

// This is called once per feed from Router.jsx
async function refreshArticles(userDb, category, name, url, cb) {
  const currentTime = new Date().getTime()
  try {
    await db.rssDb.collection(userDb).update({ slug: 'data' }, { $set: { 'metadata.updated': currentTime } })

    // Get document reference for the category
    const res = await db.rssDb.collection(userDb).findOne({ slug: 'data' }, { _id: 0, slug: 0 })
    const _id = new ObjectId(res.categories[category])

    const articles = await fetchFeeds(url)

    // Get hash maps for looking up articles that are marked as read and favorites
    const fav = await db.rssDb.collection(userDb).findOne({ slug: 'data' }, { _id: 0, favoritesLookup: 1 })
    const read = await db.rssDb.collection(userDb).findOne({ slug: 'data' }, { _id: 0, read: 1 })
    const favLookup = fav.favoritesLookup
    const readLookup = read.read

    // Check if articles were previsouly marked as read. Storing a key with a .
    // or $ is not allowed in mongo, so do a string replacement for those chars
    const articlesFinal = []
    // for (const article of articles) {
    articles.forEach((articleParam) => {
      const article = articleParam
      const title = article.title.replace(/\.|\$/g, '_')
      if (!readLookup[title]) {
        // Article marked as read
        article.bookmark = article.bookmark || false
        if (favLookup[article.title]) { article.bookmark = true }
        article.rssCategory = category
        article.rssFeed = name
        articlesFinal.push(article)
      }
    })
    const count = articlesFinal.length
    await Promise.all([
      db.rssDb.collection(userDb).update({ _id }, { $set: { [`${name}.count`]: count } }),
      db.rssDb.collection(userDb).update({ _id }, { $set: { [`${name}.articles`]: articlesFinal } })
    ])

    cb(null)
  } catch (error) { cb(error) }
}

async function createBookmark(userDb, newBookmarkParam, cb) {
  const newBookmark = newBookmarkParam
  const category = newBookmark.rssCategory
  const feed = newBookmark.rssFeed
  const title = newBookmark.title
  const link = newBookmark.link
  const bookmark = !newBookmark.bookmark
  newBookmark.bookmark = bookmark

  try {
    // Get ObjectId reference for category
    const result = await db.rssDb.collection(userDb).findOne(
      { slug: 'data' },
      { _id: 0, [`categories.${category}`]: 1 }
    )
    const _id = result.categories[category]

    // Toggle bookmark boolean on article object
    await db.rssDb.collection(userDb).update(
      { _id: ObjectId(_id), [`${feed}.articles.title`]: title },
      { $set: { [`${feed}.articles.$.bookmark`]: bookmark } }
    )

    // Add or remove article to favorites
    const action = bookmark === true ? 'add' : 'remove'
    if (action === 'add') {
      await db.rssDb.collection(userDb).update({ slug: 'data' }, { $push: { favorites: newBookmark } })
      await db.rssDb.collection(userDb).update({ slug: 'data' }, { $set: { [`favoritesLookup.${title}`]: link } })
    } else if (action === 'remove') {
      await db.rssDb.collection(userDb).update({ slug: 'data' }, { $pull: { favorites: { title } } })
      await db.rssDb.collection(userDb).update({ slug: 'data' }, { $unset: { [`favoritesLookup.${title}`]: link } })
    }
    cb(null, 'success')
  } catch (error) { console.log(`Failed creating bookmark: ${error}`); cb(error) }
}

function getCategories(cb) {
  db.rssDb.collection('categories').find().toArray()
    .then((categories) => {
      cb(null, { categories })
    })
}

function addFeed(userDb, feed) {
  const { category, name, url } = feed
  // let feedName = name
  const update = { [`categories.${category}`]: 1 }

  db.rssDb.collection(userDb).findOne({ slug: 'data' }, update)
    .then((result) => {
      db.rssDb.collection(userDb).update(
        { _id: result.categories[category] },
        { $set: { [name]: { articles: [], url, category, updated: new Date() } } }
      )
    })
    .catch(error => console.log(error))
}

function addCategory(userDb, category, _id, cb) {
  const reference = new ObjectId()

  const newCategory = { [`categories.${category}`]: reference }

  db.rssDb.collection(userDb).insert({ _id: reference, name: category })

  db.rssDb.collection(userDb).update({ slug: 'data' }, {
    $set: newCategory
  },
  (err, result) => {
    if (err) {
      cb(err)
    } else {
      cb(null, result)
    }
  }
  )
}

function deleteCategory(dbname, toDelete, _id, cb) {
  const id = new ObjectId(_id)

  toDelete.forEach((category) => {
    const query = {}
    query[toDelete[category]] = ''
    db.rssDb.collection('feeds').update({ _id: id }, {
      $unset: query
    },
    (err, result) => {
      if (err) {
        cb(err)
      } else {
        cb(null, result)
      }
    }
    )
  })
}

export {
  markRead, createBookmark, db, store, getFeeds, getCategories, refreshArticles,
  addFeed, addCategory, deleteCategory
}
