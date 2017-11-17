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

var _cookieParser = require('cookie-parser');

var _cookieParser2 = _interopRequireDefault(_cookieParser);

var _feeds = require('./routes/feeds');

var _feeds2 = _interopRequireDefault(_feeds);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_sourceMapSupport2.default.install();

var app = (0, _express2.default)();

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
  saveUninitialized: true,
  resave: true
}));

app.use('/api', _feeds2.default);

app.listen(3002, '127.0.0.1', function () {
  console.log('App started on port 3002');
});

app.get('*', function (req, res) {
  res.sendFile(_path2.default.resolve('dist/index.html'));
});
//# sourceMappingURL=server.js.map