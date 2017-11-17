'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _db = require('../models/db');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var feeds = _express2.default.Router();

// Start called by Router.jsx
//
feeds.get('/feeds', async function (req, res) {
  // let userDb = req.session.passport.user
  var userDb = 'user1';

  try {
    var result = await (0, _db.getFeeds)(userDb);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error: ' + error });
  }
});

feeds.post('/articles', async function (req, res) {
  var _req$body = req.body,
      name = _req$body.name,
      url = _req$body.url,
      category = _req$body.category;
  // let userDb = req.session.passport.user

  var userDb = 'user1';

  try {
    await (0, _db.refreshArticles)(userDb, category, name, url);
    res.status(200).json({ status: 'refresh success' });
  } catch (error) {
    res.status(500).json({ status: url + ' refresh failure: ' + error });
  }
});
// End called by Router.jsx
//
//

// Started called by EditCategories.jsx
//
feeds.post('/editcategories', async function (req, res) {
  var _req$body2 = req.body,
      _id = _req$body2._id,
      name = _req$body2.name,
      toDelete = _req$body2.toDelete;

  var userDb = 'user1';

  if (name) {
    try {
      await (0, _db.addCategory)(userDb, name, _id);
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error: ' + error });
    }
  }
  if (toDelete) {
    try {
      await (0, _db.deleteCategory)(userDb, toDelete, _id);
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error: ' + error });
    }
  }
  res.status(200).json({ message: 'Success' });
});
// Started called by EditCategories.jsx
//

// Started called by Articles.jsx
//
feeds.post('/bookmark', async function (req, res) {
  var newBookmark = req.body;
  var userDb = 'user1';

  try {
    var result = await (0, _db.createBookmark)(userDb, newBookmark);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error: ' + error });
  }
});

feeds.post('/read', async function (req, res) {
  // let userDb = req.session.passport.user
  var userDb = 'user1';
  var _req$body3 = req.body,
      category = _req$body3.category,
      feed = _req$body3.feed,
      title = _req$body3.title,
      link = _req$body3.link;


  try {
    var result = await (0, _db.markRead)(category, feed, title, link, userDb);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error: ' + error });
  }
});
// End called by Articles.jsx
//

// Start called by NewFeed.jsx
//
feeds.post('/feeds', async function (req, res) {
  // let userDb = req.session.passport.user
  var userDb = 'user1';
  var newFeed = req.body;

  // addFeed('rssapp', newFeed, function (error, result) {
  try {
    await (0, _db.addFeed)(userDb, newFeed);
    res.status(200).send('1 record inserted');
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error: ' + error });
  }
});

exports.default = feeds;
//# sourceMappingURL=feeds.js.map