import session from 'express-session'
import { MongoClient } from 'mongodb'
import connectMongo from 'connect-mongodb-session'

const MongoDBStore = connectMongo(session)

const store = new MongoDBStore(
  {
    uri: 'mongodb://localhost/rssapp',
    collection: 'sessions'
  })

store.on('error', (error) => {
  if (error) throw error
})

const db = {}

MongoClient.connect('mongodb://localhost/rssapp')
  .then((connection) => {
    db.rssDb = connection
  })
  .catch((error) => {
    console.log(`Error connecting to db: ${error}`)
  })

export {
  db, store
}
