'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).send('Please login to perform this operation');
  return null;
}

exports.default = ensureAuthenticated;
//# sourceMappingURL=passport.js.map