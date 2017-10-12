import express from 'express'

import {
  getFeeds, addFeed, addCategory,
  deleteCategory, refreshArticles, bookmark,
  markRead
} from '../models/db.js'

const router = express.Router()

// Start called by Router.jsx
//
router.get('/feeds', (req, res) => {
  // let userDb = req.session.passport.user
  let userDb = 'user1'
  getFeeds(userDb, function (error, result) {
    if (error) {
      res.status(500).json({ message: `Internal Server Error: ${error}` })
      throw error
    }
    res.json(result)
  })
})

router.post('/articles', async (req, res) => {
  const { name, url, category } = req.body
  // let userDb = req.session.passport.user
  let userDb = 'user1'

  refreshArticles(userDb, category, name, url, function (error, result) {
    if (error) {
      res.status(500).json({ status: `${url} refresh failure: ${error}` })
    } else {
      res.status(200).json({ status: 'refresh success' })
    }
  })

    /*
  let promise = new Promise(function (resolve, reject) {
    refreshArticles(userDb, category, name, url, function (error, result) {
      if (error) reject(error)
      resolve(result)
    })
  })
  promise.then(function (data) {
    console.log(data)
    getFeeds(userDb, function (error, result) {
      if (error) {
        res.status(500).json({ message: `Internal Server Error: ${error}` })
        throw error
      }
      res.status(200).json(data)
    })
  })
  res.status(200).json({ status: 'refreshed articles' })
  */
})
// End called by Router.jsx
//
//

// Started called by EditCategories.jsx
//
router.post('/editcategories', (req, res) => {
  const { _id, name, toDelete } = req.body
  const userDb = 'user1'

  function cb (result) {
    res.status(200).send('1 record inserted')
  }
  if (name) {
    addCategory(userDb, name, _id, function (error, result) {
      if (error) {
        res.status(500).json({ message: `Internal Server Error: ${error}` })
      }
      cb(result)
    })
  }
  if (toDelete) {
    deleteCategory('rssapp', toDelete, _id, function (error, result) {
      if (error) {
        res.status(500).json({ message: `Internal Server Error: ${error}` })
      }
      cb(result)
    })
  }
})
// Started called by EditCategories.jsx
//

// Started called by Articles.jsx
//
router.post('/bookmark', (req, res) => {
  const newBookmark = req.body
  let userDb = 'user1'

  bookmark(userDb, newBookmark, function (error, result) {
    if (error) {
      res.status(500).json({ message: `Internal Server Error: ${error}` })
    }
    console.log(result)
    res.status(200).json(result)
  })
})

router.post('/read', (req, res) => {
  // let userDb = req.session.passport.user
  let userDb = 'user1'
  const { category, feed, title, link } = req.body

  markRead(category, feed, title, link, userDb, function (error, result) {
    if (error) {
      res.status(500).json({ message: `Internal Server Error: ${error}` })
      throw error
    }
    res.json(result)
  })
})
// End called by Articles.jsx
//

// Start called by NewFeed.jsx
//
router.post('/feeds', (req, res) => {
  // let userDb = req.session.passport.user
  const userDb = 'user1'
  const newFeed = req.body

  res.status(200).send('1 record inserted')
    /*
  const errors = validateFeed(newFeed)
  if (errors) {
    res.status(400).json(errors)
    return
  }
  */

  // addFeed('rssapp', newFeed, function (error, result) {
  addFeed(userDb, newFeed, function (error, result) {
    if (error) {
      res.status(500).json({ message: `Internal Server Error: ${error}` })
    }
    res.status(200).send('1 record inserted')
  })
})

export { router }
