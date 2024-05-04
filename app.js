require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const { dbConfig } = require('./config/mongoconnect');
const routes = require('./routes/routes');
const limiter = require('./config/limiter');
const helmetOptions = require('./config/helmet');
const sessionOptions = require('./config/session');
const initializePassport = require('./config/passport');

const app = express();
const port = process.env.PORT || 4000;

/**
 * ------ register view engine ----------
 */
app.set('view engine', 'ejs');

/**
 * ------ configure middlewares ----------
 */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(limiter);
app.use(cors());
app.use(helmet(helmetOptions));
app.use(session(sessionOptions));
app.use(compression());

initializePassport(app);

/**
 * ------ define routes ----------
 */
app.use(routes);

/**
 * ------- Connect to database before proceeding to listen to requests -------
 */
dbConfig()
  .then(() => {
    app.listen(port, () => {
      console.log(`listening to requests on port ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
