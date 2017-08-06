'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Errors = require('./Errors.jsx');

var _reactRouterDom = require('react-router-dom');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* globals fetch */

var Register = function (_React$Component) {
  _inherits(Register, _React$Component);

  function Register() {
    _classCallCheck(this, Register);

    var _this = _possibleConstructorReturn(this, (Register.__proto__ || Object.getPrototypeOf(Register)).call(this));

    _this.state = {
      user: [],
      errors: false
    };
    _this.handleSubmit = _this.handleSubmit.bind(_this);
    _this.cancel = _this.cancel.bind(_this);
    _this.closeError = _this.closeError.bind(_this);
    return _this;
  }

  _createClass(Register, [{
    key: 'createUser',
    value: function createUser(newUser) {
      var _this2 = this;

      fetch('/api/registeruser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      }).then(function (response) {
        if (response.ok) {
          _this2.props.history.push('/');
        } else {
          response.json().then(function (errors) {
            _this2.setState({ errors: errors });
          });
        }
      }).catch(function (err) {
        console.log('Error in sending data to server: ' + err.message);
      });
    }
  }, {
    key: 'closeError',
    value: function closeError(removeError) {
      var errors = this.state.errors.filter(function (error) {
        return error !== removeError;
      });
      this.setState({ errors: errors });
    }
  }, {
    key: 'handleSubmit',
    value: function handleSubmit(event) {
      event.preventDefault();
      var form = document.forms.UserAdd;
      this.createUser({
        name: form.name.value,
        username: form.username.value,
        email: form.email.value,
        password: form.password.value
      });
    }
  }, {
    key: 'cancel',
    value: function cancel() {
      this.props.history.goBack();
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        { id: 'pattern' },
        this.state.errors && _react2.default.createElement(_Errors.Errors, { closeError: this.closeError, errors: this.state.errors }),
        _react2.default.createElement(
          'div',
          { className: 'container well', id: 'register' },
          _react2.default.createElement(
            'form',
            { method: 'post', name: 'UserAdd', onSubmit: this.handleSubmit },
            _react2.default.createElement(
              'fieldset',
              null,
              _react2.default.createElement(
                'legend',
                null,
                'Register'
              ),
              _react2.default.createElement(
                'div',
                { className: 'form-group' },
                _react2.default.createElement(
                  'label',
                  { className: 'control-label' },
                  'Name'
                ),
                _react2.default.createElement('input', {
                  type: 'text',
                  className: 'form-control',
                  name: 'name',
                  placeholder: 'Name'
                }),
                _react2.default.createElement(
                  'label',
                  { className: 'control-label' },
                  'Username'
                ),
                _react2.default.createElement('input', {
                  type: 'text',
                  className: 'form-control',
                  name: 'username',
                  placeholder: 'Username'
                }),
                _react2.default.createElement(
                  'label',
                  { className: 'control-label' },
                  'Email'
                ),
                _react2.default.createElement('input', {
                  type: 'text',
                  className: 'form-control',
                  name: 'email',
                  placeholder: 'Email'
                }),
                _react2.default.createElement(
                  'label',
                  { className: 'control-label' },
                  'Password'
                ),
                _react2.default.createElement('input', {
                  type: 'password',
                  className: 'form-control',
                  name: 'password',
                  placeholder: 'Password'
                }),
                _react2.default.createElement(
                  'div',
                  { className: 'form-group' },
                  _react2.default.createElement(
                    'div',
                    { className: 'form-button' },
                    _react2.default.createElement(
                      'button',
                      { onClick: this.cancel, type: 'reset', className: 'btn btn-default' },
                      'Cancel'
                    ),
                    _react2.default.createElement(
                      'button',
                      { type: 'submit', className: 'btn btn-primary' },
                      'Submit'
                    )
                  )
                ),
                _react2.default.createElement(
                  'div',
                  { className: 'center-text' },
                  'Already have an account? ',
                  _react2.default.createElement(
                    _reactRouterDom.Link,
                    { to: '/login' },
                    'Login'
                  )
                )
              )
            )
          )
        )
      );
    }
  }]);

  return Register;
}(_react2.default.Component);

exports.default = Register;