const checkIsUserValidMiddleware = require('./new-user.validation');
const userLoginValidation = require('./user-login.validation');
const validateUpdatedUser = require('./user-update.validation');
const passwordValidation = require('./password.validation');

module.exports = {
  checkIsUserValidMiddleware,
  passwordValidation,
  userLoginValidation,
  validateUpdatedUser,
};
