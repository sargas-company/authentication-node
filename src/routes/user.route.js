const router = require('express').Router();

const { userController } = require('../controllers');
const {
  checkIsUserValidMiddleware,
  validateUpdatedUser,
} = require('../middlewares/validations');
const { tokenValidationMiddleware } = require('../middlewares/user');

/**
 *@desc get user
 *@route /users/:userId
 *@method GET
 */
router.get('/', tokenValidationMiddleware, userController.get);

/**
 *@desc new user creation
 *@route /users/signup
 *@method POST
 */
router.post('/register', checkIsUserValidMiddleware, userController.register);

/**
 *@desc updating user
 *@route /users
 *@method PATCH
 */
router.patch(
  '/',
  tokenValidationMiddleware,
  validateUpdatedUser,
  userController.update,
);

/**
 *@desc hard deleting user
 *@route /users
 *@method DELETE
 */
router.delete('/', tokenValidationMiddleware, userController.delete);

module.exports = router;
