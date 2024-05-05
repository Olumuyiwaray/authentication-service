const crypto = require('crypto');
const transporter = require('./nodemailer');
const User = require('../model/users');
require('dotenv').config();

// Function for hashing password
const genSalt = async () => {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(16, (err, buffer) => {
      if (err) {
        reject(err);
      } else {
        resolve(buffer.toString('hex'));
      }
    });
  });
};

const hashPassword = async (password, salt) => {
  return new Promise((resolve, reject) => {
    if (password.trim() === '' || salt.trim() === '') {
      reject(new Error('Password and salt must not be empty.'));
    } else {
      crypto.pbkdf2(password, salt, 10000, 64, 'sha512', (err, derivedKey) => {
        if (err) {
          reject(err);
        } else {
          resolve(derivedKey.toString('hex'));
        }
      });
    }
  });
};

// Function for checking password

const comparePassword = async (password, hashedPassword, salt) => {
  if (password.trim() === '' || salt.trim() === '') {
    throw new Error('Password and salt must not be empty.');
  }

  if (!hashedPassword) {
    throw new Error('Hashed password must not be empty.');
  }

  const hashedInputPassword = await hashPassword(password, salt);

  if (!hashedInputPassword) {
    throw new Error('Error hashing the password.');
  }

  return hashedInputPassword === hashedPassword;
};

// Function to create verification token

const createToken = async (length) => {
  const randomBytes = await crypto.randomBytes(Math.ceil(length / 2));
  const randomString = await randomBytes.toString('hex').slice(0, length);
  return randomString;
};

// Function to send verification link
const sendVerifyLink = async (user, subject, message) => {
  const mailOptions = {
    from: process.env.EMAIL,
    to: user.email,
    subject: subject,
    html: message
  };
  await transporter.sendMail(mailOptions);
};

const checkAuthStatus = (req, res, next) => {
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

const generateUsername = async (displayName) => {
  const name = displayName || 'User';

  const usernameBase = name.replace(/\s+/g, '').toLowerCase();

  let username = usernameBase;
  let counter = 1;

  while (username) {
    const existingUser = await User.findOne({ username });
    if (!existingUser) {
      break;
    }

    username = `${usernameBase}${counter}`;
    counter++;
  }
  return username;
};

module.exports = {
  genSalt,
  hashPassword,
  comparePassword,
  createToken,
  sendVerifyLink,
  checkAuthStatus,
  generateUsername
};
