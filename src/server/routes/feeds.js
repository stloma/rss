import express from 'express'
// import { ObjectId } from 'mongodb'

import { ensureAuthenticated } from '../auth/passport.js'
import { getFeeds, addFeed, addCategory, deleteCategory, refreshArticles } from '../models/db.js'

const router = express.Router()

router.get('/protected', ensureAuthenticated, (req, res) => {
  res.status(200).json({ name: res.req.user.name })
})

router.get('/feeds', (req, res) => {
  // let userDb = req.session.passport.user
  getFeeds(function (error, result) {
    if (error) {
      res.status(500).json({ message: `Internal Server Error: ${error}` })
      throw error
    }
    res.json(result)
  })
})

router.post('/editcategories', (req, res) => {
  const { _id, name, toDelete } = req.body

  function cb (result) {
    res.status(200).send('1 record inserted')
  }
  if (name) {
    addCategory('rssapp', name, _id, function (error, result) {
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

router.post('/articles', (req, res) => {
  const { name, url, dir, _id } = req.body

  let promise = new Promise(function (resolve, reject) {
    refreshArticles(dir, name, url, _id, function (error, result) {
      if (error) reject(error)
      resolve(result)
    })
  })
  promise.then(function (data) {
    getFeeds(function (error, result) {
      if (error) {
        res.status(500).json({ message: `Internal Server Error: ${error}` })
        throw error
      }
      res.status(200).json(result)
    })
  })
  res.status(200).json({ status: 'refreshed articles' })
})

router.post('/feeds', (req, res) => {
  // let userDb = req.session.passport.user
  const newFeed = req.body
    /*
  const errors = validateFeed(newFeed)
  if (errors) {
    res.status(400).json(errors)
    return
  }
  */

  addFeed('rssapp', newFeed, function (error, result) {
    if (error) {
      res.status(500).json({ message: `Internal Server Error: ${error}` })
    }
    res.status(200).send('1 record inserted')
  })
})

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

export { router }
