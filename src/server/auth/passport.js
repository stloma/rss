function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.status(401).send('Please login to perform this operation')
  return null
}

export default ensureAuthenticated
