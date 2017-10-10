'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.router = undefined;

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _passport = require('../auth/passport.js');

var _db = require('../models/db.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import { ObjectId } from 'mongodb'

var router = _express2.default.Router();

router.get('/protected', _passport.ensureAuthenticated, function (req, res) {
  res.status(200).json({ name: res.req.user.name });
});

// Start called by Router.jsx
//
router.get('/feeds', function (req, res) {
  // let userDb = req.session.passport.user
  var userDb = 'user1';
  (0, _db.getFeeds)(userDb, function (error, result) {
    if (error) {
      res.status(500).json({ message: 'Internal Server Error: ' + error });
      throw error;
    }
    res.json(result);
  });
});

router.post('/articles', function (req, res) {
  var _req$body = req.body,
      name = _req$body.name,
      url = _req$body.url,
      category = _req$body.category;
  // let userDb = req.session.passport.user

  var userDb = 'user1';

  var promise = new Promise(function (resolve, reject) {
    (0, _db.refreshArticles)(userDb, category, name, url, function (error, result) {
      if (error) reject(error);
      resolve(result);
    });
  });
  promise.then(function (data) {
    (0, _db.getFeeds)(userDb, function (error, result) {
      if (error) {
        res.status(500).json({ message: 'Internal Server Error: ' + error });
        throw error;
      }
      res.status(200).json(result);
    });
  });
  res.status(200).json({ status: 'refreshed articles' });
});
// End called by Router.jsx
//

// Started called by EditCategories.jsx
//
router.post('/editcategories', function (req, res) {
  var _req$body2 = req.body,
      _id = _req$body2._id,
      name = _req$body2.name,
      toDelete = _req$body2.toDelete;

  var userDb = 'user1';

  function cb(result) {
    res.status(200).send('1 record inserted');
  }
  if (name) {
    (0, _db.addCategory)(userDb, name, _id, function (error, result) {
      if (error) {
        res.status(500).json({ message: 'Internal Server Error: ' + error });
      }
      cb(result);
    });
  }
  if (toDelete) {
    (0, _db.deleteCategory)('rssapp', toDelete, _id, function (error, result) {
      if (error) {
        res.status(500).json({ message: 'Internal Server Error: ' + error });
      }
      cb(result);
    });
  }
});
// Started called by EditCategories.jsx
//

// Started called by Articles.jsx
//
router.post('/bookmark', function (req, res) {
  var newBookmark = req.body;
  var userDb = 'user1';

  (0, _db.bookmark)(userDb, newBookmark, function (error, result) {
    if (error) {
      res.status(500).json({ message: 'Internal Server Error: ' + error });
    }
    console.log(result);
    res.status(200).json(result);
  });
});
// End called by Articles.jsx
//

// Start called by NewFeed.jsx
//
router.post('/feeds', function (req, res) {
  // let userDb = req.session.passport.user
  var userDb = 'user1';
  var newFeed = req.body;

  res.status(200).send('1 record inserted');
  /*
  const errors = validateFeed(newFeed)
  if (errors) {
  res.status(400).json(errors)
  return
  }
  */

  // addFeed('rssapp', newFeed, function (error, result) {
  (0, _db.addFeed)(userDb, newFeed, function (error, result) {
    if (error) {
      res.status(500).json({ message: 'Internal Server Error: ' + error });
    }
    res.status(200).send('1 record inserted');
  });
});
// End called by NewFeed.jsx
//

/*
router.delete('/bookmarks/:id', ensureAuthenticated, (req, res) => {
let userDb = req.session.passport.user
let bookmarkId
try {
  bookmarkId = new ObjectId(req.params.id)
} catch (error) {
  res.status(422).json({ message: `Invalid issue ID format: ${error}` })
  return
}
 deleteSite('bookmarks.' + userDb, bookmarkId, function (error, result) {
  if (error) {
    if (error === '404') {
      res.status(404).json({ message: 'Delete object not found' })
      return
    }
    res.status(500).json({ message: `Internal Server Error: ${error}` })
    return
  } res.status(200).json({ message: 'Successfully deleted object' })
})
})
router.patch('/bookmarks', ensureAuthenticated, (req, res) => {
let userDb = req.session.passport.user
const site = req.body
site.updated = new Date().getTime()
 const errors = validateEdit(site)
if (errors) {
  res.status(422).json(errors)
  return
}
 editSite('bookmarks.' + userDb, site, function (error, result) {
  if (error) throw error
  res.status(200).json('Edit site success')
})
})
*/

exports.router = router;
//# sourceMappingURL=feeds.js.map