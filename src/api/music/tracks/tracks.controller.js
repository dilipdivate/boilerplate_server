const httpStatus = require('http-status');
const pick = require('../../../utils/pick');
const ApiError = require('../../../utils/ApiError');
const catchAsync = require('../../../utils/catchAsync');
const trackService = require('./tracks.service');
const albumService = require('../albums/albums.service');

const createTracks = catchAsync(async (req, res) => {
  const albums = await albumService.getAlbumById(req.params.albumId);
  if (!albums) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Albums not found');
  }
  const tracks = await trackService.createTrack(req.body);
  res.status(httpStatus.CREATED).send(tracks);
});

const getTracks = catchAsync(async (req, res) => {
  const albums = await albumService.getAlbumById(req.params.albumId);
  if (!albums) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Albums not found');
  }
  const filter = pick(req.query, []);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await trackService.queryTracks(filter, options);
  res.send(result);
});

const getTrack = catchAsync(async (req, res) => {
  const albums = await albumService.getAlbumById(req.params.albumId);
  if (!albums) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Albums not found');
  }
  const tracks = await trackService.getTrackById(req.params.trackId);
  if (!tracks) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Tracks not found');
  }
  res.send(tracks);
});

const getTrackDetailByAuthor = catchAsync(async (req, res) => {
  const albums = await albumService.getAlbumById(req.params.albumId);
  if (!albums) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Albums not found');
  }
  const tracks = await trackService.getTrackByUser(req.params.user);
  if (!tracks) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Tracks not found');
  }
  res.send(tracks);
});

const getTrackDetailByGenre = catchAsync(async (req, res) => {
  const albums = await albumService.getAlbumById(req.params.albumId);
  if (!albums) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Albums not found');
  }
  const tracks = await trackService.getTrackByGenre(req.params.genre);
  if (!tracks) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Tracks not found');
  }
  res.send(tracks);
});
const updateTracks = catchAsync(async (req, res) => {
  const albums = await albumService.getAlbumById(req.params.albumId);
  if (!albums) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Albums not found');
  }
  const tracksUpd = await trackService.updateTrackById(req.params.trackId, req.body);
  res.send(tracksUpd);
});

const deleteTracks = catchAsync(async (req, res) => {
  const albums = await albumService.getAlbumById(req.params.albumId);
  if (!albums) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Albums not found');
  }
  await trackService.deleteTrackById(req.params.trackId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createTracks,
  getTracks,
  getTrack,
  getTrackDetailByAuthor,
  getTrackDetailByGenre,
  updateTracks,
  deleteTracks,
};
