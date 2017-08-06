import bcrypt from 'bcrypt'
import { bookmarkDb } from './db.js'

export const ComparePassword = (candidatePassword, hash, callback) => {
  bcrypt.compare(candidatePassword, hash, function (err, isMatch) {
    if (err) throw err
    callback(isMatch)
  })
}

export const CreateUser = (newUser, cb) => {
  bcrypt.genSalt(10, function (err, salt) {
    if (err) throw err
    bcrypt.hash(newUser.password, salt, function (err, hash) {
      if (err) throw err
      newUser.password = hash
      insertUser(newUser)
    })
  })

  function insertUser (newUser) {
    bookmarkDb.collection('users').insertOne(newUser)
    .then(result =>
      bookmarkDb.collection('users').find({ _id: result.insertedId }).limit(1).next()
      ).then(newUser => {
        cb(null, newUser)
      }).catch(error => {
        cb(error)
      })
  }
}

const registerFieldType = {
  name: 'required',
  username: 'required',
  email: 'required',
  password: 'required',
  created: 'required'
}

function validateRegistration (site, cb) {
  let errors = []
  let emailPattern = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/
  for (const field in registerFieldType) {
    const type = registerFieldType[field]
    if (type === 'required' && !site[field]) {
      errors.push(`${field} is required`)
    }
  }
  let email = site['email']
  if (email && !email.match(emailPattern)) {
    errors.push('Please enter a valid email address')
  }
  if (errors.length > 0) {
    cb(errors)
  } else {
    cb(null)
  }
}

export { validateRegistration }
