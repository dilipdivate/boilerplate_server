const Joi = require('joi');
const { objectById } = require('../../../validations/custom.validation');

const objectId = require('joi-objectid');

Joi.objectId = objectId(Joi);


const createTracks = {
  params: Joi.object().keys({
    albumId: Joi.string().custom(objectById),
  }),
  body: Joi.object().keys({
    trackName: Joi.string(),
    trackStatus: Joi.string().required(),
  }),
};

const getTracks = {
  params: Joi.object().keys({
    albumId: Joi.string().custom(objectById),
  }),
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getTrack = {
  params: Joi.object().keys({
    albumId: Joi.string().custom(objectById),
    trackId: Joi.string().custom(objectById),
  }),
};

const getTrackDetailByUser = {
  params: Joi.object().keys({
    user: Joi.string().required(),
  }),
};

const updateTracks = {
  params: Joi.object().keys({
    albumId: Joi.string().custom(objectById),
    trackId: Joi.required().custom(objectById),
  }),
  body: Joi.object()
    .keys({
      trackStatus: Joi.string().required(),
    })
    .min(1),
};

const deleteTracks = {
  params: Joi.object().keys({
    albumId: Joi.string().custom(objectById),
    trackId: Joi.string().custom(objectById),
  }),
};

module.exports = {
  createTracks,
  getTracks,
  getTrack,
  getTrackDetailByUser,
  updateTracks,
  deleteTracks,
};
