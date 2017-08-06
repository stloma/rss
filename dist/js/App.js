'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactTagcloud = require('react-tagcloud');

var _reactBootstrap = require('react-bootstrap');

var _Search = require('./Search.jsx');

var _BookmarkTable = require('./BookmarkTable.jsx');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* global fetch */

var App = function (_React$Component) {
  _inherits(App, _React$Component);

  function App() {
    _classCallCheck(this, App);

    var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this));

    _this.state = {
      bookmarks: [],
      tagcount: [],
      searchTerm: '',
      filterByTag: ''
    };
    _this.loadData = _this.loadData.bind(_this);
    _this.searchTerm = _this.searchTerm.bind(_this);
    _this.onDeleteClick = _this.onDeleteClick.bind(_this);
    _this.filterByTag = _this.filterByTag.bind(_this);
    _this.clearTagFilter = _this.clearTagFilter.bind(_this);
    _this.onInfoClick = _this.onInfoClick.bind(_this);
    _this.clearSearch = _this.clearSearch.bind(_this);
    return _this;
  }

  _createClass(App, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.loadData();
    }
  }, {
    key: 'onDeleteClick',
    value: function onDeleteClick(id) {
      var _this2 = this;

      var fetchData = {
        method: 'DELETE',
        credentials: 'include'
      };
      fetch('/api/bookmarks/' + id, fetchData).then(function (response) {
        if (!response.ok) {
          console.log('Failed to delete bookmark: ' + id);
        } else _this2.loadData();
      });
    }
  }, {
    key: 'onInfoClick',
    value: function onInfoClick(id) {
      console.log('Clicked info for site: ', id);
    }
  }, {
    key: 'loadData',
    value: function loadData() {
      var _this3 = this;

      var fetchData = {
        method: 'GET',
        credentials: 'include'
      };

      fetch('/api/bookmarks', fetchData).then(function (response) {
        if (response.ok) {
          response.json().then(function (data) {
            _this3.setState({
              bookmarks: data.records,
              tagcount: data.tagcount
            });
          });
        } else {
          response.json().then(function (error) {
            console.log('Failed to fetch issues: ' + error.message);
          });
        }
      }).catch(function (err) {
        console.log('Error in fetching data from server: ', err);
      });
    }
  }, {
    key: 'searchTerm',
    value: function searchTerm(event) {
      this.setState({ searchTerm: event.target.value });
    }
  }, {
    key: 'filterByTag',
    value: function filterByTag(event) {
      this.setState({ filterByTag: event.value });
    }
  }, {
    key: 'clearTagFilter',
    value: function clearTagFilter(event) {
      this.setState({ filterByTag: '' });
      this.props.showTagsFn();
    }
  }, {
    key: 'clearSearch',
    value: function clearSearch() {
      this.setState({ searchTerm: '' });
      this.props.showSearchFn();
    }
  }, {
    key: 'render',
    value: function render() {
      var options = {
        luminosity: 'light',
        disableRandomColor: true
      };

      return _react2.default.createElement(
        'div',
        { id: 'pattern' },
        _react2.default.createElement(
          'div',
          { className: 'container' },
          this.props.showTags && _react2.default.createElement(
            'div',
            { className: 'well', id: 'tagcloud' },
            _react2.default.createElement(_reactBootstrap.Glyphicon, { id: 'remove-search', onClick: this.clearTagFilter, glyph: 'remove-sign' }),
            _react2.default.createElement(_reactTagcloud.TagCloud, {
              minSize: 12, maxSize: 35,
              colorOptions: options, className: 'simple-cloud',
              tags: this.state.tagcount,
              onClick: this.filterByTag,
              shuffle: false
            })
          ),
          this.props.showSearch && _react2.default.createElement(
            'div',
            { id: 'search' },
            _react2.default.createElement(_Search.Search, {
              showSearch: this.props.showSearchFn,
              clearSearch: this.clearSearch,
              searchTerm: this.searchTerm
            })
          ),
          _react2.default.createElement(_BookmarkTable.BookmarkTable, {
            onDeleteClick: this.onDeleteClick,
            onInfoClick: this.onInfoClick,
            searchTerm: this.state.searchTerm,
            bookmarks: this.state.bookmarks,
            filterByTag: this.state.filterByTag
          })
        )
      );
    }
  }]);

  return App;
}(_react2.default.Component);

exports.default = App;