const express = require('express');
const router = express.Router();
const passport = require('passport');
const { checkAuthStatus } = require('../config/utils');
const validator = require('../config/validate');
const authController = require('../controllers/authControllers');

/*
 ** ------------- Get Routes -------------
 */

// login page  //
router.get('/', (req, res) => {
  res.status(200).render('login');
});

// social login redirect page //
router.get('/social-login', (req, res) => {
  const { message, provider } = req.query;
  res.status(200).render('sso', { message, provider });
});

// dashboard page //
router.get('/welcome', checkAuthStatus, (req, res) => {
  res.status(200).render('welcome', { username: req.user.username });
});

// register page //
router.get('/register', (req, res) => {
  res.status(200).render('register');
});

// get verify notice page //
router.get('/verify-page', (req, res) => {
  res.status(200).render('verify-page');
});

// Handle email verification //
router.get('/verify/:token', authController.verifyUserEmail);

// google sign-in //
router.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// google SSO callback url //
router.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function (req, res) {
    //Successful authentication, redirect home.
    res.redirect('/welcome');
  }
);

// facebook sign-in //
router.get(
  '/auth/facebook',
  passport.authenticate('facebook', { scope: ['email'] })
);

// google SSO callback url //
router.get(
  '/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect('/welcome');
  }
);

//  get verify password page //
router.get('/forgot', (req, res) => {
  res.status(200).render('forgot');
});

//  handle password reset link //
router.get('/forgot/:token', authController.verifyPasswordResetLink);

//  get password reset page //
router.get('/reset/:id', (req, res, next) => {
  const id = req.params.id;
  res.status(200).render('reset', { id });
});

router.get('/logout', checkAuthStatus, (req, res) => {
  req.logout((err) => {
    if (err) {
      console.log(err);
    }
    res.status(301).redirect('/');
  });
});

/*
 ** ------------- Post Routes -------------
 */

//  Register route  //
router.post(
  '/register',
  validator.validateSignup,
  validator.validate,
  authController.registerUser
);

//  Login route  //

router.post(
  '/login',
  validator.validateLogin,
  validator.validate,
  authController.loginUser
);

//  send password reset link //
router.post(
  '/forgot',
  validator.validateEmail,
  validator.validate,
  authController.sendPasswordResetLink
);

//  reset user password//
router.post(
  '/reset/:id',
  validator.validatePasswordReset,
  validator.validate,
  authController.resetUserPassword
);

module.exports = router;
