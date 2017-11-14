import express from 'express'

import {
  getFeeds, addFeed, addCategory,
  deleteCategory, refreshArticles, createBookmark,
  markRead
} from '../models/db'

const router = express.Router()

// Start called by Router.jsx
//
router.get('/feeds', (req, res) => {
  // let userDb = req.session.passport.user
  const userDb = 'user1'
  getFeeds(userDb, (error, result) => {
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
  const userDb = 'user1'

  refreshArticles(userDb, category, name, url, (error) => {
    if (error) {
      res.status(500).json({ status: `${url} refresh failure: ${error}` })
    } else {
      res.status(200).json({ status: 'refresh success' })
    }
  })
})
// End called by Router.jsx
//
//

// Started called by EditCategories.jsx
//
router.post('/editcategories', (req, res) => {
  const { _id, name, toDelete } = req.body
  const userDb = 'user1'

  function cb() {
    res.status(200).send('1 record inserted')
  }
  if (name) {
    addCategory(userDb, name, _id, (error, result) => {
      if (error) {
        res.status(500).json({ message: `Internal Server Error: ${error}` })
      }
      cb(result)
    })
  }
  if (toDelete) {
    deleteCategory('rssapp', toDelete, _id, (error, result) => {
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
  const userDb = 'user1'

  createBookmark(userDb, newBookmark, (error, result) => {
    if (error) {
      res.status(500).json({ message: `Internal Server Error: ${error}` })
    }
    res.status(200).json(result)
  })
})

router.post('/read', (req, res) => {
  // let userDb = req.session.passport.user
  const userDb = 'user1'
  const { category, feed, title, link } = req.body

  markRead(category, feed, title, link, userDb, (error, result) => {
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
  addFeed(userDb, newFeed, (error) => {
    if (error) {
      res.status(500).json({ message: `Internal Server Error: ${error}` })
    }
    res.status(200).send('1 record inserted')
  })
})

export default { router }
