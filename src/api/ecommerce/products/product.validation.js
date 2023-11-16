const Joi = require('joi');
const { objectById } = require('../../../validations/custom.validation');

// eslint-disable-next-line import/no-extraneous-dependencies
const objectId = require('joi-objectid');

Joi.objectId = objectId(Joi);

const createProduct = {
  body: Joi.object().keys({
    productName: Joi.string().required(),
    department: Joi.string().required(),
    price: Joi.number().min(1).max(500).required(),
    isbn: Joi.string(),
    productDescription: Joi.string(),
    category: Joi.array().items(Joi.string().alphanum().trim(true)).default([]).required(),
    rating: Joi.number().min(0).max(5),
    images: Joi.array().items(
      Joi.object().keys({
        public_id: Joi.string().required(),
        url: Joi.string().required(),
      })
    ),
    supply: Joi.number().min(1).max(1000),
    numOfReviews: Joi.number(),
    reviews: Joi.array().items(
      Joi.object().keys({
        name: Joi.string().required(),
        rating: Joi.number().required(),
        comment: Joi.string().required(),
      })
    ),
    createdBy: Joi.objectId().required(),
    // modifiedBy: Joi.objectId(),
    modifiedBy: Joi.object().id,
  }),
};

const getProducts = {
  query: Joi.object().keys({
    // productName: Joi.string().required(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getProduct = {
  params: Joi.object().keys({
    productId: Joi.string().custom(objectById),
  }),
};

const updateProduct = {
  params: Joi.object().keys({
    productId: Joi.required().custom(objectById),
  }),
  body: Joi.object()
    .keys({
      productName: Joi.string().required(),
      department: Joi.string().required(),
      price: Joi.number().min(1).max(500).required(),
      isbn: Joi.string(),
      productDescription: Joi.string(),
      category: Joi.array().items(Joi.string()).required(),
      rating: Joi.number().min(0).max(5),
      supply: Joi.number().min(1).max(1000),
    })
    .min(1),
};

const deleteProduct = {
  params: Joi.object().keys({
    productId: Joi.string().custom(objectById),
  }),
};

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
};
