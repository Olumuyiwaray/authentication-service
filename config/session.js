const MongoStore = require('connect-mongo');
const mongoUri = require('./config');

const sessionOptions = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: mongoUri,
    ttl: 1 * 24 * 60 * 60,
    autoRemove: 'native'
  }),
  cookie: {
    secure: true,
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24
  }
};

module.exports = sessionOptions;
