const router = require('express').Router();
const { authController } = require('../controllers');
const {
  userLoginValidation,
  passwordValidation,
} = require('../middlewares/validations');

/**
 * @desc This route handles user login
 * @route /auth/login
 * @method POST
 */
router.post('/login', userLoginValidation, authController.login);

/**
 * @desc This route handles regenerate refresh token
 * @route /auth/refresh
 * @method POST
 */
router.patch('/refresh', authController.refreshToken);

/**
 * @desc This route handles send email with reset password link to users
 * @route /auth/resetPassword
 * @method POST
 */
router.post('/resetPassword', authController.resetPassword);

/**
 * @desc This route handles update user password
 * @route /auth/updatePassword/:token
 * @method PATCH
 */
router.patch(
  '/updatePassword/:token',
  passwordValidation,
  authController.updatePassword,
);

module.exports = router;
