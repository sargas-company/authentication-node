const { updatedUserValidator } = require('../../validators');

/**
 Validates the request body for user update.
 */

function validateUpdatedUser(req, res, next) {
  const { error } = updatedUserValidator.validate(req.body);

  if (error) {
    const errors = error.details.map((e) => e.message);
    return res.status(400).json({ errors });
  }
  next();
}

module.exports = validateUpdatedUser;
