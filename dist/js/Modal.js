'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ModalContainer = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactBootstrap = require('react-bootstrap');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ModalContainer = exports.ModalContainer = function ModalContainer(props) {
  return _react2.default.createElement(
    'div',
    null,
    _react2.default.createElement(
      _reactBootstrap.Modal,
      { bsSize: 'small', 'aria-labelledby': 'contained-modal-title-sm', show: props.showModal, onHide: props.closeModal },
      _react2.default.createElement(
        _reactBootstrap.Modal.Header,
        { closeButton: true },
        _react2.default.createElement(
          _reactBootstrap.Modal.Title,
          { id: 'contained-modal-title-sm' },
          'Confirm Delete'
        )
      ),
      _react2.default.createElement(
        _reactBootstrap.Modal.Body,
        null,
        _react2.default.createElement(
          'div',
          { className: 'modal-text' },
          _react2.default.createElement(
            'h4',
            null,
            'Are you sure you want to delete'
          ),
          _react2.default.createElement(
            'h3',
            null,
            props.modalTitle.name,
            '?'
          )
        )
      ),
      _react2.default.createElement(
        _reactBootstrap.Modal.Footer,
        null,
        _react2.default.createElement(
          'button',
          {
            className: 'btn btn-danger modal-delete',
            onClick: function onClick() {
              return props.confirmDelete(props.showModal.id);
            } },
          'Delete'
        ),
        _react2.default.createElement(
          'button',
          {
            className: 'btn btn-default modal-close',
            onClick: props.closeModal },
          'Cancel'
        )
      )
    )
  );
};