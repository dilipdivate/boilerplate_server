const httpStatus = require('http-status');
const pick = require('../../../utils/pick');
const ApiError = require('../../../utils/ApiError');
const catchAsync = require('../../../utils/catchAsync');
const transferService = require('./transfer.service');

const createTransfer = catchAsync(async (req, res) => {
  const transfer = await transferService.createTransfer(req.body);
  res.status(httpStatus.CREATED).send(transfer);
});

const getTransfers = catchAsync(async (req, res) => {
  const filter = pick(req.query, []);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await transferService.queryTransfers(filter, options);
  res.send(result);
});

const getTransfer = catchAsync(async (req, res) => {
  const transfer = await transferService.getTransferById(req.params.transferId);
  if (!transfer) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Transfer not found');
  }
  res.send(transfer);
});

const getTransferDetailByAuthor = catchAsync(async (req, res) => {
  const transfer = await transferService.getTransferByUser(req.params.user);
  if (!transfer) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Transfer not found');
  }
  res.send(transfer);
});

const getTransferDetailByGenre = catchAsync(async (req, res) => {
  const transfer = await transferService.getTransferByGenre(req.params.genre);
  if (!transfer) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Transfer not found');
  }
  res.send(transfer);
});
const updateTransfer = catchAsync(async (req, res) => {
  const transfer = await transferService.updateTransferById(req.params.transferId, req.body);
  res.send(transfer);
});

const deleteTransfer = catchAsync(async (req, res) => {
  await transferService.deleteTransferById(req.params.transferId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createTransfer,
  getTransfers,
  getTransfer,
  getTransferDetailByAuthor,
  getTransferDetailByGenre,
  updateTransfer,
  deleteTransfer,
};
