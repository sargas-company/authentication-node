const Joi = require('joi');

const emailPasswordValidator = Joi.object({
  email: Joi.string().email({ minDomainSegments: 2 }).required().messages({
    'string.base': 'Email must be a string',
    'string.empty': 'Email is required',
    'string.email': 'Email is invalid',
    'any.required': 'Email is required',
  }),
  password: Joi.string().min(6).required().messages({
    'string.base': 'Password must be a string',
    'string.empty': 'Password is required',
    'string.min': 'Password must be at least 6 characters',
    'any.required': 'Password is required',
  }),
});

module.exports = emailPasswordValidator;
