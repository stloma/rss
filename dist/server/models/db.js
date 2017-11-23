'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.store = exports.db = undefined;

var _expressSession = require('express-session');

var _expressSession2 = _interopRequireDefault(_expressSession);

var _mongodb = require('mongodb');

var _connectMongodbSession = require('connect-mongodb-session');

var _connectMongodbSession2 = _interopRequireDefault(_connectMongodbSession);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

exports.db = db;
exports.store = store;
//# sourceMappingURL=db.js.map