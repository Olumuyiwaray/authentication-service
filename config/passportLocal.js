const LocalStrategy = require('passport-local');
const User = require('../model/users');
const { comparePassword } = require('./utils');

const passportLocal = new LocalStrategy((username, password, cb) => {
  // Find user in database using username provided during login
  User.findOne({ username })
    .then(async (user) => {
      if (!user) {
        return cb(null, false, { message: 'Invalid username or password' });
      }
      // Check for password validity
      const isValid = await comparePassword(password, user.password, user.salt);
      if (!isValid) {
        return cb(null, false, { message: 'Invalid username or password' });
      }
      return cb(null, user);
    })
    .catch((err) => {
      cb(err);
    });
});

module.exports = passportLocal;