const GoogleStrategy = require('passport-google-oauth20');

const User = require('../model/users');

const passportGoogle = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK
  },
  (accessToken, refreshToken, profile, cb) => {
    console.log(accessToken, refreshToken, profile);
  }
);

module.exports = passportGoogle;
