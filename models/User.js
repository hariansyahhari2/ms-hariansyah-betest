const mongoose = require('mongoose');
const Schema = mongoose.Schema

const userSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  emailAddress: { type: String, unique: true, required: true },
  accountNumber: { type: Number, unique: true, required: true },
  identityNumber: { type: Number, unique: true, required: true },
  password: { type: String, required: true },
  deleted: { type: Date, default: null },
  token: String
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
