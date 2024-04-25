const GoogleStrategy = require('passport-google-oauth20');
const User = require('../model/users');

const passportGoogle = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK
  },
  async (accessToken, refreshToken, profile, cb) => {
    const user = await User.findOne({ email: profile.email });

    if (!user) {
      const newUser = await User.create({
        email: profile.email,
        username: '',
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
