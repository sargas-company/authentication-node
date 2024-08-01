const { verify } = require('jsonwebtoken');
const { ActionEnum } = require('../constants');
const {
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  RESET_PASSWORD_TOKEN_SECRET,
} = require('../config/constants');

const tokenSecrets = {
  [ActionEnum.USER_ACCESS]: ACCESS_TOKEN_SECRET,
  [ActionEnum.USER_REFRESH]: REFRESH_TOKEN_SECRET,
  [ActionEnum.RESET_PASSWORD]: RESET_PASSWORD_TOKEN_SECRET,
};

module.exports = async (action, token) => {
  try {
    return await verify(token, tokenSecrets[action]);
  } catch (error) {
    return error;
  }
};
