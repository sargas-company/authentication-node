const mongoose = require('mongoose');
const { RoleEnum, TwoFactorAuthEnum } = require('../constants');

const Schema = mongoose.Schema;
const userScheme = new Schema(
  {
    username: String,
    email: String,
    password: String,
    role: {
      type: String,
      default: RoleEnum.USER,
    },
    refreshToken: String,
    twoFactorAuth: {
      type: String,
      default: TwoFactorAuthEnum.OPTIONAL,
    },
    isLock: {
      type: Boolean,
      default: false,
    },
    lockRegTime: Date,
  },
  { versionKey: false },
);
module.exports = mongoose.model('User', userScheme);
