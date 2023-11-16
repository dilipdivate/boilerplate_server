const Joi = require('joi');
const { objectById } = require('../../../validations/custom.validation');

const createAuthor = {
  body: Joi.object().keys({
    first_name: Joi.string().required(),
    family_name: Joi.string().required(),
    date_of_birth: Joi.date().required(),
    date_of_death: Joi.date(),
  }),
};

const getAuthors = {
  query: Joi.object().keys({
    // AuthorName: Joi.string().required(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getAuthor = {
  params: Joi.object().keys({
    authorId: Joi.string().custom(objectById),
  }),
};

const updateAuthor = {
  params: Joi.object().keys({
    authorId: Joi.required().custom(objectById),
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

const deleteAuthor = {
  params: Joi.object().keys({
    authorId: Joi.string().custom(objectById),
  }),
};

module.exports = {
  createAuthor,
  getAuthors,
  getAuthor,
  updateAuthor,
  deleteAuthor,
};
