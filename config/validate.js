const { body, validationResult } = require('express-validator');

const validateLogin = [
  // Check user input for both empty and invalid input
  body('username').trim().escape(),
  body('password').escape()
];

const validateSignup = [
  // Validate user input checking for both empty and invalid inputs
  body('email')
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage(' Please enter a valid email address'),
  body('username').trim().escape(),
  body('password').notEmpty().escape()
];

const validate = (req, res, next) => {
  // Check if any errors occur and send them to the client if any
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() });
  }
  next();
};

module.exports = {
  validate,
  validateLogin,
  validateSignup
};
