'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateRegistration = exports.CreateUser = exports.ComparePassword = undefined;

var _bcrypt = require('bcrypt');

var _bcrypt2 = _interopRequireDefault(_bcrypt);

var _db = require('./db.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ComparePassword = exports.ComparePassword = function ComparePassword(candidatePassword, hash, callback) {
  _bcrypt2.default.compare(candidatePassword, hash, function (err, isMatch) {
    if (err) throw err;
    callback(isMatch);
  });
};

var CreateUser = exports.CreateUser = function CreateUser(newUser, cb) {
  _bcrypt2.default.genSalt(10, function (err, salt) {
    if (err) throw err;
    _bcrypt2.default.hash(newUser.password, salt, function (err, hash) {
      if (err) throw err;
      newUser.password = hash;
      insertUser(newUser);
    });
  });

  function insertUser(newUser) {
    _db.bookmarkDb.collection('users').insertOne(newUser).then(function (result) {
      return _db.bookmarkDb.collection('users').find({ _id: result.insertedId }).limit(1).next();
    }).then(function (newUser) {
      cb(null, newUser);
    }).catch(function (error) {
      cb(error);
    });
  }
};

var registerFieldType = {
  name: 'required',
  username: 'required',
  email: 'required',
  password: 'required',
  created: 'required'
};

function validateRegistration(site, cb) {
  var errors = [];
  var emailPattern = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/;
  for (var field in registerFieldType) {
    var type = registerFieldType[field];
    if (type === 'required' && !site[field]) {
      errors.push(field + ' is required');
    }
  }
  var email = site['email'];
  if (email && !email.match(emailPattern)) {
    errors.push('Please enter a valid email address');
  }
  if (errors.length > 0) {
    cb(errors);
  } else {
    cb(null);
  }
}

exports.validateRegistration = validateRegistration;
//# sourceMappingURL=user.js.map