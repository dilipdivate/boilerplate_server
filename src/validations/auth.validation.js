const Joi = require('joi');
const { password } = require('./custom.validation');

const register = {
  body: Joi.object().keys({
    firstName: Joi.string().required().empty(''),
    lastName: Joi.string().required().empty(''),
    email: Joi.string().required().email().empty(''),
    password: Joi.string().required().custom(password),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required().custom(password).strict(),
    city: Joi.string().required().empty(''),
    state: Joi.string().required().empty(''),
    country: Joi.string().required().empty(''),
    occupation: Joi.string().required().empty(''),
    phoneNumber: Joi.number().required().integer(),
    avatar: Joi.object().keys({
      public_id: Joi.string(),
      url: Joi.string(),
    }),
    verificationToken: Joi.string(),
    verified: Joi.date(),
    resetToken: Joi.object().keys({
      resetPasswordToken: Joi.string(),
      resetPasswordExpire: Joi.date(),
    }),
    passwordReset: Joi.date(),
  }),
};

const login = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const revokeTokens = {
  body: Joi.object().keys({
    revokeToken: Joi.string().required(),
  }),
};

const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

const changePassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    oldPassword: Joi.string().required().custom(password),
    newPassword: Joi.string().required().custom(password),
  }),
};

const resetPassword = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
  body: Joi.object().keys({
    password: Joi.string().required().custom(password),
  }),
};

const verifyEmail = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
};

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  revokeTokens,
  changePassword,
  forgotPassword,
  resetPassword,
  verifyEmail,
};
