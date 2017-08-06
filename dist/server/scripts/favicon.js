'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.download = undefined;

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var download = exports.download = function download(url, id, callback) {
  (0, _request2.default)({
    url: url + '/favicon.ico',
    encoding: null,
    followRedirect: true,
    timeout: 5000,
    maxRedirect: 5
  }, function (err, res, body) {
    if (err) {
      callback(err);
    } else if (res.statusCode === 200) {
      _fs2.default.writeFile(_path2.default.join(__dirname, '../../../dist/images/favicons/') + id + '.ico', body, function (err) {
        if (err) {
          callback(err);
        }
        callback(null, 'success');
      });
    }
  });
};
//# sourceMappingURL=favicon.js.map