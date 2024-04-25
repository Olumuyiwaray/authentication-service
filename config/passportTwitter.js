const TwitterStrategy = require('passport-twitter');
const User = require('../model/users');

const passportTwitter = new TwitterStrategy(
  {
    consumerKey: process.env.TWITTER_API_KEY,
    consumerSecret: process.env.TWITTER_API_KEY_SECRET,
    callbackURL: process.env.TWITTER_CALLBACK
  },

  async (token, tokenSecret, profile, cb) => {
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

module.exports = passportTwitter;
