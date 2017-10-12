import session from 'express-session'
import { MongoClient, ObjectId } from 'mongodb'
import connectMongo from 'connect-mongodb-session'
import { fetchFeeds } from '../scripts/get.js'

const MongoDBStore = connectMongo(session)

const store = new MongoDBStore(
  {
    uri: 'mongodb://localhost/rssapp',
    collection: 'sessions'
  })

store.on('error', (error) => {
  if (error) throw error
})

let rssDb

MongoClient.connect('mongodb://localhost/rssapp')
  .then((connection) => {
    rssDb = connection
  })
  .catch((error) => {
    console.log(`Error connection to db: ${error}`)
  })

async function getFeeds(userDb, cb) {
  try {
    const data = await rssDb.collection(userDb).findOne({ slug: 'data' }, { _id: 0, slug: 0 })
    if (data === null) {
      await rssDb.collection(userDb).insert({
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
    for (const id in categories) {
      ids.push(categories[id])
    }
    const categoryIds = ids.map(id => ObjectId(id))
    let feeds = await rssDb.collection(userDb).find({ _id: { $in: categoryIds } }, { _id: 0 }).toArray()

    feeds = feeds.map((feed) => {
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

async function markRead(category, feed, title, link, userDb, cb) {
  try {
    // Get all category reference ids
    const filter = category === 'all' ? { _id: 0, categories: 1 } : { [`categories.${category}`]: 1 }
    let catIds = await rssDb.collection(userDb).findOne(
      { slug: 'data' },
      filter
    )

    // Assign category id, this assumes only marking one category as read
    catIds = Object.values(catIds.categories)
    let finalRead = {}
    let allReadArticles = {}
    const origReadArticles = await rssDb.collection(userDb).findOne({ slug: 'data' }, { _id: 0, read: 1 })

    // If we're just removing one article
    if (title) {
      await rssDb.collection(userDb).update(
        { _id: new ObjectId(catIds[0]) },
        { $pull: { [`${category}.articles.${title}`]: title } }
      )
      title = title.replace(/\.|\$/g, '_')
      allReadArticles = { [title]: link }

    // For each category by document reference
    } else {
      for (const catId of catIds) {
        // Get articles, one feed/s per category
        const getArticles = feed === 'all' ? { _id: 0 } : { _id: 0, [`${feed}.articles`]: 1 }
        const articles = await rssDb.collection(userDb).findOne({ _id: new ObjectId(catId) }, getArticles)
        const feeds = Object.keys(articles).filter(key => key !== 'name')
        let readArticles = []

        // For each feed
        for (const feed of feeds) {
          readArticles = [...readArticles, ...articles[feed].articles]
          await rssDb.collection(userDb).update(
            { _id: new ObjectId(catId) },
            { $set: { [`${feed}.articles`]: [], [`${feed}.metadata.count`]: 0 } }
          )
        }
        // Replace periods and dollar signs so article titles can be stored as
        // keys for quick lookup
        readArticles.forEach((article) => {
          const title = article.title.replace(/\.|\$/g, '_')
          allReadArticles[title] = article.link
        })
      }
    }
    finalRead = Object.assign({}, finalRead, origReadArticles.read, allReadArticles)
    await rssDb.collection(userDb).update({ slug: 'data' }, { $set: { read: finalRead } })
    cb(null)
  } catch (error) { console.log(`Failed marking ${category}: ${feed} as read: ${error}`); cb(error) }
}

// This is called once per feed from Router.jsx
async function refreshArticles(userDb, category, name, url, cb) {
  const currentTime = new Date().getTime()
  try {
    await rssDb.collection(userDb).update({ slug: 'data' }, { $set: { 'metadata.updated': currentTime } })

    // Get document reference for the category
    const res = await rssDb.collection(userDb).findOne({ slug: 'data' }, { _id: 0, slug: 0 })
    const _id = new ObjectId(res.categories[category])

    const articles = await fetchFeeds(url)

    // Get hash maps for looking up articles that are marked as read and favorites
    const fav = await rssDb.collection(userDb).findOne({ slug: 'data' }, { _id: 0, favoritesLookup: 1 })
    const read = await rssDb.collection(userDb).findOne({ slug: 'data' }, { _id: 0, read: 1 })
    const favLookup = fav.favoritesLookup
    const readLookup = read.read

    // Check if articles were previsouly marked as read. Storing a key with a .
    // or $ is not allowed in mongo, so do a string replacement for that chars
    const articlesFinal = []
    for (const article of articles) {
      const title = article.title.replace(/\.|\$/g, '_')
      if (readLookup[title]) {
        // Article marked as read
        continue
      }
      article.bookmark = article.bookmark || false
      if (favLookup[article.title]) { article.bookmark = true }
      article.rssCategory = category
      article.rssFeed = name
      articlesFinal.push(article)
    }
    const count = articlesFinal.length
    await Promise.all([
      rssDb.collection(userDb).update({ _id }, { $set: { [`${name}.count`]: count } }),
      rssDb.collection(userDb).update({ _id }, { $set: { [`${name}.articles`]: articlesFinal } })
    ])

    cb(null)
  } catch (error) { cb(error) }
}

async function bookmark(userDb, newBookmark, cb) {
  const category = newBookmark.rssCategory
  const feed = newBookmark.rssFeed
  const title = newBookmark.title
  const link = newBookmark.link
  const bookmark = !newBookmark.bookmark
  newBookmark.bookmark = bookmark

  try {
    // Get ObjectId reference for category
    const result = await rssDb.collection(userDb).findOne(
      { slug: 'data' },
      { _id: 0, [`categories.${category}`]: 1 }
    )
    const _id = result.categories[category]

    // Toggle bookmark boolean on article object
    await rssDb.collection(userDb).update(
      { _id: ObjectId(_id), [`${feed}.articles.title`]: title },
      { $set: { [`${feed}.articles.$.bookmark`]: bookmark } }
    )

    // Add or remove article to favorites
    const action = bookmark === true ? 'add' : 'remove'
    if (action === 'add') {
      await rssDb.collection(userDb).update({ slug: 'data' }, { $push: { favorites: newBookmark } })
      await rssDb.collection(userDb).update({ slug: 'data' }, { $set: { [`favoritesLookup.${title}`]: link } })
    } else if (action === 'remove') {
      await rssDb.collection(userDb).update({ slug: 'data' }, { $pull: { favorites: { title } } })
      await rssDb.collection(userDb).update({ slug: 'data' }, { $unset: { [`favoritesLookup.${title}`]: link } })
    }
    cb(null, 'success')
  } catch (error) { console.log(`Failed creating bookmark: ${error}`); cb(error) }
}

function getCategories(cb) {
  rssDb.collection('categories').find().toArray()
    .then((categories) => {
      cb(null, { categories })
    })
}

function addFeed(userDb, feed, cb) {
  const { category, name, url } = feed
  // let feedName = name
  const update = { [`categories.${category}`]: 1 }

  rssDb.collection(userDb).findOne({ slug: 'data' }, update)
    .then((result) => {
      rssDb.collection(userDb).update(
        { _id: result.categories[category] },
        { $set: { [name]: { articles: [], url, category, updated: new Date() } } }
      )
    })
    .catch(error => console.log(error))
}

function addCategory(userDb, category, _id, cb) {
  const reference = new ObjectId()

  const addCategory = { [`categories.${category}`]: reference }

  rssDb.collection(userDb).insert({ _id: reference, name: category })

  rssDb.collection(userDb).update({ slug: 'data' }, {
    $set: addCategory
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

  for (const category in toDelete) {
    const query = {}
    query[toDelete[category]] = ''
    rssDb.collection('feeds').update({ _id: id }, {
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
  }
}

export { markRead, bookmark, rssDb, store, getFeeds, getCategories, refreshArticles, addFeed, addCategory, deleteCategory }
