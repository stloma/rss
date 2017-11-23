import express from 'express'
import bodyParser from 'body-parser'
import SourceMapSupport from 'source-map-support'
import path from 'path'
import session from 'express-session'
import passport from 'passport'
import cookieParser from 'cookie-parser'

import feeds from './routes/feeds'
import user from './routes/user'
import { ComparePassword } from './models/user'
import { db, store } from './models/db'

SourceMapSupport.install()

const app = express()
const LocalStrategy = require('passport-local').Strategy

app.use(express.static('dist'))
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const config = require('./.session-secret')

app.use(session({
  secret: config.secret,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
  },
  store,
  saveUninitialized: true,
  resave: true
}))

app.use(passport.initialize())
app.use(passport.session())

passport.serializeUser((loginUser, done) => {
  done(null, loginUser._id)
})

passport.deserializeUser(async (loginUser, done) => {
  done(null, loginUser)
})

passport.use(new LocalStrategy(
  (async (username, password, done) => {
    try {
      const userExists = await db.rssDb.collection('users').findOne({ username })
      if (!userExists) {
        return done(null, false)
      }
      const isMatch = await ComparePassword(password, userExists.password)
      if (!isMatch) {
        return done(null, false)
      }
      return done(null, userExists)
    } catch (error) {
      return done(error)
    }
  })
))

app.use('/api', feeds)
app.use('/api', user)

app.listen(3002, '127.0.0.1', () => {
  console.log('App started on port 3002')
})

app.get('*', (req, res) => {
  res.sendFile(path.resolve('dist/index.html'))
})
