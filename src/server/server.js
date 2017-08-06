import express from 'express'
import bodyParser from 'body-parser'
import SourceMapSupport from 'source-map-support'
import path from 'path'
import session from 'express-session'
import passport from 'passport'
import cookieParser from 'cookie-parser'

import { ComparePassword } from './models/user.js'
import { router as user } from './routes/user.js'
import { router as feeds } from './routes/feeds.js'
import { bookmarkDb, store } from './models/db.js'

SourceMapSupport.install()

const app = express()
const LocalStrategy = require('passport-local').Strategy

app.use(express.static('dist'))
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(session({
  secret: 'secret',
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
  },
  store: store,
  saveUninitialized: true,
  resave: true
}))

app.use(passport.initialize())
app.use(passport.session())

passport.serializeUser(function (user, done) {
  done(null, user._id)
})

passport.deserializeUser(function (user, done) {
  done(null, user)
})

passport.use(new LocalStrategy(
  function (username, password, done) {
    bookmarkDb.collection('users').findOne({ username: username })
      .then(user => {
        if (!user) {
          return done(null, false, { message: 'Incorrect username.' })
        }
        ComparePassword(password, user.password, function (isMatch) {
          if (isMatch) {
            return done(null, user)
          } else {
            return done(null, false, { message: 'Invalid password.' })
          }
        })
      })
  }
))

app.use('/api', user)
app.use('/api', feeds)

app.listen(3000, '127.0.0.1', () => {
  console.log('App started on port 3000')
})

app.get('*', (req, res) => {
  res.sendFile(path.resolve('dist/index.html'))
})
