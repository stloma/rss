'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Loading = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactLoading = require('react-loading');

var _reactLoading2 = _interopRequireDefault(_reactLoading);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Loading = exports.Loading = function Loading() {
  return _react2.default.createElement(
    'div',
    { className: 'loading' },
    _react2.default.createElement(_reactLoading2.default, { type: 'bars', color: 'black' })
  );
};