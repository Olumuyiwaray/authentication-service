const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: function () {
        return this.auth_method === 'traditional';
      },
      unique: true,
      lowercase: true
    },
    username: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: function () {
        return this.auth_method === 'traditional';
      }
    },
    salt: {
      type: String,
      required: function () {
        return this.auth_method === 'traditional';
      }
    },
    auth_method: {
      type: String,
      required: true
    },
    provider: {
      type: String,
      required: function () {
        return this.auth_method === 'oauth';
      }
    },
    verified: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);
module.exports = User;
