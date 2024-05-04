const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const resetTokenSchema = new Schema(
  {
    token: { type: String, required: true },
    userId: { type: String, required: true },
    used: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const ResetToken = mongoose.model('Resettoken', resetTokenSchema);

module.exports = ResetToken;
