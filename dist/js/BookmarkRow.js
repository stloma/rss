'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BookmarkRow = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactBootstrap = require('react-bootstrap');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var BookmarkRow = exports.BookmarkRow = function BookmarkRow(props) {
  var trash = _react2.default.createElement(
    _reactBootstrap.Tooltip,
    { id: 'modal-tooltip' },
    'Delete'
  );
  var edit = _react2.default.createElement(
    _reactBootstrap.Tooltip,
    { id: 'modal-tooltip' },
    'Edit'
  );
  var tags = void 0;
  if (props.bookmark.tags) {
    tags = props.bookmark.tags.split(' ').map(function (tag) {
      return _react2.default.createElement(
        'button',
        { onClick: function onClick() {
            return props.filterByTag(tag);
          },
          key: props.bookmark._id + tag,
          type: 'button', className: 'btn btn-xs tag-button' },
        tag
      );
    });
  }

  return _react2.default.createElement(
    'tr',
    { className: 'active' },
    _react2.default.createElement(
      'td',
      null,
      _react2.default.createElement(
        'a',
        { href: props.bookmark.url },
        _react2.default.createElement('img', {
          className: 'favicon', src: '/images/' + props.bookmark.favicon,
          height: '20', width: '20'
        }),
        props.bookmark.name
      )
    ),
    _react2.default.createElement(
      'td',
      null,
      tags
    ),
    _react2.default.createElement(
      'td',
      null,
      props.bookmark.comment
    ),
    _react2.default.createElement(
      'td',
      null,
      new Date(props.bookmark.created).toLocaleDateString()
    ),
    _react2.default.createElement(
      'td',
      null,
      _react2.default.createElement(
        _reactBootstrap.OverlayTrigger,
        { placement: 'bottom', overlay: edit },
        _react2.default.createElement(
          _reactBootstrap.Button,
          {
            className: 'table-actions', bsSize: 'xsmall',
            onClick: function onClick() {
              return props.edit(props.bookmark);
            } },
          _react2.default.createElement(_reactBootstrap.Glyphicon, { glyph: 'edit' })
        )
      ),
      _react2.default.createElement(
        _reactBootstrap.OverlayTrigger,
        { placement: 'bottom', overlay: trash },
        _react2.default.createElement(
          _reactBootstrap.Button,
          {
            className: 'table-actions', bsSize: 'xsmall',
            onClick: function onClick() {
              return props.showModal(props.bookmark._id, props.bookmark.name);
            } },
          _react2.default.createElement(_reactBootstrap.Glyphicon, { glyph: 'trash' })
        )
      )
    )
  );
};