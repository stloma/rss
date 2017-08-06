'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.router = undefined;

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _user = require('../models/user.js');

var _passport3 = require('../auth/passport.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.get('/logout', _passport3.ensureAuthenticated, function (req, res) {
  req.session.destroy();
  req.logout();
});

router.post('/login', _passport2.default.authenticate('local'), function (req, res) {
  res.status(200).json({ name: res.req.user.name });
});

router.post('/registeruser', function (req, res) {
  var newUser = req.body;
  newUser.created = new Date().getTime();

  (0, _user.validateRegistration)(newUser, validateCb);

  function validateCb(error, result) {
    if (error) {
      res.status(400).json(error);
    } else {
      (0, _user.CreateUser)(newUser, registerCb);
    }
  }

  function registerCb(error, result) {
    if (error) {
      if (error.code === 11000) {
        var inputType = error.message.split('$')[1].split(' ')[0];
        res.status(409).json([inputType + ' already registered']);
        return;
      }
      res.status(500).json({ message: 'Internal Server Error: ' + error });
      return;
    }
    res.status(200).json('Successfully registered ' + newUser.username);
  }
});

exports.router = router;
//# sourceMappingURL=user.js.map