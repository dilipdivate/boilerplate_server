const mongoose = require('mongoose');
const { toJSON, paginate } = require('../../../models/plugins');

const TransferSchema = new mongoose.Schema(
  {
    fromUser: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    toUser: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    fromAccount: {
      type: mongoose.Schema.ObjectId,
      ref: 'Account',
      required: true,
    },
    toAccount: {
      type: mongoose.Schema.ObjectId,
      ref: 'Account',
      required: true,
    },
    transferDescription: {
      type: String,
    },
    transferAmount: {
      type: Number,
      required: [true, 'Please enter transfer amount'],
      min: 1,
      maxLength: [8, 'Price cannot be more than 8 digits'],
    },
    transferDate: {
      type: Date,
      default: Date.now(),
    },
    transferStatus: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, collection: 'Transfer' }
);

// add plugin that converts mongoose to json
TransferSchema.plugin(toJSON);
TransferSchema.plugin(paginate);

/**
 * @typedef Transfer
 */
const Transfer = mongoose.model('Transfer', TransferSchema);

module.exports = Transfer;
