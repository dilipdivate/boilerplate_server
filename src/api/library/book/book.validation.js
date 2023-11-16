const Joi = require('joi');
const { objectById } = require('../../../validations/custom.validation');

const objectId = require('joi-objectid');

Joi.objectId = objectId(Joi);


const createBook = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    price: Joi.number().min(1).max(500).required(),
    isbn: Joi.string().required(),
    summary: Joi.string().required(),
    genre: Joi.array().items(Joi.objectId()).default([]),
    author: Joi.objectId().required(),
    publication_year: Joi.date(),
    number_of_pages: Joi.number().min(1),
    available_copies: Joi.number().min(1),
    return_date: Joi.date(),
    reservation_status: Joi.string().required(),
    reserved_by: Joi.objectId(),
  }),
};

const getBooks = {
  query: Joi.object().keys({
    // BookName: Joi.string().required(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getBook = {
  params: Joi.object().keys({
    bookId: Joi.string().custom(objectById),
  }),
};

const getBookDetailByAuthor = {
  params: Joi.object().keys({
    author: Joi.string().required(),
  }),
};

const getBookDetailByGenre = {
  params: Joi.object().keys({
    genre: Joi.string().required(),
  }),
};

const updateBook = {
  params: Joi.object().keys({
    bookId: Joi.required().custom(objectById),
  }),
  body: Joi.object()
    .keys({
      title: Joi.string().required(),
      price: Joi.number().min(1).max(500).required(),
      isbn: Joi.string().required(),
      summary: Joi.string().required(),
      genre: Joi.array().items(Joi.objectId()).default([]),
      author: Joi.objectId().required(),
      publication_year: Joi.date(),
      number_of_pages: Joi.number().min(1),
      available_copies: Joi.number().min(1),
      return_date: Joi.date(),
      reservation_status: Joi.string().required(),
      reserved_by: Joi.objectId(),
    })
    .min(1),
};

const deleteBook = {
  params: Joi.object().keys({
    bookId: Joi.string().custom(objectById),
  }),
};

module.exports = {
  createBook,
  getBooks,
  getBook,
  getBookDetailByAuthor,
  getBookDetailByGenre,
  updateBook,
  deleteBook,
};
