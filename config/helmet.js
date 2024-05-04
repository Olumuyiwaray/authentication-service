const url =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:4000'
    : process.env.URL;

const helmetOptions = {
  contentSecurityPolicy: {
    useDefaults: false,
    directives: {
      defaultSrc: ["'self'"],
      fontSrc: ["'self'", 'https://ka-f.fontawesome.com/'],
      scriptSrc: [
        "'self'",
        `${url}`,
        'https://kit.fontawesome.com/c9e868ff59.js'
      ],
      connectSrc: ["'self'", 'https://ka-f.fontawesome.com/'],
      styleSrc: ["'self'", "'unsafe-inline'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests:
        process.env.NODE_ENV === 'development' ? null : true
    }
  }
};

module.exports = helmetOptions;
