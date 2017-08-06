'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Navigation = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouterDom = require('react-router-dom');

var _Logout = require('./Logout.jsx');

var _NavLinks = require('./NavLinks.jsx');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Navigation = exports.Navigation = function (_React$Component) {
  _inherits(Navigation, _React$Component);

  function Navigation() {
    _classCallCheck(this, Navigation);

    var _this = _possibleConstructorReturn(this, (Navigation.__proto__ || Object.getPrototypeOf(Navigation)).call(this));

    _this.state = {
      navCollapsed: true
    };
    _this.toggleNavCollapse = _this.toggleNavCollapse.bind(_this);
    return _this;
  }

  _createClass(Navigation, [{
    key: 'toggleNavCollapse',
    value: function toggleNavCollapse() {
      this.setState({ navCollapsed: !this.state.navCollapsed });
    }
  }, {
    key: 'render',
    value: function render() {
      var navCollapsed = this.state.navCollapsed;
      var _props = this.props,
          loggedIn = _props.loggedIn,
          showTags = _props.showTags,
          showSearch = _props.showSearch,
          disableSearchLink = _props.disableSearchLink,
          disableTagsLink = _props.disableTagsLink;


      return _react2.default.createElement(
        'nav',
        { className: 'navbar navbar-default' },
        _react2.default.createElement(
          'div',
          { className: 'container' },
          _react2.default.createElement(
            'div',
            { className: 'navbar-header' },
            _react2.default.createElement(
              _reactRouterDom.Link,
              { to: '/' },
              _react2.default.createElement(
                'span',
                { id: 'logo' },
                _react2.default.createElement('img', { src: '/images/logo.png', style: { width: 25 } }),
                ' Bookmark Manager'
              )
            ),
            _react2.default.createElement(
              'button',
              {
                'aria-expanded': 'false',
                className: 'navbar-toggle collapsed',
                onClick: this.toggleNavCollapse,
                type: 'button'
              },
              _react2.default.createElement(
                'span',
                { className: 'sr-only' },
                'Toggle navigation'
              ),
              _react2.default.createElement('span', { className: 'icon-bar' }),
              _react2.default.createElement('span', { className: 'icon-bar' }),
              _react2.default.createElement('span', { className: 'icon-bar' })
            )
          ),
          _react2.default.createElement(
            'div',
            { className: (navCollapsed ? 'collapse' : '') + ' navbar-collapse' },
            _react2.default.createElement(_NavLinks.NavLinks, {
              showTags: showTags,
              disableTagsLink: disableTagsLink,
              showSearch: showSearch,
              disableSearchLink: disableSearchLink,
              loggedIn: loggedIn
            })
          )
        )
      );
    }
  }]);

  return Navigation;
}(_react2.default.Component);