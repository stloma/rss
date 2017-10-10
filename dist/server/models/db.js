'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteCategory = exports.addCategory = exports.addFeed = exports.refreshArticles = exports.getCategories = exports.getFeeds = exports.store = exports.rssDb = exports.bookmark = undefined;

var _expressSession = require('express-session');

var _expressSession2 = _interopRequireDefault(_expressSession);

var _mongodb = require('mongodb');

var _connectMongodbSession = require('connect-mongodb-session');

var _connectMongodbSession2 = _interopRequireDefault(_connectMongodbSession);

var _get = require('../scripts/get.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var MongoDBStore = (0, _connectMongodbSession2.default)(_expressSession2.default);

var store = new MongoDBStore({
  uri: 'mongodb://localhost/rssapp',
  collection: 'sessions'
});

store.on('error', function (error) {
  if (error) throw error;
});

var rssDb = void 0;

_mongodb.MongoClient.connect('mongodb://localhost/rssapp').then(function (connection) {
  exports.rssDb = rssDb = connection;
}).catch(function (error) {
  console.log('Error connection to db: ' + error);
});

function getFeeds(userDb, cb) {
  var _this = this;

  var movies = function () {
    var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
      var html;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              html = 'html';

              console.log(html);

            case 2:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, _this);
    }));

    return function movies() {
      return _ref.apply(this, arguments);
    };
  }();
  console.log(movies);

  var finalResult = '';
  rssDb.collection(userDb).findOne({ slug: 'data' }, { _id: 0, slug: 0 })
  // Get main data document; create it if it doesn't exist
  .then(function (data) {
    if (data !== null) {
      return data;
    } else {
      rssDb.collection(userDb).insert({
        slug: 'data',
        categories: {},
        favorites: [],
        favoritesLookup: {},
        read: {},
        metadata: { updated: new Date() }
      }).then(getFeeds(userDb, cb)).catch(function (error) {
        return console.log('Error creating database: ' + error);
      });
    }
  })
  // Get category documents
  .then(function (data) {
    finalResult = data;
    var ids = [];
    var categories = data.categories;
    for (var id in categories) {
      ids.push(categories[id]);
    }
    var categoryIds = ids.map(function (id) {
      return (0, _mongodb.ObjectId)(id);
    });
    return rssDb.collection(userDb).find({ _id: { $in: categoryIds } }, { _id: 0 }).toArray();
  })
  // Add category documents to main data document and return
  .then(function (feeds) {
    finalResult.feeds = feeds;
    cb(null, { data: finalResult });
  });
}

function refreshArticles(userDb, category, name, url, cb) {
  var currentTime = new Date();
  rssDb.collection(userDb).update({ slug: 'data' }, { $set: { 'metadata.updated': currentTime } }).catch(function (error) {
    return console.log('Error updating time: ' + error);
  });

  var _id = '';
  rssDb.collection(userDb).findOne({ slug: 'data' }, { _id: 0, slug: 0 }).then(function (result) {
    return result.categories[category];
  }).then(function (id) {
    _id = new _mongodb.ObjectId(id);
  }).catch(function (error) {
    return console.log('Error getting id for ' + name + ': ' + error);
  });

  var fetchPromise = new Promise(function (resolve, reject) {
    (0, _get.fetchFeeds)(url, function (error, result) {
      if (error) reject(error);
      resolve(result);
    });
  });

  fetchPromise.then(function (feedData) {
    var articles = feedData.items;
    delete feedData.items;
    articles = articles.map(function (article) {
      article.rssCategory = category;
      article.rssFeed = name;
      article.bookmark = article.bookmark || false;
      return article;
    });
    rssDb.collection(userDb).update({ _id: _id }, { $set: _defineProperty({}, name + '.metadata', feedData) }).catch(function (error) {
      return console.log('Error updating ' + name + ' metadata: ' + error);
    });
    rssDb.collection(userDb).update({ _id: _id }, { $set: _defineProperty({}, name + '.articles', articles) }).catch(function (error) {
      return console.log('Error updating ' + name + ' articles: ' + error);
    });
  });

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

function bookmark(userDb, newBookmark, cb) {
  var category = newBookmark.rssCategory;
  var feed = newBookmark.rssFeed;
  var title = newBookmark.title;
  var bookmark = !newBookmark.bookmark;
  newBookmark.bookmark = bookmark;

  rssDb.collection(userDb).findOne({ slug: 'data' }, _defineProperty({ _id: 0 }, 'categories.' + category, 1)).then(function (result) {
    var _id = result.categories[category];

    var action = bookmark === true ? 'add' : 'remove';
    return rssDb.collection(userDb).update(_defineProperty({ _id: (0, _mongodb.ObjectId)(_id) }, feed + '.articles.title', title), { '$set': _defineProperty({}, feed + '.articles.$.bookmark', bookmark) }).then(function () {
      return action;
    });
  }).then(function (action) {
    if (action === 'add') {
      return rssDb.collection(userDb).update({ slug: 'data' }, { $push: { favorites: newBookmark } });
    } else if (action === 'remove') {
      return rssDb.collection(userDb).update({ slug: 'data' }, { $pull: { favorites: { title: title } } });
    }
  }).then(function () {
    return cb(null, 'success');
  }).catch(function (error) {
    return cb(error);
  });
}

function getCategories(cb) {
  rssDb.collection('categories').find().toArray().then(function (categories) {
    cb(null, { categories: categories });
  });
}

function addFeed(userDb, feed, cb) {
  var category = feed.category,
      name = feed.name,
      url = feed.url;
  // let feedName = name

  var update = _defineProperty({}, 'categories.' + category, 1);

  rssDb.collection(userDb).findOne({ slug: 'data' }, update).then(function (result) {
    rssDb.collection(userDb).update({ _id: result.categories[category] }, { $set: _defineProperty({}, name, { articles: [], url: url, category: category, updated: new Date() }) });
  }).catch(function (error) {
    return console.log(error);
  });
}

function addCategory(userDb, category, _id, cb) {
  var reference = new _mongodb.ObjectId();

  var addCategory = _defineProperty({}, 'categories.' + category, reference);

  rssDb.collection(userDb).insert({ _id: reference, name: category });

  rssDb.collection(userDb).update({ slug: 'data' }, {
    $set: addCategory
  }, function (err, result) {
    if (err) {
      cb(err);
    } else {
      cb(null, result);
    }
  });
}

function deleteCategory(dbname, toDelete, _id, cb) {
  var id = new _mongodb.ObjectId(_id);

  for (var category in toDelete) {
    var query = {};
    query[toDelete[category]] = '';
    rssDb.collection('feeds').update({ _id: id }, {
      $unset: query
    }, function (err, result) {
      if (err) {
        cb(err);
      } else {
        cb(null, result);
      }
    });
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

exports.bookmark = bookmark;
exports.rssDb = rssDb;
exports.store = store;
exports.getFeeds = getFeeds;
exports.getCategories = getCategories;
exports.refreshArticles = refreshArticles;
exports.addFeed = addFeed;
exports.addCategory = addCategory;
exports.deleteCategory = deleteCategory;
//# sourceMappingURL=db.js.map