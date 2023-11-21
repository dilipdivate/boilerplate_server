const Joi = require('joi');
const { password, objectById } = require('./custom.validation');

const createUser = {
  body: Joi.object().keys({
    firstName: Joi.string().required().empty(''),
    lastName: Joi.string().required().empty(''),
    email: Joi.string().required().email().empty(''),
    password: Joi.string()
      .min(8)
      .regex(/[a-zA-Z0-9]/)
      .required()
      .custom(password)
      .empty('')
      .strict(),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required().custom(password).empty('').strict(),
    city: Joi.string().required().empty(''),
    state: Joi.string().required().empty(''),
    country: Joi.string().required().empty(''),
    occupation: Joi.string().required().empty(''),
    phoneNumber: Joi.number().required().integer(),
    avatar: Joi.object().keys({
      public_id: Joi.string(),
      url: Joi.string(),
    }),
    role: Joi.string().required().valid('user', 'admin'),
    isEmailVerified: Joi.boolean(),
    verificationToken: Joi.string(),
    verified: Joi.date(),
    resetToken: Joi.object().keys({
      resetPasswordToken: Joi.string(),
      resetPasswordExpire: Joi.date(),
    }),
    passwordReset: Joi.date(),

  }),
};

const getUsers = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectById),
  }),
};

const updateUser = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectById),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      password: Joi.string().custom(password),
      name: Joi.string(),
    })
    .min(1),
};

const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectById),
  }),
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};
