'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _feeds = require('../models/feeds');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var feeds = _express2.default.Router();

// Start called by Router.jsx
//
feeds.get('/feeds', async function (req, res) {
  var userDb = String(req.session.passport.user);

  try {
    var result = await (0, _feeds.getFeeds)(userDb);
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

  var userDb = String(req.session.passport.user);

  try {
    await (0, _feeds.refreshArticles)(userDb, category, name, url);
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

  var userDb = String(req.session.passport.user);

  if (name) {
    try {
      await (0, _feeds.addCategory)(userDb, name, _id);
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error: ' + error });
    }
  }
  if (toDelete) {
    try {
      await (0, _feeds.deleteCategory)(userDb, toDelete, _id);
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
  var userDb = String(req.session.passport.user);

  try {
    var result = await (0, _feeds.createBookmark)(userDb, newBookmark);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error: ' + error });
  }
});

feeds.post('/read', async function (req, res) {
  // let userDb = req.session.passport.user
  var _req$body3 = req.body,
      category = _req$body3.category,
      feed = _req$body3.feed,
      title = _req$body3.title,
      link = _req$body3.link;

  var userDb = String(req.session.passport.user);

  try {
    var result = await (0, _feeds.markRead)(category, feed, title, link, userDb);
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
  var userDb = String(req.session.passport.user);
  var newFeed = req.body;

  // addFeed('rssapp', newFeed, function (error, result) {
  try {
    var response = await (0, _feeds.addFeed)(userDb, newFeed);
    if (response === 'success') {
      res.status(200).send('1 record inserted');
    } else {
      res.status(400).json({ error: response });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error: ' + error });
  }
});

feeds.delete('/feeds', async function (req, res) {
  var userDb = String(req.session.passport.user);
  var _req$body4 = req.body,
      category = _req$body4.category,
      feed = _req$body4.feed;

  var response = await (0, _feeds.deleteFeed)(userDb, category, feed);
  res.status(200).json({ message: 'success' });
});

exports.default = feeds;
//# sourceMappingURL=feeds.js.map