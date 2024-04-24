const FacebookStrategy = require('passport-facebook');
const User = require('../model/users');

const passportFacebook = new FacebookStrategy(
  {
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK
  },

  (accessToken, refreshToken, profile, cb) => {
    User.findOrCreate({ facebookId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
);

module.exports = passportFacebook;
