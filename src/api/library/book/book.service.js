const httpStatus = require('http-status');
const Book = require('./book.model');
const ApiError = require('../../../utils/ApiError');

/**
 * Create a Book
 * @param {Object} bookBody
 * @returns {Promise<Book>}
 */
const createBook = async (bookBody) => {
  return Book.create(bookBody);
};

/**
 * Query for Books
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryBooks = async (filter, options) => {
  const books = await Book.paginate(filter, options);
  return books;
};

/**
 * Get Book by id
 * @param {ObjectId} id
 * @returns {Promise<Book>}
 */
const getBookById = async (id) => {
  return Book.findById(id);
};

/**
 * Get Book by genre
 * @param {string} genre
 * @returns {Promise<Book>}
 */
const getBookByGenre = async (genre) => {
  return Book.findOne({ genre });
};

/**
 * Get Book by author
 * @param {string} author
 * @returns {Promise<Book>}
 */
const getBookByAuthor = async (author) => {
  return Book.findOne({ author });
};
/**
 * Update Book by id
 * @param {ObjectId} bookId
 * @param {Object} updateBody
 * @returns {Promise<Book>}
 */
const updateBookById = async (bookId, updateBody) => {
  const book = await getBookById(bookId);
  if (!book) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Book not found');
  }
  Object.assign(book, updateBody);
  await book.save();
  return book;
};

/**
 * Delete Book by id
 * @param {ObjectId} bookId
 * @returns {Promise<Book>}
 */
const deleteBookById = async (bookId) => {
  const book = await getBookById(bookId);
  if (!book) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Book not found');
  }
  await book.remove();
  return book;
};

module.exports = {
  createBook,
  queryBooks,
  getBookById,
  getBookByGenre,
  getBookByAuthor,
  updateBookById,
  deleteBookById,
};
