const httpStatus = require('http-status');
const Transfer = require('./transfer.model');
const ApiError = require('../../../utils/ApiError');

/**
 * Create a Transfer
 * @param {Object} transferBody
 * @returns {Promise<Transfer>}
 */
const createTransfer = async (transferBody) => {
  return Transfer.create(transferBody);
};

/**
 * Query for Transfers
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryTransfers = async (filter, options) => {
  const transfers = await Transfer.paginate(filter, options);
  return transfers;
};

/**
 * Get Transfer by id
 * @param {ObjectId} id
 * @returns {Promise<Transfer>}
 */
const getTransferById = async (id) => {
  return Transfer.findById(id);
};

/**
 * Get Transfer by genre
 * @param {string} genre
 * @returns {Promise<Transfer>}
 */
const getTransferByGenre = async (genre) => {
  return Transfer.findOne({ genre });
};

/**
 * Get Transfer by author
 * @param {string} author
 * @returns {Promise<Transfer>}
 */
const getTransferByAuthor = async (author) => {
  return Transfer.findOne({ author });
};
/**
 * Update Transfer by id
 * @param {ObjectId} transferId
 * @param {Object} updateBody
 * @returns {Promise<Transfer>}
 */
const updateTransferById = async (transferId, updateBody) => {
  const transfer = await getTransferById(transferId);
  if (!transfer) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Transfer not found');
  }
  Object.assign(transfer, updateBody);
  await transfer.save();
  return transfer;
};

/**
 * Delete Transfer by id
 * @param {ObjectId} transferId
 * @returns {Promise<Transfer>}
 */
const deleteTransferById = async (transferId) => {
  const transfer = await getTransferById(transferId);
  if (!transfer) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Transfer not found');
  }
  await transfer.remove();
  return transfer;
};

module.exports = {
  createTransfer,
  queryTransfers,
  getTransferById,
  getTransferByGenre,
  getTransferByAuthor,
  updateTransferById,
  deleteTransferById,
};
