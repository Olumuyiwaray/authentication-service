// const TwitterStrategy = require('passport-twitter');
// const User = require('../model/users');

// const passportTwitter = new TwitterStrategy(
//   {
//     consumerKey: process.env.TWITTER_CONSUMER_KEY,
//     consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
//     callbackURL: process.env.TWITTER_CALLBACK
//   },

//   (token, tokenSecret, profile, cb) => {
//     User.findOrCreate({ twitterId: profile.id }, function (err, user) {
//       return cb(err, user);
//     });
//   }
// );

// module.exports = passportTwitter;
