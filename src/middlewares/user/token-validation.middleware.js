const { RequestHeadersEnum, ActionEnum } = require('../../constants');
const { verifyToken } = require('../../helpers');

/**
 * Middleware function to validate authorization token in the request headers and extract user id and role from it.
 *
 * @example
 * // In routes that require authorization
 * const tokenValidationMiddleware = require('../middlewares/tokenValidationMiddleware');
 * router.get('/', tokenValidationMiddleware, userController.getAllUsers);
 *
 * @param {Object} req - The request object.
 * @param {Object} req.headers - The request headers.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function in the chain.
 * @returns {Promise<void>} - The HTTP response object with a status code and message if the token is invalid or missing, otherwise the next function in the middleware chain is called.
 */
const tokenValidationMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.get(RequestHeadersEnum.AUTHENTICATION);
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res
        .status(401)
        .send({ message: 'Authorization token is missing.' });
    }

    const { userId, role } = await verifyToken(ActionEnum.USER_ACCESS, token);

    if (!userId) {
      return res.status(401).send({ message: 'Token is invalid.' });
    }

    req.userId = userId;
    req.userRole = role;

    next();
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Internal Server Error' });
  }
};

module.exports = tokenValidationMiddleware;
