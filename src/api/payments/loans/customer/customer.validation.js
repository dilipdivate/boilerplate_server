const Joi = require('joi');
const objectId = require('joi-objectid');
const { objectById } = require('../../../../validations/custom.validation');

Joi.objectId = objectId(Joi);

const createCustomer = {
  body: Joi.object().keys({
    accountNumber: Joi.number(),
    accountBalance: Joi.number().required(),
    accountType: Joi.string().required(),
    accountName: Joi.string().required(),
    accountOpenDate: Joi.date(),
    accountStatus: Joi.string().required(),
    offsetAccount: Joi.boolean().required(),
    ispreferredDebit: Joi.boolean(),
  }),
};

const getCustomers = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getCustomer = {
  params: Joi.object().keys({
    customerId: Joi.string().custom(objectById),
  }),
};

const getCustomerDetailByUser = {
  params: Joi.object().keys({
    customerNumber: Joi.number(),
  }),
};

const updateCustomer = {
  params: Joi.object().keys({
    customerId: Joi.required().custom(objectById),
  }),
  body: Joi.object()
    .keys({
      accountType: Joi.string(),
      accountName: Joi.string(),
      accountBalance: Joi.number(),
      accountOpenDate: Joi.date(),
      accountStatus: Joi.string(),
      offsetAccount: Joi.boolean(),
      ispreferredDebit: Joi.boolean(),
    })
    .min(1),
};

const deleteCustomer = {
  params: Joi.object().keys({
    customerId: Joi.string().custom(objectById),
  }),
};

module.exports = {
  createCustomer,
  getCustomers,
  getCustomer,
  getCustomerDetailByUser,
  updateCustomer,
  deleteCustomer,
};
