const passport = require('passport');
const User = require('../model/users');
const passportLocal = require('./passortLocal');
const passportGoogle = require('./passportGoogle');
const passportTwitter = require('./passportTwitter');
const passportFacebook = require('./passportFacebook');

passport.use(passportLocal);
passport.use(passportGoogle);
passport.use(passportTwitter);
passport.use(passportFacebook);

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
