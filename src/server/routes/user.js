import express from 'express'
import passport from 'passport'

import { CreateUser, ChangePassword, validateRegistration } from '../models/user'
import ensureAuthenticated from '../auth/passport'

const user = express.Router()

user.get('/protected', ensureAuthenticated, (req, res) => {
  res.status(200).json({ name: res.req.user.name })
})

user.get('/logout', ensureAuthenticated, (req, res) => {
  req.session.destroy()
  req.logout()
  res.redirect('/login')
})

user.post('/login', passport.authenticate('local'), (req, res) => {
  res.status(200).json({ name: res.req.user.name })
})

user.post('/registeruser', async (req, res) => {
  const newUser = req.body
  newUser.created = new Date().getTime()

  const inputErrors = validateRegistration(newUser)

  if (inputErrors) { res.status(400).json(inputErrors) }

  try {
    const result = await CreateUser(newUser)
    if (result === 11000) {
      res.status(409).json([`${newUser.username} already registered, please try another name.`])
    } else {
      res.status(200).json(`Successfully registered ${result.username}`)
    }
  } catch (error) {
    res.status(500).json(`Internal Server Error: ${error}`)
  }
})

user.post('/changepassword', ensureAuthenticated, async (req, res) => {
  const userDb = req.session.passport.user
  const newPassword = req.body

  // const inputErrors = validateRegistration(newUser)

  // if (inputErrors) { res.status(400).json(inputErrors) }

  try {
    await ChangePassword(userDb, newPassword)
    res.status(200).json('Password changed successfully')
  } catch (error) {
    res.status(500).json(`Internal Server Error: ${error}`)
  }
})

export default user
