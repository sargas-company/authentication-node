const Joi = require('joi');
const constant = require('../constants');
const { TwoFactorAuthEnum } = require('../constants');

const updatedUserValidator = Joi.object({
  username: Joi.string().trim().max(25).min(2).messages({
    'string.base': 'Username must be a string',
    'string.empty': 'Username is required',
    'string.min': 'Username must be at least {#limit} characters',
    'string.max': 'Username must be at most {#limit} characters',
    'any.required': 'Username is required',
  }),
  password: Joi.string().min(6).messages({
    'string.base': 'Password must be a string',
    'string.empty': 'Password is required',
    'string.min': 'Password must be at least {#limit} characters',
    'any.required': 'Password is required',
  }),
  phone: Joi.string().trim().regex(constant.RegExpEnum.phone).messages({
    'string.base': 'Phone must be a string',
    'string.pattern.base': 'Phone must be a valid phone number',
    'string.trim': 'Phone cannot have leading or trailing whitespace',
  }),
  twoFactorAuth: Joi.string()
    .trim()
    .valid(
      TwoFactorAuthEnum.OPTIONAL,
      TwoFactorAuthEnum.REQUIRED,
      TwoFactorAuthEnum.NOT_OFFERED,
    )
    .messages({
      'any.only': '2FA must be one of "required", "optional", or "not offered"',
      'any.required': '2FA is required',
      'string.base': '2FA must be a string',
      'string.trim': '2FA cannot have leading or trailing whitespace',
    }),
});

module.exports = updatedUserValidator;
