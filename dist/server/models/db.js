'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.editSite = exports.deleteSite = exports.getBookmarks = exports.addSite = exports.store = exports.bookmarkDb = undefined;

var _expressSession = require('express-session');

var _expressSession2 = _interopRequireDefault(_expressSession);

var _mongodb = require('mongodb');

var _connectMongodbSession = require('connect-mongodb-session');

var _connectMongodbSession2 = _interopRequireDefault(_connectMongodbSession);

var _lodash = require('lodash');

var _favicon = require('../scripts/favicon.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MongoDBStore = (0, _connectMongodbSession2.default)(_expressSession2.default);

var store = new MongoDBStore({
  uri: 'mongodb://localhost/bookmarkapp',
  collection: 'sessions'
});

store.on('error', function (error) {
  if (error) throw error;
});

var bookmarkDb = void 0;

_mongodb.MongoClient.connect('mongodb://localhost/bookmarkapp').then(function (connection) {
  exports.bookmarkDb = bookmarkDb = connection;
}).catch(function (error) {
  console.log('ERROR: ', error);
});

function getBookmarks(userDb, cb) {
  bookmarkDb.collection('bookmarks.' + userDb).find().toArray().then(function (bookmarks) {
    var result = (0, _lodash.countBy)(bookmarks.map(function (bookmark) {
      return bookmark.tags;
    }).join(' ').split(' '));
    var tagcount = [];
    Object.keys(result).forEach(function (tag) {
      tagcount.push({ value: tag, count: result[tag] });
    });
    var metadata = { total_count: bookmarks.length };
    cb(null, { _metadata: metadata, tagcount: tagcount, records: bookmarks });
  }).catch(function (error) {
    cb(error);
  });
}

function addSite(bmarkDb, newSite, cb) {
  bookmarkDb.collection(bmarkDb).insertOne(newSite, function (error, res) {
    var _id = res.insertedId;

    (0, _favicon.download)(newSite.url, _id, function (error, result) {
      if (error) {
        cb(error);
        return;
      }
      newSite.favicon = result ? _id + '.ico' : 'default-favicon.png';
      var bookmarkId = new _mongodb.ObjectId(_id);
      bookmarkDb.collection(bmarkDb).updateOne({ _id: bookmarkId }, { $set: {
          favicon: newSite.favicon
        } }).catch(function (error) {
        throw error;
      });
    });
    cb(error, res);
  });
}

function deleteSite(bmarkDb, _id, cb) {
  bookmarkDb.collection(bmarkDb).deleteOne({ _id: _id }).then(function (result) {
    var error = result.result.n === 1 ? null : '404';
    cb(error);
  }).catch(function (error) {
    cb(error);
  });
}

function editSite(bmarkDb, site, cb) {
  var bookmarkId = new _mongodb.ObjectId(site._id);
  bookmarkDb.collection(bmarkDb).updateOne({ _id: bookmarkId }, {
    $set: {
      name: site.name,
      url: site.url,
      comment: site.comment,
      tags: site.tags,
      update: site.updated
    } }, function (error, result) {
    if (error) {
      cb(error);
    } else {
      cb(null, result);
    }
  });
}

exports.bookmarkDb = bookmarkDb;
exports.store = store;
exports.addSite = addSite;
exports.getBookmarks = getBookmarks;
exports.deleteSite = deleteSite;
exports.editSite = editSite;
//# sourceMappingURL=db.js.map