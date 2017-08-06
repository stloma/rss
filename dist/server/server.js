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

var _user = require('./models/user.js');

var _user2 = require('./routes/user.js');

var _bookmarks = require('./routes/bookmarks.js');

var _db = require('./models/db.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_sourceMapSupport2.default.install();

var app = (0, _express2.default)();
var LocalStrategy = require('passport-local').Strategy;

app.use(_express2.default.static('dist'));
app.use((0, _cookieParser2.default)());
app.use(_bodyParser2.default.urlencoded({ extended: true }));
app.use(_bodyParser2.default.json());

app.use((0, _expressSession2.default)({
  secret: 'secret',
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
  },
  store: _db.store,
  saveUninitialized: true,
  resave: true
}));

app.use(_passport2.default.initialize());
app.use(_passport2.default.session());

_passport2.default.serializeUser(function (user, done) {
  done(null, user._id);
});

_passport2.default.deserializeUser(function (user, done) {
  done(null, user);
});

_passport2.default.use(new LocalStrategy(function (username, password, done) {
  _db.bookmarkDb.collection('users').findOne({ username: username }).then(function (user) {
    if (!user) {
      return done(null, false, { message: 'Incorrect username.' });
    }
    (0, _user.ComparePassword)(password, user.password, function (isMatch) {
      if (isMatch) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Invalid password.' });
      }
    });
  });
}));

app.use('/api', _user2.router);
app.use('/api', _bookmarks.router);

app.listen(3000, '127.0.0.1', function () {
  console.log('App started on port 3000');
});

app.get('*', function (req, res) {
  res.sendFile(_path2.default.resolve('dist/index.html'));
});
//# sourceMappingURL=server.js.map