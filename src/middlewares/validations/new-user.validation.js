const { newUserValidator } = require('../../validators');

/**
 * Middleware function to validate user registration data.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.body - The request body containing the user registration data.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function in the chain.
 * @returns {Object} - The HTTP response object with a status code and errors if the validation fails, otherwise the next function in the middleware chain is called.
 */
const checkIsUserValidMiddleware = (req, res, next) => {
  const { error } = newUserValidator.validate(req.body);

  if (error) {
    const errors = error.details.map((e) => e.message);
    return res.status(400).json({ errors });
  }
  next();
};

module.exports = checkIsUserValidMiddleware;
