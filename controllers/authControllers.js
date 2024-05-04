const passport = require('passport');
const {
  genSalt,
  hashPassword,
  createToken,
  sendVerifyLink,
  comparePassword
} = require('../config/utils');
const Token = require('../model/emailtoken');
const User = require('../model/users');
const jwt = require('jsonwebtoken');
const ResetToken = require('../model/resetToken');

exports.registerUser = async (req, res, next) => {
  const { email, username, password } = req.body;

  //  Check if user already exists in database  //
  const checkUser = await User.findOne({ email });

  // if user exists and auth method is Oauth redirect to sociaal login page  //
  if (checkUser && checkUser.auth_method === 'oauth') {
    const message = `This account uses ${checkUser.provider} login`;
    return res
      .status(301)
      .redirect(
        `/social-login?message=${message}&provider=${checkUser.provider}`
      );
  }

  //  return message if email already exists in database //
  if (checkUser && checkUser.auth_method === 'traditional') {
    return res.json({ message: 'Email already registered' });
  }

  // if user does not exist continue with account creation flow //
  const salt = await genSalt();
  const hash = await hashPassword(password, salt);

  const newUser = await User.create({
    email,
    username,
    password: hash,
    salt,
    auth_method: 'traditional'
  });
  //  create a token and send verification link to user email  //
  const token = await createToken(process.env.LENGTH);
  const verificationLink = `${req.protocol}://${req.hostname}:4000/verify/${token}`;
  const subject = 'Verify email address';
  const message = `<h3>Please click on the button below to verify your email</h3>
       <a style="background-color: blue;
        text-align: center; color: white;
         text-decoration: none; padding:
          5px; border: none; border-radius: 3px;"
           href=${verificationLink}>
            Reset Password
            </a>`;
  await sendVerifyLink(newUser, subject, message);
  await Token.create({
    token,
    userId: newUser._id
  });
  res.status(301).redirect('/verify-page');
};

exports.loginUser = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return console.log(err);
    }

    if (!user && info.message === 'This account uses oauth login') {
      const provider = info.provider;
      return res.redirect(
        `/social-login?message=${info.message}&provider=${provider}`
      );
    }

    if (!user) {
      // Authentication failed
      return res.status(400).json({ message: info.message });
    }

    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.status(301).redirect('/welcome');
    });
  })(req, res, next);
};

//  verify user email address  //
exports.verifyUserEmail = async (req, res, next) => {
  const token = req.params.token;

  const findToken = await Token.findOne({ token });
  const id = findToken.userId;

  const dataUpdate = {
    verified: true
  };

  const verifiedUser = await User.findByIdAndUpdate(id, dataUpdate, {
    new: true
  });

  if (!verifiedUser) {
    res.json({ message: 'sorry an error occured' });
  } else {
    res.status(200).render('success-reg');
  }
};

exports.sendPasswordResetLink = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'Email does not exist' });
    }

    const jwtResetSecret = process.env.JWT_RESET_SECRET;
    const token = jwt.sign({ id: user._id }, jwtResetSecret, {
      expiresIn: '15m'
    });

    const verificationLink = `${req.protocol}://${req.hostname}:4000/forgot/${token}`;
    const subject = 'Reset password';
    const message = `<h3>Please click on the button below to reset your passwork</h3>
    <a tyle="background-color: blue;
    text-align: center; color: white;
     text-decoration: none; padding:
      5px; border: none; border-radius: 3px;"
       href=${verificationLink}> Reset Password</a>
    <p> Link expires in 15 minutes</p>
    `;

    await sendVerifyLink(user, subject, message);
    await ResetToken.create({ token, userId: user._id });

    res.status(200).json({
      message: 'A link has been sent to your email to reset your password'
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'internal server error' });
  }
};

//
exports.verifyPasswordResetLink = async (req, res, next) => {
  const token = req.params.token;

  if (!token) {
    return res.json({ message: 'An error occurred' });
  }

  const getToken = await ResetToken.findOne({ token });

  if (!getToken) {
    return res.json({ message: 'An error occurred try again later' });
  }

  if (getToken.used === true) {
    return res.json({ message: 'Access denied' });
  }

  const jwtResetSecret = process.env.JWT_RESET_SECRET;
  const decoded = jwt.verify(token, jwtResetSecret);
  if (!decoded) {
    return res.json({ message: 'token expired!' });
  }

  const id = decoded.id;
  console.log(id);
  const user = await User.findById(id);

  if (!user) {
    return res.json({ message: 'user does not exist' });
  }

  res.status(301).redirect(`/reset/${id}`);
};

// Reset user password //
exports.resetUserPassword = async (req, res, next) => {
  const id = req.params.id;

  const { password, confirm_password } = req.body;

  if (password !== confirm_password) {
    return res.status(409).json({ message: 'Passwords do not match' });
  }

  try {
    const token = await ResetToken.findOne({ userId: id });
    if (token.used === true) {
      return res.status(403).json({ message: 'Access denied' });
    }
    const user = await User.findById(id);

    const checkPassword = await comparePassword(
      password,
      user.password,
      user.salt
    );

    if (checkPassword) {
      return res.json({ message: 'Cannot use the same password as before' });
    }

    const salt = await genSalt();

    const hash = await hashPassword(password, salt);

    user.password = hash;
    user.salt = salt;

    await user.save();

    token.used = true;
    await token.save();
    return res.status(200).json({ message: 'Password successfull' });
  } catch (err) {
    console.log(err);
    res.json({ message: 'Sorry an error occurred please try again later' });
  }
};
