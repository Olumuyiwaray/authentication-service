const mongoose = require('mongoose');
const mongoUri = require('./config');
require('dotenv').config();

const dbConfig = async () => {
  mongoose
    .connect(mongoUri)
    .then(console.log('database connected'))
    .catch((err) => console.log(err));
};

module.exports = { dbConfig, mongoUri };
