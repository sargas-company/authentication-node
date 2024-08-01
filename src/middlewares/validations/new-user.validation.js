const { newUserValidator } = require('../../validators');

/**
 Middleware function to validate user registration data.
 */

function checkIsUserValidMiddleware(req, res, next) {
  const { error } = newUserValidator.validate(req.body);

  if (error) {
    const errors = error.details.map((e) => e.message);
    return res.status(400).json({ errors });
  }
  next();
}

module.exports = checkIsUserValidMiddleware;
