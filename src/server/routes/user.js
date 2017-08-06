import express from 'express'
import passport from 'passport'

import { CreateUser, validateRegistration } from '../models/user.js'
import { ensureAuthenticated } from '../auth/passport.js'

const router = express.Router()

router.get('/logout', ensureAuthenticated, function (req, res) {
  req.session.destroy()
  req.logout()
})

router.post('/login', passport.authenticate('local'), function (req, res) {
  res.status(200).json({ name: res.req.user.name })
})

router.post('/registeruser', (req, res) => {
  let newUser = req.body
  newUser.created = new Date().getTime()

  validateRegistration(newUser, validateCb)

  function validateCb (error, result) {
    if (error) {
      res.status(400).json(error)
    } else {
      CreateUser(newUser, registerCb)
    }
  }

  function registerCb (error, result) {
    if (error) {
      if (error.code === 11000) {
        let inputType = error.message.split('$')[1].split(' ')[0]
        res.status(409).json([inputType + ' already registered'])
        return
      }
      res.status(500).json({ message: `Internal Server Error: ${error}` })
      return
    }
    res.status(200).json(`Successfully registered ${newUser.username}`)
  }
})

export { router }
