const httpStatus = require('http-status');
const Genre = require('./genre.model');
const Book = require('../book/book.model');
const ApiError = require('../../../utils/ApiError');

/**
 * Create a Genre
 * @param {Object} genreBody
 * @returns {Promise<Genre>}
 */
const createGenre = async (genreBody) => {
  return Genre.create(genreBody);
};

/**
 * Query for Genres
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryGenres = async (filter, options) => {
  const genres = await Genre.paginate(filter, options);
  return genres;
};

/**
 * Get Genre by id
 * @param {ObjectId} id
 * @returns {Promise<Genre>}
 */
const getGenreById = async (id) => {
  return Promise.all([Genre.findById(id).exec(), Book.find({ genre: id })]);
  // return Genre.findById(id);
};

/**
 * Get Genre by category
 * @param {string} category
 * @returns {Promise<Genre>}
 */
const getGenreByCategory = async (category) => {
  return Genre.findOne({ category });
};

/**
 * Update Genre by id
 * @param {ObjectId} genreId
 * @param {Object} updateBody
 * @returns {Promise<Genre>}
 */
const updateGenreById = async (genreId, updateBody) => {
  const genre = await getGenreById(genreId);
  if (!genre) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Genre not found');
  }
  Object.assign(genre, updateBody);
  await genre.save();
  return genre;
};

/**
 * Delete Genre by id
 * @param {ObjectId} genreId
 * @returns {Promise<Genre>}
 */
const deleteGenreById = async (genreId) => {
  const genre = await getGenreById(genreId);
  if (!genre) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Genre not found');
  }
  await genre.remove();
  return genre;
};

module.exports = {
  createGenre,
  queryGenres,
  getGenreById,
  getGenreByCategory,
  updateGenreById,
  deleteGenreById,
};
