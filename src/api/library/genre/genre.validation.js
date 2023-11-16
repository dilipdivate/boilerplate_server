const Joi = require('joi');
const { objectById } = require('../../../validations/custom.validation');

const createGenre = {
  body: Joi.object().keys({
    name: Joi.string().required(),
  }),
};

const getGenres = {
  query: Joi.object().keys({
    // GenreName: Joi.string().required(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getGenre = {
  params: Joi.object().keys({
    genreId: Joi.string().custom(objectById),
  }),
};

const updateGenre = {
  params: Joi.object().keys({
    genreId: Joi.required().custom(objectById),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string().required(),
    })
    .min(1),
};

const deleteGenre = {
  params: Joi.object().keys({
    genreId: Joi.string().custom(objectById),
  }),
};

module.exports = {
  createGenre,
  getGenres,
  getGenre,
  updateGenre,
  deleteGenre,
};
