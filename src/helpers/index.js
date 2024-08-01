const calculateTimeInterval = require('./calculate-time-interval');
const hashing = require('./encryption');
const generateToken = require('./token-generator');
const verifyToken = require('./token-verification');

module.exports = {
  calculateTimeInterval,
  hashing,
  generateToken,
  verifyToken,
};
