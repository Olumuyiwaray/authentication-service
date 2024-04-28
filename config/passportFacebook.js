const FacebookStrategy = require('passport-facebook');
const User = require('../model/users');
const { generateUsername } = require('./utils');

const passportFacebook = new FacebookStrategy(
  {
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK,
    profileFields: ['id', 'displayName', 'email']
  },

  async (accessToken, refreshToken, profile, cb) => {
    const email =
      profile.emails && profile.emails.length > 0
        ? profile.emails[0].value
        : null;

    const user = await User.findOne({ email });

    if (!user) {
      const username = await generateUsername(profile.displayName);
      const newUser = await User.create({
        email,
        username,
        auth_method: 'facebook',
        verified: true
      });
      return cb(null, newUser);
    } else {
      return cb(null, user);
    }
  }
);

module.exports = passportFacebook;
