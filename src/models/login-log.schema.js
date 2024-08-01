const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const loginLogScheme = new Schema(
  {
    userId: String,
    isSuccess: Boolean,
    regTime: Date,
  },
  { versionKey: false },
);
module.exports = mongoose.model('loginLog', loginLogScheme);
