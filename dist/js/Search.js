'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Search = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactBootstrap = require('react-bootstrap');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Search = exports.Search = function Search(props) {
  return _react2.default.createElement(
    'div',
    null,
    _react2.default.createElement(_reactBootstrap.Glyphicon, { id: 'remove-search', onClick: props.clearSearch, glyph: 'remove-sign' }),
    _react2.default.createElement(
      'div',
      null,
      _react2.default.createElement('input', { autoFocus: true, onChange: props.searchTerm, type: 'text', placeholder: 'Search' })
    )
  );
};