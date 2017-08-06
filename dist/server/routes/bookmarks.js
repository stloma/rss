'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.router = undefined;

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _mongodb = require('mongodb');

var _passport = require('../auth/passport.js');

var _db = require('../models/db.js');

var _bookmark = require('../models/bookmark.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.get('/protected', _passport.ensureAuthenticated, function (req, res) {
  res.status(200).json({ name: res.req.user.name });
});

router.get('/bookmarks', _passport.ensureAuthenticated, function (req, res) {
  var userDb = req.session.passport.user;

  (0, _db.getBookmarks)(userDb, function (error, result) {
    if (error) {
      res.status(500).json({ message: 'Internal Server Error: ' + error });
      throw error;
    }
    res.json(result);
  });
});

router.post('/bookmarks', _passport.ensureAuthenticated, function (req, res) {
  var userDb = req.session.passport.user;
  var newSite = req.body;
  newSite.created = new Date().getTime();
  var errors = (0, _bookmark.validateSite)(newSite);
  if (errors) {
    res.status(400).json(errors);
    return;
  }

  (0, _db.addSite)('bookmarks.' + userDb, newSite, function (error, result) {
    if (error) {
      res.status(500).json({ message: 'Internal Server Error: ' + error });
    }
    res.status(200).send('1 record inserted');
  });
});

router.delete('/bookmarks/:id', _passport.ensureAuthenticated, function (req, res) {
  var userDb = req.session.passport.user;
  var bookmarkId = void 0;
  try {
    bookmarkId = new _mongodb.ObjectId(req.params.id);
  } catch (error) {
    res.status(422).json({ message: 'Invalid issue ID format: ' + error });
    return;
  }

  (0, _db.deleteSite)('bookmarks.' + userDb, bookmarkId, function (error, result) {
    if (error) {
      if (error === '404') {
        res.status(404).json({ message: 'Delete object not found' });
        return;
      }
      res.status(500).json({ message: 'Internal Server Error: ' + error });
      return;
    }res.status(200).json({ message: 'Successfully deleted object' });
  });
});

router.patch('/bookmarks', _passport.ensureAuthenticated, function (req, res) {
  var userDb = req.session.passport.user;
  var site = req.body;
  site.updated = new Date().getTime();

  var errors = (0, _bookmark.validateEdit)(site);
  if (errors) {
    res.status(422).json(errors);
    return;
  }

  (0, _db.editSite)('bookmarks.' + userDb, site, function (error, result) {
    if (error) throw error;
    res.status(200).json('Edit site success');
  });
});

exports.router = router;
//# sourceMappingURL=bookmarks.js.map