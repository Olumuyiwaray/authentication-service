let mongoUri;

if (process.env.NODE_ENV === 'development') {
  mongoUri = process.env.TEST_DB_URI;
} else {
  mongoUri = process.env.MONGODB_URI;
}

module.exports = mongoUri;
