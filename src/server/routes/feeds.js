import express from 'express'

import {
  getFeeds, addFeed, addCategory,
  deleteCategory, refreshArticles, createBookmark,
  markRead, deleteFeed
} from '../models/feeds'

const feeds = express.Router()

// Start called by Router.jsx
//
feeds.get('/feeds', async (req, res) => {
  const userDb = String(req.session.passport.user)

  try {
    const result = await getFeeds(userDb)
    res.json(result)
  } catch (error) { res.status(500).json({ message: `Internal Server Error: ${error}` }) }
})

feeds.post('/articles', async (req, res) => {
  const { name, url, category } = req.body
  const userDb = String(req.session.passport.user)

  try {
    await refreshArticles(userDb, category, name, url)
    res.status(200).json({ status: 'refresh success' })
  } catch (error) { res.status(500).json({ status: `${url} refresh failure: ${error}` }) }
})
// End called by Router.jsx
//
//

// Started called by EditCategories.jsx
//
feeds.post('/editcategories', async (req, res) => {
  const { _id, name, toDelete } = req.body
  const userDb = String(req.session.passport.user)

  if (name) {
    try {
      await addCategory(userDb, name, _id)
    } catch (error) {
      res.status(500).json({ message: `Internal Server Error: ${error}` })
    }
  }
  if (toDelete) {
    try {
      await deleteCategory(userDb, toDelete, _id)
    } catch (error) {
      res.status(500).json({ message: `Internal Server Error: ${error}` })
    }
  }
  res.status(200).json({ message: 'Success' })
})
// Started called by EditCategories.jsx
//

// Started called by Articles.jsx
//
feeds.post('/bookmark', async (req, res) => {
  const newBookmark = req.body
  const userDb = String(req.session.passport.user)

  try {
    const result = await createBookmark(userDb, newBookmark)
    res.status(200).json(result)
  } catch (error) { res.status(500).json({ message: `Internal Server Error: ${error}` }) }
})

feeds.post('/read', async (req, res) => {
  // let userDb = req.session.passport.user
  const { category, feed, title, link } = req.body
  const userDb = String(req.session.passport.user)

  try {
    const result = await markRead(category, feed, title, link, userDb)
    res.json(result)
  } catch (error) { res.status(500).json({ message: `Internal Server Error: ${error}` }) }
})
// End called by Articles.jsx
//

// Start called by NewFeed.jsx
//
feeds.post('/feeds', async (req, res) => {
  // let userDb = req.session.passport.user
  const userDb = String(req.session.passport.user)
  const newFeed = req.body

  // addFeed('rssapp', newFeed, function (error, result) {
  try {
    const response = await addFeed(userDb, newFeed)
    if (response === 'success') {
      res.status(200).send('1 record inserted')
    } else {
      res.status(400).json({ error: response })
    }
  } catch (error) { res.status(500).json({ message: `Internal Server Error: ${error}` }) }
})

feeds.delete('/feeds', async (req, res) => {
  const userDb = String(req.session.passport.user)
  const { category, feed } = req.body
  const response = await deleteFeed(userDb, category, feed)
  res.status(200).json({ message: 'success' })
})

export default feeds
