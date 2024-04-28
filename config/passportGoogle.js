const GoogleStrategy = require('passport-google-oauth20');
const User = require('../model/users');
const { generateUsername } = require('./utils');

const passportGoogle = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK
  },
  async (accessToken, refreshToken, profile, cb) => {
    const email = profile.emails[0].value;
    const user = await User.findOne({ email });

    if (!user) {
      const username = await generateUsername(profile.displayName);
      const newUser = await User.create({
        email,
        username,
        auth_method: 'google',
        verified: true
      });
      return cb(null, newUser);
    } else {
      return cb(null, user);
    }
  }
);

module.exports = passportGoogle;
