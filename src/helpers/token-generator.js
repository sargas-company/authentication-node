const jwt = require('jsonwebtoken');
const constants = require('../config/constants');
const { ActionEnum } = require('../constants');

/**
 *
 * @desc This function genereates access token and refresh token
 * @param {Object} data object that containing user informations - email, role, ...
 * @returns access and refresh tokens
 */
async function generateToken(data) {
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
}

module.exports = generateToken;
