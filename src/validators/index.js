const newUserValidator = require('./new-user.validator');
const emailPasswordValidator = require('./email-password.validator');
const updatedUserValidator = require('./update-user.validator');
const newPasswordValidator = require('./new-password.validator');

module.exports = {
  emailPasswordValidator,
  newPasswordValidator,
  newUserValidator,
  updatedUserValidator,
};
