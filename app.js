const express = require('express');
const app = express();
const bodyParser = require('body-parser');
require('dotenv').config();
const session = require('express-session');
const MongoStore = require('connect-mongo');
const helmet = require('helmet');
const rateLimiter = require('express-rate-limit');
const passport = require('passport');
const dbConfig = require('./config/mongoconnect');
const routes = require('./routes/routes');
const port = process.env.PORT || 4000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
// Register view engine

app.set('view engine', 'ejs');

// Configure request limiter
const limiter = rateLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: 'draft-7',
  legacyHeaders: false
});

app.use(limiter);
app.use(helmet());

// Configure express-sessions
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      ttl: 1 * 24 * 60 * 60,
      autoRemove: 'native'
    }),
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24
    }
  })
);

// call database connection
dbConfig()
  .then(() => {
    app.listen(port, () => {
      console.log(`listening to requests on port ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

require('./config/passport');

app.use(passport.initialize());
app.use(passport.session());

app.use(routes);
