const passport = require('passport');
const User = require('../model/users');
const passportLocal = require('./passportLocal');
const passportGoogle = require('./passportGoogle');
const passportFacebook = require('./passportFacebook');

passport.use(passportLocal);
passport.use(passportGoogle);
passport.use(passportFacebook);

passport.serializeUser(function (user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function (userId, cb) {
  User.findById(userId)
    .then((user) => {
      if ('password' in user && 'salt' in user) {
        user.password = undefined;
        user.salt = undefined;
      }
      cb(null, user);
    })
    .catch((err) => cb(err));
});
