const Joi = require('joi');
const { objectById } = require('../../../validations/custom.validation');

const createOrder = {
  body: Joi.object().keys({
    first_name: Joi.string().required(),
    family_name: Joi.string().required(),
    date_of_birth: Joi.date().required(),
    date_of_death: Joi.date(),
  }),
};

const getOrders = {
  query: Joi.object().keys({
    // OrderName: Joi.string().required(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getOrder = {
  params: Joi.object().keys({
    orderId: Joi.string().custom(objectById),
  }),
};

const updateOrder = {
  params: Joi.object().keys({
    orderId: Joi.required().custom(objectById),
  }),
  body: Joi.object()
    .keys({
      first_name: Joi.string().required(),
      family_name: Joi.string().required(),
      date_of_birth: Joi.date().required(),
      date_of_death: Joi.date(),
    })
    .min(1),
};

const deleteOrder = {
  params: Joi.object().keys({
    orderId: Joi.string().custom(objectById),
  }),
};

module.exports = {
  createOrder,
  getOrders,
  getOrder,
  updateOrder,
  deleteOrder,
};
