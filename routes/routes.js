const express = require('express');

const router = express.Router();

const passport = require('passport');

const User = require('../model/users');

const Token = require('../model/emailtoken');

const {
  hashPassword,
  createToken,
  sendVerifyLink,
  checkAuthenticated
} = require('../config/utils');

const {
  validate,
  validateLogin,
  validateSignup
} = require('../config/validate');

/*
 ** ---------------- Get routes ---------------
 */

router.get('/', (req, res) => {
  res.status(200).render('login');
});

router.get('/logout', checkAuthenticated, (req, res) => {
  req.logout((err) => {
    if (err) {
      console.log(err);
    }
    res.status(301).redirect('/');
  });
});

router.get('/welcome', checkAuthenticated, (req, res) => {
  res.status(200).render('welcome', { username: req.user.username });
});

router.get('/register', (req, res) => {
  res.status(200).render('register');
});

router.get('/verify-page', (req, res) => {
  res.status(200).render('verify-page');
});

router.get('/verify/:token', async (req, res) => {
  const token = req.params.token;

  const findToken = await Token.findOne({ token });
  const id = findToken.userId;

  const dataUpdate = {
    verified: true
  };

  const newUser = await User.findByIdAndUpdate(id, dataUpdate, { new: true });

  if (!newUser) {
    res.send('sorry an error occured');
  } else {
    res.status(200).render('success-reg');
  }
});

// google sign-in

router.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function (req, res) {
    //Successful authentication, redirect home.
    res.redirect('/welcome');
  }
);

// facebook sign-in

router.get('/auth/facebook', passport.authenticate('facebook'));

router.get(
  '/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect('/welcome');
  }
);

// twitter sign-in

router.get('/auth/twitter', passport.authenticate('twitter'));

router.get(
  '/auth/twiter/callback',
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect('/welcome');
  }
);

/*
 ** ------------- Post Routes -------------
 */

// Register route

router.post('/register', validateSignup, validate, async (req, res) => {
  // If no errors retrieve values of form fields from request body

  const { email, username, password } = req.body;

  // Check if user already exists in database
  const checkUser = await User.findOne({ email });

  if (checkUser) {
    res.json({ message: 'Email already registered' });
  }

  // Create password hash with hash function
  const hash = await hashPassword(password);

  // Create user instance from form input
  const newUser = new User({
    email,
    username,
    password: hash
  });

  newUser
    .save()
    .then(async (user) => {
      const token = await createToken(process.env.LENGTH);
      const saveToken = new Token({
        token,
        userId: user._id
      });
      const verificationLink = `${req.protocol}://${req.hostname}/verify/${token}`;
      await sendVerifyLink(user, verificationLink);
      await saveToken.save();
      res.status(301).redirect('/verify-page');
    })
    .catch((err) => console.log(err));
});

// Login route

router.post('/login', validateLogin, validate, (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return console.log(err);
    }

    if (!user) {
      // Authentication failed
      return res.status(400).json({ message: info.message });
    }

    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.redirect('/welcome');
    });
  })(req, res, next);
});

module.exports = router;
