'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _user = require('../models/user');

var _passport3 = require('../auth/passport');

var _passport4 = _interopRequireDefault(_passport3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var user = _express2.default.Router();

user.get('/protected', _passport4.default, function (req, res) {
  res.status(200).json({ name: res.req.user.name });
});

user.get('/logout', _passport4.default, function (req, res) {
  req.session.destroy();
  req.logout();
  res.redirect('/login');
});

user.post('/login', _passport2.default.authenticate('local'), function (req, res) {
  res.status(200).json({ name: res.req.user.name });
});

user.post('/registeruser', async function (req, res) {
  var newUser = req.body;
  newUser.created = new Date().getTime();

  var inputErrors = (0, _user.validateRegistration)(newUser);

  if (inputErrors) {
    res.status(400).json(inputErrors);
  }

  try {
    var result = await (0, _user.CreateUser)(newUser);
    if (result === 11000) {
      res.status(409).json([newUser.username + ' already registered, please try another name.']);
    } else {
      res.status(200).json('Successfully registered ' + result.username);
    }
  } catch (error) {
    res.status(500).json('Internal Server Error: ' + error);
  }
});

user.post('/changepassword', _passport4.default, async function (req, res) {
  var userDb = req.session.passport.user;
  var newPassword = req.body;

  // const inputErrors = validateRegistration(newUser)

  // if (inputErrors) { res.status(400).json(inputErrors) }

  try {
    await (0, _user.ChangePassword)(userDb, newPassword);
    res.status(200).json('Password changed successfully');
  } catch (error) {
    res.status(500).json('Internal Server Error: ' + error);
  }
});

exports.default = user;
//# sourceMappingURL=user.js.map