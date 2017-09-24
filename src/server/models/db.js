import session from 'express-session'
import { MongoClient, ObjectId } from 'mongodb'
import connectMongo from 'connect-mongodb-session'
import { updateFeeds } from '../scripts/get.js'

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

function getFeeds (cb) {
  rssDb.collection('feeds').find().toArray()
    .then(feeds => {
      /*
      console.log('lifehacker:', feeds[0].tech[0].articles.length)
      console.log('hackernews:', feeds[0].tech[1].articles.length)
      console.log('bbc:', feeds[0].news[0].articles.length)
      console.log('recipies:', feeds[0].recipes[0].articles.length)
      console.log('-----------------')
      */
      cb(null, { feeds: feeds })
    })
}

function refreshArticles (dir, name, url, id, cb) {
  // Set updated time
  //
  const currentTime = new Date().getTime()
  const _id = new ObjectId(id)
  rssDb.collection('feeds').update({ _id: _id }, {$set: { updated: currentTime }},
        function (error, result) {
          if (error) {
            console.log(error)
          } else {
          }
        })

  // Fetch articles
  //
  updateFeeds(url, function (error, result) {
    if (error) console.log(error)

    // Sets up some query/filter strings
    //
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
    console.log(filter)

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

function addFeed (dbname, feed, cb) {
  const _id = new ObjectId(feed._id)
  const { category, name, url } = feed
  let id = category.concat(name, url).split('').map(i => i.charCodeAt(0)).join('')
  id = id + Math.floor((Math.random() * 1000) + 1)
  console.log(_id)

  let query = {}
  query[category] = {
    name: name,
    url: url,
    id: id
  }

  rssDb.collection('feeds').update({ _id: _id }, {
    $push: query
  }, function (error, result) {
    if (error) {
      cb(error)
    } else {
      cb(null, result)
    }
  })
}

function addCategory (dbname, category, _id, cb) {
  const id = new ObjectId(_id)

  let addCategory = {}
  addCategory[category] = []

  rssDb.collection('feeds').update({ _id: id }, {
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
