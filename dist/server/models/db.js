'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteCategory = exports.addCategory = exports.addFeed = exports.refreshArticles = exports.getCategories = exports.getFeeds = exports.store = exports.db = exports.createBookmark = exports.markRead = undefined;

var _expressSession = require('express-session');

var _expressSession2 = _interopRequireDefault(_expressSession);

var _mongodb = require('mongodb');

var _connectMongodbSession = require('connect-mongodb-session');

var _connectMongodbSession2 = _interopRequireDefault(_connectMongodbSession);

var _get = require('../scripts/get');

var _get2 = _interopRequireDefault(_get);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var MongoDBStore = (0, _connectMongodbSession2.default)(_expressSession2.default);

var store = new MongoDBStore({
  uri: 'mongodb://localhost/rssapp',
  collection: 'sessions'
});

store.on('error', function (error) {
  if (error) throw error;
});

var db = {};

_mongodb.MongoClient.connect('mongodb://localhost/rssapp').then(function (connection) {
  db.rssDb = connection;
}).catch(function (error) {
  console.log('Error connecting to db: ' + error);
});

async function getFeeds(userDb) {
  try {
    var data = await db.rssDb.collection(userDb).findOne({ slug: 'data' }, { _id: 0, slug: 0 });
    if (data === null) {
      await db.rssDb.collection(userDb).insert({
        slug: 'data',
        categories: {},
        favorites: [],
        favoritesLookup: {},
        read: {},
        metadata: { updated: new Date() }
      });
      getFeeds(userDb);
    }
    var finalResult = data;
    var ids = [];
    var categories = data.categories;
    Object.keys(categories).forEach(function (id) {
      ids.push(categories[id]);
    });
    var categoryIds = ids.map(function (id) {
      return (0, _mongodb.ObjectId)(id);
    });
    var feeds = await db.rssDb.collection(userDb).find({
      _id: { $in: categoryIds } }, { _id: 0 }).toArray();

    feeds = feeds.map(function (feedParam) {
      var feed = feedParam;
      var keys = Object.keys(feed).filter(function (key) {
        return key !== 'name';
      });
      var count = 0;
      keys.forEach(function (key) {
        count += feed[key].articles.length;
      });
      feed.count = count;
      return feed;
    });
    finalResult.feeds = feeds;

    return { data: finalResult };
  } catch (error) {
    throw error;
  }
}

async function markRead(category, feed, titleParam, link, userDb) {
  var title = titleParam;
  try {
    // Get all category reference ids
    var filter = category === 'all' ? { _id: 0, categories: 1 } : _defineProperty({}, 'categories.' + category, 1);
    var catIds = await db.rssDb.collection(userDb).findOne({ slug: 'data' }, filter);

    // Assign category id, this assumes only marking one category as read
    catIds = Object.values(catIds.categories);
    var finalRead = {};
    var allReadArticles = {};
    var origReadArticles = await db.rssDb.collection(userDb).findOne({ slug: 'data' }, { _id: 0, read: 1 });

    // If we're just removing one article
    if (title) {
      await db.rssDb.collection(userDb).update({ _id: new _mongodb.ObjectId(catIds[0]) }, { $pull: _defineProperty({}, category + '.articles.' + title, title) });
      title = title.replace(/\.|\$/g, '_');
      allReadArticles = _defineProperty({}, title, link);

      // For each category by document reference
    } else {
      catIds.forEach(async function (catId) {
        // Get articles, one feed/s per category
        var getArticles = feed === 'all' ? { _id: 0 } : _defineProperty({ _id: 0 }, feed + '.articles', 1);
        var articles = await db.rssDb.collection(userDb).findOne({
          _id: new _mongodb.ObjectId(catId) }, getArticles);
        var feeds = Object.keys(articles).filter(function (key) {
          return key !== 'name';
        });
        var readArticles = [];

        // For each feed
        feeds.forEach(async function (eachFeed) {
          var _$set;

          readArticles = [].concat(_toConsumableArray(readArticles), _toConsumableArray(articles[eachFeed].articles));
          await db.rssDb.collection(userDb).update({ _id: new _mongodb.ObjectId(catId) }, { $set: (_$set = {}, _defineProperty(_$set, eachFeed + '.articles', []), _defineProperty(_$set, eachFeed + '.metadata.count', 0), _$set) });
        });
        // Replace periods and dollar signs so article titles can be stored as
        // keys for quick lookup
        readArticles.forEach(function (article) {
          var newTitle = article.title.replace(/\.|\$/g, '_');
          allReadArticles[newTitle] = article.link;
        });
      });
    }
    finalRead = Object.assign({}, finalRead, origReadArticles.read, allReadArticles);
    await db.rssDb.collection(userDb).update({ slug: 'data' }, { $set: { read: finalRead } });
    return 'sucess';
  } catch (error) {
    throw error;
  }
}

// This is called once per feed from Router.jsx
async function refreshArticles(userDb, category, name, url) {
  var currentTime = new Date().getTime();
  try {
    await db.rssDb.collection(userDb).update({ slug: 'data' }, { $set: { 'metadata.updated': currentTime } });

    // Get document reference for the category
    var res = await db.rssDb.collection(userDb).findOne({ slug: 'data' }, { _id: 0, slug: 0 });
    var _id = new _mongodb.ObjectId(res.categories[category]);

    var articles = await (0, _get2.default)(url);

    // Get hash maps for looking up articles that are marked as read and favorites
    var fav = await db.rssDb.collection(userDb).findOne({ slug: 'data' }, { _id: 0, favoritesLookup: 1 });
    var read = await db.rssDb.collection(userDb).findOne({ slug: 'data' }, { _id: 0, read: 1 });
    var favLookup = fav.favoritesLookup;
    var readLookup = read.read;

    // Check if articles were previsouly marked as read. Storing a key with a .
    // or $ is not allowed in mongo, so do a string replacement for those chars
    var articlesFinal = [];
    // for (const article of articles) {
    articles.forEach(function (articleParam) {
      var article = articleParam;
      var title = article.title.replace(/\.|\$/g, '_');
      if (!readLookup[title]) {
        // Article marked as read
        article.bookmark = article.bookmark || false;
        if (favLookup[article.title]) {
          article.bookmark = true;
        }
        article.rssCategory = category;
        article.rssFeed = name;
        articlesFinal.push(article);
      }
    });
    var count = articlesFinal.length;
    await Promise.all([db.rssDb.collection(userDb).update({ _id: _id }, { $set: _defineProperty({}, name + '.count', count) }), db.rssDb.collection(userDb).update({ _id: _id }, { $set: _defineProperty({}, name + '.articles', articlesFinal) })]);

    return null;
  } catch (error) {
    throw error;
  }
}

async function createBookmark(userDb, newBookmarkParam) {
  var newBookmark = newBookmarkParam;
  var category = newBookmark.rssCategory;
  var feed = newBookmark.rssFeed;
  var title = newBookmark.title;
  var link = newBookmark.link;
  var bookmark = !newBookmark.bookmark;
  newBookmark.bookmark = bookmark;

  try {
    // Get ObjectId reference for category
    var result = await db.rssDb.collection(userDb).findOne({ slug: 'data' }, _defineProperty({ _id: 0 }, 'categories.' + category, 1));
    var _id = result.categories[category];

    // Toggle bookmark boolean on article object
    await db.rssDb.collection(userDb).update(_defineProperty({ _id: (0, _mongodb.ObjectId)(_id) }, feed + '.articles.title', title), { $set: _defineProperty({}, feed + '.articles.$.bookmark', bookmark) });

    // Add or remove article to favorites
    var action = bookmark === true ? 'add' : 'remove';
    if (action === 'add') {
      await db.rssDb.collection(userDb).update({ slug: 'data' }, { $push: { favorites: newBookmark } });
      await db.rssDb.collection(userDb).update({ slug: 'data' }, { $set: _defineProperty({}, 'favoritesLookup.' + title, link) });
    } else if (action === 'remove') {
      await db.rssDb.collection(userDb).update({ slug: 'data' }, { $pull: { favorites: { title: title } } });
      await db.rssDb.collection(userDb).update({ slug: 'data' }, { $unset: _defineProperty({}, 'favoritesLookup.' + title, link) });
    }
    return 'success';
  } catch (error) {
    throw error;
  }
}

function getCategories(cb) {
  db.rssDb.collection('categories').find().toArray().then(function (categories) {
    cb(null, { categories: categories });
  });
}

async function addFeed(userDb, feed) {
  var category = feed.category,
      name = feed.name,
      url = feed.url;
  // let feedName = name

  var update = _defineProperty({}, 'categories.' + category, 1);

  try {
    var result = await db.rssDb.collection(userDb).findOne({ slug: 'data' }, update);
    await db.rssDb.collection(userDb).update({ _id: result.categories[category] }, { $set: _defineProperty({}, name, { articles: [], url: url, category: category, updated: new Date() }) });
    return 'success';
  } catch (error) {
    throw error;
  }
}

async function addCategory(userDb, category) {
  var reference = new _mongodb.ObjectId();

  var newCategory = _defineProperty({}, 'categories.' + category, reference);

  try {
    await db.rssDb.collection(userDb).insert({ _id: reference, name: category });
    await db.rssDb.collection(userDb).update({ slug: 'data' }, { $set: newCategory });
    return newCategory;
  } catch (error) {
    throw error;
  }
}

async function deleteCategory(userDb, toDelete) {
  var promises = [];
  try {
    toDelete.forEach(async function (category) {
      var catId = await db.rssDb.collection(userDb).findOne({ name: category }, { _id: 1 });
      catId = new _mongodb.ObjectId(catId._id);

      var categoryName = 'categories.' + category;
      var query = _defineProperty({}, categoryName, '');

      var p1 = await db.rssDb.collection(userDb).update({ slug: 'data' }, { $unset: query });
      var p2 = await db.rssDb.collection(userDb).deleteOne({ _id: catId });
      promises = [].concat(_toConsumableArray(promises), [p1, p2]);
    });
  } catch (error) {
    console.log(error);
  }
  return Promise.all(promises);
}

exports.markRead = markRead;
exports.createBookmark = createBookmark;
exports.db = db;
exports.store = store;
exports.getFeeds = getFeeds;
exports.getCategories = getCategories;
exports.refreshArticles = refreshArticles;
exports.addFeed = addFeed;
exports.addCategory = addCategory;
exports.deleteCategory = deleteCategory;
//# sourceMappingURL=db.js.map