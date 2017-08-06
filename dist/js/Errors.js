'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Errors = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactBootstrap = require('react-bootstrap');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Errors = exports.Errors = function Errors(props) {
  return _react2.default.createElement(
    'div',
    { className: 'error' },
    props.errors.map(function (error) {
      return _react2.default.createElement(
        _reactBootstrap.Alert,
        { key: error, bsStyle: 'danger', onDismiss: function onDismiss() {
            return props.closeError(error);
          } },
        _react2.default.createElement(
          'h4',
          null,
          error
        )
      );
    })
  );
};