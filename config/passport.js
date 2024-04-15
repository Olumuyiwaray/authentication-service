const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('../model/users');
const { checkPassword } = require('./utils');

passport.use(
  new LocalStrategy((username, password, cb) => {
    // Find user in database using username provided during login
    User.findOne({ username })
      .then(async (user) => {
        if (!user) {
          return cb(null, false, { message: 'Invalid username or password' });
        }
        // Check for password validity
        const isValid = await checkPassword(password, user.password);
        if (!isValid) {
          return cb(null, false, { message: 'Invalid username or password' });
        }
        return cb(null, user);
      })
      .catch((err) => {
        cb(err);
      });
  })
);

passport.serializeUser(function (user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function (userId, cb) {
  User.findById(userId)
    .then((user) => {
      user.password = undefined;
      cb(null, user);
    })
    .catch((err) => cb(err));
});
