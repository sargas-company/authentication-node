const constants = require('../../config/constants');
const { RequestHeadersEnum } = require('../../constants');

/**
 * Middleware function to check if the API key in the request headers matches the expected API key.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.headers - The request headers.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function in the chain.
 * @returns {Object} - The HTTP response object with a status code and message if the API key is invalid, otherwise the next function in the middleware chain is called.
 */
const apiKeyMiddleware = (req, res, next) => {
  const apiKey = req.get(RequestHeadersEnum.API_KEY);

  if (apiKey === constants.API_KEY) {
    return next();
  }

  return res.status(401).send({ message: 'Invalid API key' });
};

module.exports = apiKeyMiddleware;
