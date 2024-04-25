const FacebookStrategy = require('passport-facebook');
const User = require('../model/users');

const passportFacebook = new FacebookStrategy(
  {
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK
  },

  async (accessToken, refreshToken, profile, cb) => {
    const email = profile.emails[0].value;
    const user = await User.findOne({ email });

    if (!user) {
      const newUser = await User.create({
        email: email,
        username: 'google username',
        auth_method: 'google',
        verified: true
      });
      return cb(null, newUser);
    } else {
      return cb(null, user);
    }
  }
);

module.exports = passportFacebook;
