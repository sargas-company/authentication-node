const { emailPasswordValidator } = require('../../validators');

/**
 Validates the request body for user login.
 */

function userLoginValidation(req, res, next) {
  const { error } = emailPasswordValidator.validate(req.body, { abortEarly: false });

  if (error) {
    const errors = error.details.map((e) => e.message);
    return res.status(400).json({ errors });
  }
  next();
}

module.exports = userLoginValidation;
