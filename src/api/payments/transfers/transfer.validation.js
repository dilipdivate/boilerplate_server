const Joi = require('joi');
const { objectById } = require('../../../validations/custom.validation');

const objectId = require('joi-objectid');

Joi.objectId = objectId(Joi);


const createTransfer = {
  body: Joi.object().keys({
    fromUser: Joi.objectId().required(),
    toUser: Joi.objectId().required(),
    fromAccount: Joi.objectId().required(),
    toAccount: Joi.objectId().required(),
    transferAmount: Joi.number().min(1).max(500).required(),
    transferDescription: Joi.string(),
    transferDate: Joi.date(),
    transferStatus: Joi.string().required(),
  }),
};

const getTransfers = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getTransfer = {
  params: Joi.object().keys({
    transferId: Joi.string().custom(objectById),
  }),
};

const getTransferDetailByUser = {
  params: Joi.object().keys({
    user: Joi.string().required(),
  }),
};

const updateTransfer = {
  params: Joi.object().keys({
    transferId: Joi.required().custom(objectById),
  }),
  body: Joi.object()
    .keys({
      transferStatus: Joi.string().required(),
    })
    .min(1),
};

const deleteTransfer = {
  params: Joi.object().keys({
    transferId: Joi.string().custom(objectById),
  }),
};

module.exports = {
  createTransfer,
  getTransfers,
  getTransfer,
  getTransferDetailByUser,
  updateTransfer,
  deleteTransfer,
};
