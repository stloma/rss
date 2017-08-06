'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouterDom = require('react-router-dom');

var _Errors = require('./Errors.jsx');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* globals fetch */


var Login = function (_React$Component) {
  _inherits(Login, _React$Component);

  function Login() {
    _classCallCheck(this, Login);

    var _this = _possibleConstructorReturn(this, (Login.__proto__ || Object.getPrototypeOf(Login)).call(this));

    _this.state = {
      username: '',
      password: '',
      errors: false
    };
    _this.handleInputChange = _this.handleInputChange.bind(_this);
    _this.handleSubmit = _this.handleSubmit.bind(_this);
    _this.closeError = _this.closeError.bind(_this);
    return _this;
  }

  _createClass(Login, [{
    key: 'handleInputChange',
    value: function handleInputChange(event) {
      var target = event.target;
      var value = target.value;
      var name = target.name;

      this.setState(_defineProperty({}, name, value));
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
      var _this2 = this;

      event.preventDefault();
      var data = 'username=' + this.state.username + '&password=' + this.state.password;
      var fetchData = {
        method: 'post',
        credentials: 'include',
        headers: {
          'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        body: data
      };
      fetch('/api/login', fetchData).then(function (response) {
        if (response.ok) {
          window.location.replace('/');
        } else if (response.status === 401) {
          _this2.setState({ errors: ['Username or password incorrect'] });
        } else if (response.status === 400) {
          _this2.setState({ errors: ['Please enter a username and password'] });
        }
      }).catch(function (err) {
        console.log('Login failure: ' + err);
      });
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
          { className: 'container well', id: 'login' },
          _react2.default.createElement(
            'form',
            { method: 'POST', action: '/api/login', name: 'Login', onSubmit: this.handleSubmit },
            _react2.default.createElement(
              'fieldset',
              null,
              _react2.default.createElement(
                'legend',
                null,
                'Login'
              ),
              _react2.default.createElement(
                'div',
                { className: 'form-group' },
                _react2.default.createElement(
                  'label',
                  null,
                  'Username:'
                ),
                _react2.default.createElement('input', {
                  autoFocus: true, onChange: this.handleInputChange,
                  onSubmit: this.handleSubmit,
                  type: 'text',
                  className: 'form-control',
                  name: 'username',
                  value: this.state.username,
                  placeholder: 'username',
                  id: 'username'
                }),
                _react2.default.createElement(
                  'label',
                  null,
                  'Password:'
                ),
                _react2.default.createElement('input', {
                  onChange: this.handleInputChange,
                  type: 'password ', className: 'form-control',
                  name: 'password',
                  placeholder: 'password',
                  id: 'password'
                }),
                _react2.default.createElement(
                  'div',
                  { className: 'form-group' },
                  _react2.default.createElement(
                    'div',
                    { className: 'form-button' },
                    _react2.default.createElement(
                      'button',
                      { type: 'submit', className: 'btn btn-primary' },
                      'Submit'
                    )
                  )
                )
              ),
              _react2.default.createElement(
                'div',
                { className: 'center-text' },
                'Don\'t have an account? ',
                _react2.default.createElement(
                  _reactRouterDom.Link,
                  { to: '/register' },
                  'Register'
                )
              )
            )
          )
        )
      );
    }
  }]);

  return Login;
}(_react2.default.Component);

exports.default = Login;