'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _sourceMapSupport = require('source-map-support');

var _sourceMapSupport2 = _interopRequireDefault(_sourceMapSupport);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _expressSession = require('express-session');

var _expressSession2 = _interopRequireDefault(_expressSession);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _cookieParser = require('cookie-parser');

var _cookieParser2 = _interopRequireDefault(_cookieParser);

var _feeds = require('./routes/feeds');

var _feeds2 = _interopRequireDefault(_feeds);

var _user = require('./routes/user');

var _user2 = _interopRequireDefault(_user);

var _user3 = require('./models/user');

var _db = require('./models/db');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_sourceMapSupport2.default.install();

var app = (0, _express2.default)();
var LocalStrategy = require('passport-local').Strategy;

app.use(_express2.default.static('dist'));
app.use((0, _cookieParser2.default)());
app.use(_bodyParser2.default.urlencoded({ extended: true }));
app.use(_bodyParser2.default.json());

var config = require('./.session-secret');

app.use((0, _expressSession2.default)({
  secret: config.secret,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
  },
  store: _db.store,
  saveUninitialized: true,
  resave: true
}));

app.use(_passport2.default.initialize());
app.use(_passport2.default.session());

_passport2.default.serializeUser(function (loginUser, done) {
  done(null, loginUser._id);
});

_passport2.default.deserializeUser(async function (loginUser, done) {
  done(null, loginUser);
});

_passport2.default.use(new LocalStrategy(async function (username, password, done) {
  try {
    var userExists = await _db.db.rssDb.collection('users').findOne({ username: username });
    if (!userExists) {
      return done(null, false);
    }
    var isMatch = await (0, _user3.ComparePassword)(password, userExists.password);
    if (!isMatch) {
      return done(null, false);
    }
    return done(null, userExists);
  } catch (error) {
    return done(error);
  }
}));

app.use('/api', _feeds2.default);
app.use('/api', _user2.default);

app.listen(3002, '127.0.0.1', function () {
  console.log('App started on port 3002');
});

app.get('*', function (req, res) {
  res.sendFile(_path2.default.resolve('dist/index.html'));
});
//# sourceMappingURL=server.js.map