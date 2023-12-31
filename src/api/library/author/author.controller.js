const httpStatus = require('http-status');
const pick = require('../../../utils/pick');
const ApiError = require('../../../utils/ApiError');
const catchAsync = require('../../../utils/catchAsync');
const authorService = require('./author.service');

const createAuthor = catchAsync(async (req, res) => {
  const author = await authorService.createAuthor(req.body);
  res.status(httpStatus.CREATED).send(author);
});

const getAuthors = catchAsync(async (req, res) => {
  const filter = pick(req.query, []);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await authorService.queryAuthors(filter, options);
  res.send(result);
});

const getAuthor = catchAsync(async (req, res) => {
  const author = await authorService.getAuthorById(req.params.authorId);
  if (!author) {
    throw new ApiError(httpStatus.NOT_FOUND, 'author not found');
  }
  res.send(author);
});

const updateAuthor = catchAsync(async (req, res) => {
  const author = await authorService.updateAuthorById(req.params.authorId, req.body);
  res.send(author);
});

const deleteAuthor = catchAsync(async (req, res) => {
  await authorService.deleteAuthorById(req.params.authorId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createAuthor,
  getAuthors,
  getAuthor,
  updateAuthor,
  deleteAuthor,
};
