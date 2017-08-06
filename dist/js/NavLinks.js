'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NavLinks = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactBootstrap = require('react-bootstrap');

var _reactRouterDom = require('react-router-dom');

var _Logout = require('./Logout.jsx');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SearchLink = function SearchLink(props) {
  return _react2.default.createElement(
    'li',
    null,
    props.disableSearchLink ? _react2.default.createElement(
      'a',
      { className: 'btn btn-info disabled' },
      _react2.default.createElement(_reactBootstrap.Glyphicon, { glyph: 'search' }),
      ' Search'
    ) : _react2.default.createElement(
      'a',
      { onClick: props.showSearch, className: 'btn' },
      _react2.default.createElement(_reactBootstrap.Glyphicon, { glyph: 'search' }),
      ' Search'
    )
  );
};

var TagsLink = function TagsLink(props) {
  return _react2.default.createElement(
    'li',
    null,
    props.disableTagsLink ? _react2.default.createElement(
      'a',
      { className: 'btn btn-info disabled' },
      _react2.default.createElement(_reactBootstrap.Glyphicon, { glyph: 'cloud' }),
      ' Tag Cloud'
    ) : _react2.default.createElement(
      'a',
      { onClick: props.showTags, className: 'btn' },
      _react2.default.createElement(_reactBootstrap.Glyphicon, { glyph: 'cloud' }),
      ' Tag Cloud'
    )
  );
};

var NewBookmark = function NewBookmark(props) {
  return _react2.default.createElement(
    'li',
    null,
    _react2.default.createElement(
      _reactRouterDom.Link,
      { className: 'btn', to: '/addbookmark' },
      _react2.default.createElement(_reactBootstrap.Glyphicon, { glyph: 'plus' }),
      ' New Bookmark'
    )
  );
};

var NavLinks = exports.NavLinks = function NavLinks(props) {
  var pathname = window.location.pathname;
  var links = void 0;
  switch (pathname) {
    case '/addbookmark':
    case '/editbookmark':
      links = _react2.default.createElement(
        'ul',
        { className: 'nav navbar-nav navbar-right' },
        _react2.default.createElement(
          'li',
          null,
          _react2.default.createElement(_Logout.Logout, null)
        )
      );
      break;
    case '/login':
      links = null;
      break;
    case '/register':
      links = _react2.default.createElement(
        'ul',
        { className: 'nav navbar-nav navbar-right' },
        _react2.default.createElement(
          'li',
          null,
          _react2.default.createElement(
            _reactRouterDom.Link,
            { to: '/login' },
            'Login'
          )
        )
      );
      break;
    default:
      links = _react2.default.createElement(
        'ul',
        { className: 'nav navbar-nav navbar-right' },
        _react2.default.createElement(NewBookmark, null),
        _react2.default.createElement(TagsLink, { showTags: props.showTags, disableTagsLink: props.disableTagsLink }),
        _react2.default.createElement(SearchLink, { showSearch: props.showSearch, disableSearchLink: props.disableSearchLink }),
        _react2.default.createElement(
          'li',
          null,
          _react2.default.createElement(_Logout.Logout, null)
        )
      );

      if (!props.loggedIn) {
        links = null;
      }
  }
  return _react2.default.createElement(
    'div',
    null,
    links
  );
};