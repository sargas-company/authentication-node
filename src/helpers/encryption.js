const bcrypt = require('bcrypt');

/**
 *
 * @desc Hashing password method
 * @param {String} password - password you input
 * @returns hashed string
 */
async function hashPassword(password) {
  try {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(password, salt);
  } catch (err) {
    throw new Error(err);
  }
}

/**
 *
 * @desc compare password with hashed one method
 * @param {String} password - password to be compared
 * @param {String } hashPassword - hashed password
 * @returns true if password matches with hashPassword, while false if not
 */
async function verifyPassword(password, hashPassword) {
  try {
    return await bcrypt.compare(password.toString(), hashPassword.toString());
  } catch (err) {
    throw new Error(err);
  }
}

module.exports = {
  hashPassword,
  verifyPassword,
};
