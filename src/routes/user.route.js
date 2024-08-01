const router = require('express').Router();

const { userController } = require('../controllers');
const {
  checkIsUserValidMiddleware,
  validateUpdatedUser,
} = require('../middlewares/validations');
const { tokenValidationMiddleware } = require('../middlewares/user');

// Create new user
/**
 *@desc new user creation
 *@route /users/signup
 *@method POST
 */
router.post('/register', checkIsUserValidMiddleware, userController.register);

// Update user by id
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

// Delete user by id
/**
 *@desc hard deleting user
 *@route /users
 *@method DELETE
 */
router.delete('/', tokenValidationMiddleware, userController.delete);

module.exports = router;
