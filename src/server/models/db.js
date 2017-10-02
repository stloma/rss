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

store.on('error', function (error) {
  if (error) throw error
})

let rssDb

MongoClient.connect('mongodb://localhost/rssapp')
  .then(connection => {
    rssDb = connection
  })
  .catch(error => {
    console.log('ERROR: ', error)
  })

function getFeeds (userDb, cb) {
  let finalResult = ''
  rssDb.collection(userDb).findOne({ slug: 'data' }, { _id: 0, slug: 0 })
    // Get main data document; create it if it doesn't exist
    .then(data => {
      if (data !== null) {
        return data
      } else {
        rssDb.collection(userDb).insert({
          slug: 'data', categories: {}, metadata: { updated: new Date() }
        })
        .then(getFeeds(userDb, cb))
        .catch(error => console.log(`Error creating database: ${error}`))
      }
    })
    // Get category documents
    .then(data => {
      finalResult = data
      const ids = []
      const categories = data.categories
      for (let id in categories) {
        ids.push(categories[id])
      }
      let categoryIds = ids.map(id => ObjectId(id))
      return rssDb.collection(userDb).find({ _id: { $in: categoryIds } }, { _id: 0 }).toArray()
    })
    // Add category documents to main data document and return
    .then(feeds => {
      finalResult.feeds = feeds
      cb(null, { data: finalResult })
    })
}

function refreshArticles (userDb, category, name, url, cb) {

  const currentTime = new Date()
  rssDb.collection(userDb).update({ slug: 'data' }, {$set: { 'metadata.updated': currentTime }})
    .catch(error => console.log(`Error updating time: ${error}`))

  let _id = ''
  rssDb.collection(userDb).findOne({ slug: 'data' }, { _id: 0, slug: 0 })
    .then(result => result.categories[category])
    .then(id => { _id = new ObjectId(id) })
    .catch(error => console.log(`Error getting id for ${name}: ${error}`))

  let fetchPromise = new Promise((resolve, reject) => {
    fetchFeeds(url, function (error, result) {
      if (error) reject(error)
      resolve(result)
    })
  })

  fetchPromise
    .then(feedData => {
      const articles = feedData.items
      delete feedData.items
      rssDb.collection(userDb).update({ _id: _id }, { $set: { [`${name}.metadata`]: feedData } })
        .catch(error => console.log(`Error updating ${name} metadata: ${error}`))
      rssDb.collection(userDb).update({ _id: _id }, { $set: { [`${name}.articles`]: articles } })
        .catch(error => console.log(`Error updating ${name} articles: ${error}`))
    })

    // Sets up some query/filter strings
    //
      /*
    const category = dir + '.name'
    const filter = {
      _id: _id
    }
    filter[category] = name

    const projection = dir + '.$.'

    const updated = projection + 'updated'
    const title = projection + 'title'
    const description = projection + 'description'
    const articles = projection + 'articles'
    const count = projection + 'count'

    // Start article cleanup
    //
    let newArticles = result.items
    let oldArticles = []

    // Pull & delete articles
    let clearArticles = {}
    clearArticles[articles] = []

    function cleanUp (cb) {
      rssDb.collection('feeds').findAndModify(
            filter,
            [['_id', 'asc']],
            {$set: clearArticles},
             function (err, result) {
               if (err) throw err
               // Is this having to filter *all* articles based on name each time?
               //
               result.value[dir].map(item => console.log(item.name))
               cb(null, result.value[dir].filter(item => item.name === name)[0].articles)
             }
          )
    }
    cleanUp(function (err, res) {
      if (err) throw err

      oldArticles = res
      let mergedArticles = [...newArticles, ...oldArticles]
      // Sort articles by date
      //
      mergedArticles.sort(function (a, b) {
        b.directory = dir
        a.directory = dir
        b.feed = name
        a.feed = name
        return new Date(b.pubdate).getTime() - new Date(a.pubdate).getTime()
      })
      // Remove duplicate articles
      //
      let seen = {}
      let dupFreeArticles = []
      for (let i = 0; i < mergedArticles.length; i++) {
        let title = mergedArticles[i].title
        if (seen[title]) {
          continue
        }
        seen[title] = true
        dupFreeArticles.push(mergedArticles[i])
      }

      // Updates feed metadata (title, description, updated time, count)
      //
      let feedQuery = {}
      feedQuery[title] = result.title
      feedQuery[description] = result.description
      feedQuery[updated] = currentTime
      feedQuery[count] = dupFreeArticles.length

      rssDb.collection('feeds').update(filter, {
        $set: feedQuery
      }, function (error, result) {
        if (error) {
          cb(error)
        }
      })

      // Insert merged & sorted articles
      let articleQuery = {}
      articleQuery[articles] = {}
      let each = '$each'
      articleQuery[articles][each] = dupFreeArticles

      rssDb.collection('feeds').update(filter, {
        $push: articleQuery
      }, function (error, result) {
        if (error) {
          cb(error)
        }
      })
    })
  })
    */
}

function bookmark (db, newBookmark, cb) {
  const _id = newBookmark.objId
  delete newBookmark.objId
  newBookmark.bookmark = true

  let bookmarkQuery = {}
  bookmarkQuery.favorites = newBookmark

  let filter = { _id: new ObjectId(_id) }

  rssDb.collection('feeds').update(filter, {
    $push: bookmarkQuery
  }, function (error, result) {
    if (error) {
      cb(error)
    }
    cb(null, result)
  })
}

function getCategories (cb) {
  rssDb.collection('categories').find().toArray()
    .then(categories => {
      cb(null, { categories: categories })
    })
}

function addFeed (userDb, feed, cb) {
  const { category, name, url } = feed
  // let feedName = name
  let update = { [`categories.${category}`]: 1 }

  rssDb.collection(userDb).findOne({ slug: 'data' }, update)
    .then(result => {
      rssDb.collection(userDb).update(
      { _id: result.categories[category] },
      { $set: { [name]: { articles: [], url: url, category: category, updated: new Date() } } }
    )
    })
    .catch(error => console.log(error))
}

function addCategory (userDb, category, _id, cb) {
  const reference = new ObjectId()

  let addCategory = { [`categories.${category}`]: reference }

  rssDb.collection(userDb).insert({ _id: reference, name: category })

  rssDb.collection(userDb).update({ slug: 'data' }, {
    $set: addCategory
  },
   function (err, result) {
     if (err) {
       cb(err)
     } else {
       cb(null, result)
     }
   }
  )
}

function deleteCategory (dbname, toDelete, _id, cb) {
  const id = new ObjectId(_id)

  for (let category in toDelete) {
    let query = {}
    query[toDelete[category]] = ''
    rssDb.collection('feeds').update({ _id: id }, {
      $unset: query
    },
   function (err, result) {
     if (err) {
       cb(err)
     } else {
       cb(null, result)
     }
   }
  )
  }
}
  /*
function fetchArticles (directories, cb) {
  directories.map(dir =>
    dir.items.map(item =>
      downloadFeed(item.url, function (error, result) {
        if (error) throw error
        console.log(result.title)
        console.log(result.description)
      })
    )
  )
  // let bookmarkId = new ObjectId(site._id)
  rssDb.collection('directories').update({ title: feed.category }, {
    $push: {
      items: {
        name: feed.name,
        url: feed.url
      }
    }
  }, function (error, result) {
    if (error) {
      cb(error)
    } else {
      cb(null, result)
    }
  })
}
  */

  /*
function addSite (rssDb, newFeed, cb) {
  let feedId = new ObjectId(newFeed._id)
  bookmarkDb.collection(bmarkDb).updateOne({ _id: bookmarkId }, {
    $set: {
      name: site.name,
      url: site.url,
      comment: site.comment,
      tags: site.tags,
      update: site.updated
    }}, function (error, result) {
      if (error) {
        cb(error)
      } else {
        cb(null, result)
      }
    })
}

function addFeed (bmarkDb, newFeed, cb) {
  rssDb.collection(bmarkDb).insertOne(newFeed, function (error, res) {
    let _id = res.insertedId

    download(newSite.url, _id, function (error, result) {
      if (error) {
        cb(error)
        return
      }
      newSite.favicon = result ? _id + '.ico' : 'default-favicon.png'
      let bookmarkId = new ObjectId(_id)
      bookmarkDb.collection(bmarkDb).updateOne({ _id: bookmarkId },
        {$set: {
          favicon: newSite.favicon
        }})
          .catch(error => {
            throw error
          })
    })
    cb(error, res)
  })
}
*/

/*
function getFeeds (userDb, cb) {
  rssDb.collection('bookmarks.' + userDb).find().toArray()
    .then(bookmarks => {
      let result = countBy(bookmarks.map(function (bookmark) {
        return bookmark.tags
      })
         .join(' ')
        .split(' ')
      )
      let tagcount = []
      Object.keys(result).forEach((tag) => {
        tagcount.push({ value: tag, count: result[tag] })
      })
      const metadata = { total_count: bookmarks.length }
      cb(null, { _metadata: metadata, tagcount: tagcount, records: bookmarks })
    })
    .catch(error => {
      cb(error)
    })
}
*/

  /*

function deleteSite (bmarkDb, _id, cb) {
  bookmarkDb.collection(bmarkDb).deleteOne({ _id: _id }).then((result) => {
    let error = result.result.n === 1 ? null : '404'
    cb(error)
  })
  .catch(error => {
    cb(error)
  })
}

*/

export { bookmark, rssDb, store, getFeeds, getCategories, refreshArticles, addFeed, addCategory, deleteCategory }
