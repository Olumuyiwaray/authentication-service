const bcrypt = require('bcrypt');
const crypto = require('crypto');
const transporter = require('./nodemailer');
require('dotenv').config();

// Function for hashing password

const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

// Function for checking password

const checkPassword = async (password, hashPassword) => {
  return await bcrypt.compare(password, hashPassword);
};

// Function to create verification token

const createToken = async (length) => {
  const randomBytes = await crypto.randomBytes(Math.ceil(length / 2));
  const randomString = await randomBytes.toString('hex').slice(0, length);
  return randomString;
};

// Function to send verification link
const sendVerifyLink = async (user, verificationLink) => {
  const mailOptions = {
    from: process.env.EMAIL,
    to: user.email,
    subject: 'Verify email address',
    text: `Click link to verify email address:${verificationLink}`
  };
  await transporter.sendMail(mailOptions);
};

const checkAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user.verified) {
      next();
    } else {
      res.redirect('/verify-page');
    }
  } else {
    res.redirect('/');
  }
};

module.exports = {
  hashPassword,
  checkPassword,
  createToken,
  sendVerifyLink,
  checkAuthenticated
};
