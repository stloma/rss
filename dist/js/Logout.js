'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Logout = undefined;

var _reactBootstrap = require('react-bootstrap');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* globals fetch */
var Logout = exports.Logout = function Logout() {
  var logout = function logout(event) {
    event.preventDefault();
    window.location.replace('/login');
    var fetchData = {
      method: 'GET',
      credentials: 'include'
    };
    fetch('/api/logout', fetchData).then(function (res) {
      if (res.status === 401) {
        console.log('401');
      } else if (res.status !== 200) {
        console.log('Error: ' + res.status);
      } else {
        console.log('logged out');
      }
    }).catch(function (error) {
      return console.log('logout failure: ' + error);
    });
  };

  return _react2.default.createElement(
    'a',
    { onClick: logout, className: 'btn' },
    _react2.default.createElement(_reactBootstrap.Glyphicon, { glyph: 'log-out' }),
    ' Logout'
  );
};