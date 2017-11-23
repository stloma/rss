import bcrypt from 'bcrypt'
import { ObjectId } from 'mongodb'
import { db } from './db'

export const ComparePassword = async (candidatePassword, hash) => {
  try {
    const isMatch = await bcrypt.compare(candidatePassword, hash)
    return isMatch
  } catch (error) { throw Error(error) }
}

export const CreateUser = async (user) => {
  const newUser = user
  try {
    const passHash = await bcrypt.hash(newUser.password, 10)
    newUser.password = passHash
    const userExists = await db.rssDb.collection('users').findOne({ username: newUser.username })
    if (userExists) return 11000
    return await db.rssDb.collection('users').insertOne(newUser)
  } catch (error) { throw Error(error) }
}

export const ChangePassword = async (userDb, password) => {
  try {
    const passHash = await bcrypt.hash(password.password, 10)

    await db.rssDb.collection('users').updateOne(
      { _id: new ObjectId(userDb) },
      { $set: { password: passHash } }
    )
  } catch (error) { throw Error(error) }
}

const registerFieldType = {
  username: 'required',
  password: 'required',
  created: 'required'
}

function validateRegistration(site) {
  const errors = []
  const emailPattern = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/
  Object.keys(registerFieldType).forEach((field) => {
    const type = registerFieldType[field]
    if (type === 'required' && !site[field]) {
      errors.push(`${field} is required`)
    }
  })
  const email = site.email
  if (email && !email.match(emailPattern)) {
    errors.push('Please enter a valid email address')
  }
  if (errors.length > 0) {
    return errors
  }
  return null
}

export { validateRegistration }
