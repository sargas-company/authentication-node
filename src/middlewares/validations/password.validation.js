const { newPasswordValidator } = require('../../validators');

/**
 Validates the request body for user login.
 */

function passwordValidation(req, res, next) {
  const { error } = newPasswordValidator.validate(req.body);

  if (error) {
    const errors = error.details.map((e) => e.message);
    return res.status(400).json({ errors });
  }
  next();
}

module.exports = passwordValidation;
