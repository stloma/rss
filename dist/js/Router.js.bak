'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactRouterDom = require('react-router-dom');

var _App = require('./App.jsx');

var _App2 = _interopRequireDefault(_App);

var _Navigation = require('./Navigation.jsx');

var _Footer = require('./Footer.jsx');

var _AddBookmark = require('./AddBookmark.jsx');

var _AddBookmark2 = _interopRequireDefault(_AddBookmark);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var contentNode = document.querySelector('#root');
var NoMatch = function NoMatch() {
  return _react2.default.createElement(
    'p',
    null,
    'Page Not Found'
  );
};

var Main = function Main() {
  return _react2.default.createElement(
    _reactRouterDom.Switch,
    null,
    _react2.default.createElement(_reactRouterDom.Route, { exact: true, path: '/', component: _App2.default }),
    _react2.default.createElement(_reactRouterDom.Route, { exact: true, path: '/addbookmark', component: _AddBookmark2.default }),
    _react2.default.createElement(_reactRouterDom.Route, { path: '/deletebookmark/:id', component: _App2.default }),
    _react2.default.createElement(_reactRouterDom.Route, { path: '*', component: NoMatch })
  );
};

var Container = function Container() {
  return _react2.default.createElement(
    'div',
    null,
    _react2.default.createElement(_Navigation.Navigation, null),
    _react2.default.createElement(Main, null),
    _react2.default.createElement(_Footer.Footer, null)
  );
};

_reactDom2.default.render(_react2.default.createElement(
  _reactRouterDom.BrowserRouter,
  null,
  _react2.default.createElement(Container, null)
), contentNode);

if (module.hot) {
  module.hot.accept();
}