'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouterDom = require('react-router-dom');

var _App = require('./App.jsx');

var _App2 = _interopRequireDefault(_App);

var _Navigation = require('./Navigation.jsx');

var _Footer = require('./Footer.jsx');

var _AddBookmark = require('./AddBookmark.jsx');

var _AddBookmark2 = _interopRequireDefault(_AddBookmark);

var _Login = require('./Login.jsx');

var _Login2 = _interopRequireDefault(_Login);

var _Register = require('./Register.jsx');

var _Register2 = _interopRequireDefault(_Register);

var _Loading = require('./Loading.jsx');

var _EditBookmark = require('./EditBookmark.jsx');

var _EditBookmark2 = _interopRequireDefault(_EditBookmark);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* globals fetch */

/*
const AuthNotifier = (props) => {
console.log('auth notifier: ' + props.loggedIn)
if (props.loggedIn) {
  return (
    <div className='auth-notifier'>Welcome</div>
  )
}
return <div>Please log in</div>
}
*/

function isAuthenticated(cb) {
  var fetchOptions = {
    method: 'GET',
    credentials: 'include'
  };
  fetch('/api/protected', fetchOptions).then(function (response) {
    cb(response.ok);
  });
}

var Main = function Main(props) {
  if (props.loggedIn) {
    return _react2.default.createElement(
      _reactRouterDom.Switch,
      null,
      _react2.default.createElement(_reactRouterDom.Route, { exact: true, path: '/', render: function render() {
          return _react2.default.createElement(_App2.default, {
            showSearch: props.showSearch,
            showTags: props.showTags,
            history: props.history,
            showSearchFn: props.showSearchFn,
            showTagsFn: props.showTagsFn
          });
        } }),
      _react2.default.createElement(_reactRouterDom.Route, { exact: true, path: '/addbookmark', component: _AddBookmark2.default }),
      _react2.default.createElement(_reactRouterDom.Route, { exact: true, path: '/editbookmark', component: _EditBookmark2.default }),
      _react2.default.createElement(_reactRouterDom.Route, { exact: true, path: '/login', component: _Login2.default }),
      _react2.default.createElement(_reactRouterDom.Route, { exact: true, path: '/register', component: _Register2.default }),
      _react2.default.createElement(_reactRouterDom.Route, { path: '/deletebookmark/:id', component: _App2.default }),
      _react2.default.createElement(_reactRouterDom.Route, { path: '*', component: NoMatch })
    );
  }
  return _react2.default.createElement(
    _reactRouterDom.Switch,
    null,
    _react2.default.createElement(_reactRouterDom.Route, { exact: true, path: '/register', component: _Register2.default }),
    _react2.default.createElement(_reactRouterDom.Route, { path: '*', component: _Login2.default })
  );
};

var Container = function (_React$Component) {
  _inherits(Container, _React$Component);

  function Container() {
    _classCallCheck(this, Container);

    var _this = _possibleConstructorReturn(this, (Container.__proto__ || Object.getPrototypeOf(Container)).call(this));

    _this.state = {
      showTags: false,
      showSearch: false,
      loggedIn: false,
      loading: true
    };
    _this.showTags = _this.showTags.bind(_this);
    _this.showSearch = _this.showSearch.bind(_this);
    return _this;
  }

  /*
  static propTypes = {
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
  }
  */

  _createClass(Container, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      isAuthenticated(function (loggedIn) {
        if (loggedIn) {
          _this2.setState({ loggedIn: true });
          console.log('logged in');
        } else {
          _this2.setState({ loggedIn: false });
        }
        setTimeout(function () {
          this.setState({ loading: false });
        }.bind(_this2), 1000);
      });
    }
  }, {
    key: 'showTags',
    value: function showTags() {
      this.setState({ showSearch: false });
      this.setState({ showTags: !this.state.showTags });
    }
  }, {
    key: 'showSearch',
    value: function showSearch() {
      this.setState({ showTags: false });
      this.setState({ showSearch: !this.state.showSearch });
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          history = _props.history,
          location = _props.location;


      if (this.state.loading) {
        return _react2.default.createElement(_Loading.Loading, null);
      }
      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(_Navigation.Navigation, {
          showTags: this.showTags,
          showSearch: this.showSearch,
          disableTagsLink: this.state.showTags,
          disableSearchLink: this.state.showSearch,
          loggedIn: this.state.loggedIn
        }),
        _react2.default.createElement(Main, {
          loggedIn: this.state.loggedIn,
          showTags: this.state.showTags,
          showSearch: this.state.showSearch,
          showSearchFn: this.showSearch,
          showTagsFn: this.showTags,
          history: history,
          location: location
        }),
        _react2.default.createElement(_Footer.Footer, null)
      );
    }
  }]);

  return Container;
}(_react2.default.Component);
// const { from } = this.props.location.state || { from: { pathname: '/' } }

var ContainerWithRouter = (0, _reactRouterDom.withRouter)(Container);
var contentNode = document.querySelector('#root');

var NoMatch = function NoMatch() {
  return _react2.default.createElement(
    'div',
    { className: 'container' },
    _react2.default.createElement(
      'h2',
      null,
      'Page Not Found'
    )
  );
};

_reactDom2.default.render(_react2.default.createElement(
  _reactRouterDom.BrowserRouter,
  null,
  _react2.default.createElement(ContainerWithRouter, null)
), contentNode);

if (module.hot) {
  module.hot.accept();
}