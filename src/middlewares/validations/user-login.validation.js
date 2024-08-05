const { emailPasswordValidator } = require('../../validators');

/**
 * Middleware function to validate the request body for user login.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.body - The request body containing the email and password data.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function in the chain.
 * @returns {Object} - The HTTP response object with a status code and errors if the validation fails, otherwise the next function in the middleware chain is called.
 */
const userLoginValidation = (req, res, next) => {
  const { error } = emailPasswordValidator.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    const errors = error.details.map((e) => e.message);
    return res.status(400).json({ errors });
  }
  next();
};

module.exports = userLoginValidation;
