const { RequestHeadersEnum, ActionEnum } = require('../../constants');
const { verifyToken } = require('../../helpers');

/**
 Middleware function to validate authorization token in the request headers and extract user id and role from it.
 @example
 // In routes that require authorization
 const tokenValidationMiddleware = require('../middlewares/tokenValidationMiddleware');
 router.get('/', tokenValidationMiddleware, userController.getAllUsers);
 */

async function tokenValidationMiddleware(req, res, next) {
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
}

module.exports = tokenValidationMiddleware;
