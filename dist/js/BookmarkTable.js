'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BookmarkTable = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactBootstrap = require('react-bootstrap');

var _reactRouterDom = require('react-router-dom');

var _lodash = require('lodash');

var _Modal = require('./Modal.jsx');

var _BookmarkRow = require('./BookmarkRow.jsx');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BookmarkTable = exports.BookmarkTable = function (_React$Component) {
  _inherits(BookmarkTable, _React$Component);

  function BookmarkTable() {
    _classCallCheck(this, BookmarkTable);

    var _this = _possibleConstructorReturn(this, (BookmarkTable.__proto__ || Object.getPrototypeOf(BookmarkTable)).call(this));

    _this.state = {
      showModal: false,
      filterByTag: '',
      editBookmark: false,
      modalBody: '',
      sortBy: 'name',
      sortOrder: 'desc'
    };
    _this.showModal = _this.showModal.bind(_this);
    _this.closeModal = _this.closeModal.bind(_this);
    _this.confirmDelete = _this.confirmDelete.bind(_this);
    _this.filterByTag = _this.filterByTag.bind(_this);
    _this.edit = _this.edit.bind(_this);
    _this.sort = _this.sort.bind(_this);
    _this.clearTags = _this.clearTags.bind(_this);
    return _this;
  }

  _createClass(BookmarkTable, [{
    key: 'showModal',
    value: function showModal(id, name) {
      var modalBody = _react2.default.createElement(
        'div',
        { className: 'modal-buttons' },
        _react2.default.createElement(
          'button',
          {
            className: 'btn btn-warning modal-delete',
            onClick: this.confirmDelete },
          'Delete'
        ),
        _react2.default.createElement(
          'button',
          {
            className: 'btn btn-default modal-cancel',
            onClick: this.closeModal },
          'Close'
        )
      );

      this.setState({
        showModal: { id: id, name: name },
        modalBody: modalBody
      });
    }
  }, {
    key: 'closeModal',
    value: function closeModal() {
      this.setState({ showModal: false });
    }
  }, {
    key: 'confirmDelete',
    value: function confirmDelete(id) {
      this.props.onDeleteClick(this.state.showModal.id);
      this.setState({ showModal: false });
    }
  }, {
    key: 'filterByTag',
    value: function filterByTag(tag) {
      this.setState({ filterByTag: tag });
    }
  }, {
    key: 'clearTags',
    value: function clearTags() {
      this.setState({ filterByTag: '' });
    }
  }, {
    key: 'sort',
    value: function sort(e) {
      var sortBy = e.currentTarget.id.split('-')[1];

      console.log(this.state.sortOrder);
      var order = this.state.sortBy === sortBy ? this.state.sortOrder === 'desc' ? 'asc' : 'desc' : 'desc';

      this.setState({ sortOrder: order });
      this.setState({ sortBy: sortBy });
    }
  }, {
    key: 'edit',
    value: function edit(bookmark) {
      this.setState({ editBookmark: bookmark });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      if (this.state.editBookmark) {
        return _react2.default.createElement(_reactRouterDom.Redirect, {
          push: true,
          to: {
            pathname: '/editbookmark',
            state: { bookmark: this.state.editBookmark }
          } });
      }

      var filter = this.props.searchTerm ? this.props.searchTerm : this.props.filterByTag ? this.props.filterByTag : this.state.filterByTag ? this.state.filterByTag : '';

      var sortBy = this.state.sortBy;
      var order = this.state.sortOrder;

      var sorted = (0, _lodash.sortBy)(this.props.bookmarks, sortBy, order);

      if (order === 'asc') {
        sorted.reverse();
      }

      var bookmarkRows = sorted.filter(function (bookmark) {
        return (bookmark.name + ' ' + bookmark.url + ' ' + bookmark.comment + ' ' + bookmark.tags).toUpperCase().indexOf(filter.toUpperCase()) >= 0;
      }).map(function (bookmark) {
        return _react2.default.createElement(_BookmarkRow.BookmarkRow, {
          onDeleteClick: _this2.props.onDeleteClick,
          showModal: _this2.showModal,
          closeModal: _this2.closeModal,
          filterByTag: _this2.filterByTag,
          edit: _this2.edit,
          key: bookmark._id,
          bookmark: bookmark
        });
      });

      var tagHeading = void 0;
      if (this.state.filterByTag) {
        tagHeading = _react2.default.createElement(
          'th',
          { width: '35%' },
          'Tags',
          _react2.default.createElement(
            'span',
            { id: 'clear-tags' },
            _react2.default.createElement(_reactBootstrap.Glyphicon, {
              onClick: this.clearTags,
              glyph: 'remove-sign'
            })
          )
        );
      } else {
        tagHeading = _react2.default.createElement(
          'th',
          { width: '35%' },
          'Tags'
        );
      }

      return _react2.default.createElement(
        'div',
        null,
        this.state.showModal && _react2.default.createElement(_Modal.ModalContainer, {
          modalBody: this.state.modalBody,
          modalTitle: this.state.showModal,
          showModal: true,
          closeModal: this.closeModal,
          confirmDelete: this.confirmDelete
        }),
        _react2.default.createElement(
          'table',
          { className: 'table table-striped table-hover' },
          _react2.default.createElement(
            'thead',
            null,
            _react2.default.createElement(
              'tr',
              { className: 'active' },
              _react2.default.createElement(
                'th',
                { width: '15%' },
                _react2.default.createElement(
                  'span',
                  { className: 'table-heading-sort' },
                  'Name'
                ),
                _react2.default.createElement(_reactBootstrap.Glyphicon, {
                  className: 'sort-button',
                  id: 'sort-name',
                  onClick: function onClick(e) {
                    return _this2.sort(e);
                  },
                  glyph: 'sort'
                })
              ),
              tagHeading,
              _react2.default.createElement(
                'th',
                { width: '25%' },
                'Comment'
              ),
              _react2.default.createElement(
                'th',
                { width: '10%' },
                _react2.default.createElement(
                  'span',
                  { className: 'table-heading-sort' },
                  'Created'
                ),
                _react2.default.createElement(_reactBootstrap.Glyphicon, {
                  className: 'sort-button',
                  id: 'sort-created',
                  onClick: function onClick(e) {
                    return _this2.sort(e);
                  },
                  glyph: 'sort'
                })
              ),
              _react2.default.createElement(
                'th',
                { width: '10%' },
                'Edit/Delete'
              )
            )
          ),
          _react2.default.createElement(
            'tbody',
            null,
            bookmarkRows
          )
        )
      );
    }
  }]);

  return BookmarkTable;
}(_react2.default.Component);