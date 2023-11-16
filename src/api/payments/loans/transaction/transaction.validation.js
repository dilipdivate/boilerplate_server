const Joi = require('joi');
const { objectById } = require('../../../../validations/custom.validation');

const objectId = require('joi-objectid');

Joi.objectId = objectId(Joi);


const createTransaction = {
  body: Joi.object().keys({
    loanNumber: Joi.number().required(),
    transactionAmount: Joi.number().required(),
    transactionDescription: Joi.string(),
    transactionDate: Joi.date(),
    transactionStatus: Joi.string().required(),
    loan: Joi.objectId().required(),
    customer: Joi.objectId(),
  }),
};

const getTransactions = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getTransaction = {
  params: Joi.object().keys({
    transactionId: Joi.string().custom(objectById),
  }),
};

module.exports = {
  createTransaction,
  getTransactions,
  getTransaction,
};
