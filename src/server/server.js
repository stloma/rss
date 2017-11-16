import express from 'express'
import bodyParser from 'body-parser'
import SourceMapSupport from 'source-map-support'
import path from 'path'
import session from 'express-session'
import cookieParser from 'cookie-parser'

import feeds from './routes/feeds'

SourceMapSupport.install()

const app = express()

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
  saveUninitialized: true,
  resave: true
}))

app.use('/api', feeds)

app.listen(3000, '127.0.0.1', () => {
  console.log('App started on port 3000')
})

app.get('*', (req, res) => {
  res.sendFile(path.resolve('dist/index.html'))
})
