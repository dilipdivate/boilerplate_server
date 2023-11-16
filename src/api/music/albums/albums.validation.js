const Joi = require('joi');
const { objectById } = require('../../../validations/custom.validation');

const objectId = require('joi-objectid');

Joi.objectId = objectId(Joi);


const createAlbums = {
  body: Joi.object().keys({
    albumName: Joi.string(),
    albumStatus: Joi.string().required(),
  }),
};

const getAlbums = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getAlbum = {
  params: Joi.object().keys({
    albumId: Joi.string().custom(objectById),
  }),
};

const getAlbumDetailByUser = {
  params: Joi.object().keys({
    user: Joi.string().required(),
  }),
};

const updateAlbums = {
  params: Joi.object().keys({
    albumId: Joi.required().custom(objectById),
  }),
  body: Joi.object()
    .keys({
      albumStatus: Joi.string().required(),
    })
    .min(1),
};

const deleteAlbums = {
  params: Joi.object().keys({
    albumId: Joi.string().custom(objectById),
  }),
};

module.exports = {
  createAlbums,
  getAlbums,
  getAlbum,
  getAlbumDetailByUser,
  updateAlbums,
  deleteAlbums,
};
