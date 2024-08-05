const jwt = require('jsonwebtoken');
const constants = require('../config/constants');
const { ActionEnum } = require('../constants');
const { userService } = require('../services');

/**
 * @desc This function generates access token and refresh token
 * @param {Object} data object that containing user information - email, role, ...
 * @returns access and refresh tokens
 */
const generateToken = async (data) => {
  const { user, action } = data;
  const { role } = user;

  if (action === ActionEnum.LOGIN) {
    if (action === ActionEnum.LOGIN) {
      const { role, id: userId } = user;

      // Generate access token
      const accessTokenSecret = constants.ACCESS_TOKEN_SECRET;
      const accessExpiresIn = constants.ACCESS_TOKEN_LIFETIME;
      const accessToken = jwt.sign({ role, userId }, accessTokenSecret, {
        expiresIn: accessExpiresIn,
      });

      // Generate refresh token
      const refreshTokenSecret = constants.REFRESH_TOKEN_SECRET;
      const refreshExpiresIn = constants.REFRESH_TOKEN_LIFETIME;
      const refreshToken = jwt.sign({ role, userId }, refreshTokenSecret, {
        expiresIn: refreshExpiresIn,
      });

      return { accessToken, refreshToken };
    }
  }

  if (action === ActionEnum.RESET_PASSWORD) {
    const resetPasswordTokenSecret = constants.RESET_PASSWORD_TOKEN_SECRET;
    const resetPasswordTokenExpiresIn = constants.RESET_PASSWORD_TOKEN_LIFETIME;

    return jwt.sign({ role, userId: user.id }, resetPasswordTokenSecret, {
      expiresIn: resetPasswordTokenExpiresIn,
    });
  }
};

/**
 * Generates access and refresh tokens for a user and saves the refresh token to the user's record.
 *
 * @param {User} user - The user object for which tokens are to be generated.
 * @param {string} user.id - The ID of the user.
 * @returns {Promise<Object>} - A promise that resolves to an object containing the generated access and refresh tokens.
 * @property {string} accessToken - The generated access token.
 * @property {string} refreshToken - The generated refresh token.
 */
const generateAndSaveTokens = async (user) => {
  const { accessToken, refreshToken } = await generateToken({
    user,
    action: ActionEnum.LOGIN,
  });

  // Update the user with the new refresh token
  await userService.updateById({
    id: user.id,
    params: {
      refreshToken,
    },
  });

  return { accessToken, refreshToken };
};

module.exports = {
  generateToken,
  generateAndSaveTokens,
};
