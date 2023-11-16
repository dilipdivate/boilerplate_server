const httpStatus = require('http-status');
const pick = require('../../../utils/pick');
const ApiError = require('../../../utils/ApiError');
const catchAsync = require('../../../utils/catchAsync');
const albumService = require('./albums.service');

const createAlbums = catchAsync(async (req, res) => {
  const albums = await albumService.createAlbum(req.body);
  res.status(httpStatus.CREATED).send(albums);
});

const getAlbums = catchAsync(async (req, res) => {
  const filter = pick(req.query, []);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await albumService.queryAlbums(filter, options);
  res.send(result);
});

const getAlbum = catchAsync(async (req, res) => {
  const albums = await albumService.getAlbumById(req.params.albumId);
  if (!albums) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Albums not found');
  }
  res.send(albums);
});

const getAlbumDetailByAuthor = catchAsync(async (req, res) => {
  const albums = await albumService.getAlbumByUser(req.params.user);
  if (!albums) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Albums not found');
  }
  res.send(albums);
});

const getAlbumDetailByGenre = catchAsync(async (req, res) => {
  const albums = await albumService.getAlbumByGenre(req.params.genre);
  if (!albums) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Albums not found');
  }
  res.send(albums);
});
const updateAlbums = catchAsync(async (req, res) => {
  const albums = await albumService.updateAlbumById(req.params.albumId, req.body);
  res.send(albums);
});

const deleteAlbums = catchAsync(async (req, res) => {
  await albumService.deleteAlbumById(req.params.albumId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createAlbums,
  getAlbums,
  getAlbum,
  getAlbumDetailByAuthor,
  getAlbumDetailByGenre,
  updateAlbums,
  deleteAlbums,
};
