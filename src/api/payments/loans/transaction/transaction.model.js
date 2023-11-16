const mongoose = require('mongoose');
const { toJSON, paginate } = require('../../../../models/plugins');

const TransactionSchema = new mongoose.Schema(
  {
    loanNumber: {
      type: Number,
    },
    transactionAmount: {
      type: Number,
      required: [true, 'Please enter transfer amount'],
      min: 1,
    },
    transactionDescription: {
      type: String,
    },
    transactionDate: {
      type: Date,
      default: Date.now(),
    },
    transactionStatus: {
      type: String,
    },
    loan: {
      type: mongoose.Schema.ObjectId,
      ref: 'Loan',
      required: true,
    },
    customer: {
      type: mongoose.Schema.ObjectId,
      ref: 'Customer',
      // required: true,
    },
  },
  { timestamps: true, collection: 'Transaction' }
);

// add plugin that converts mongoose to json
TransactionSchema.plugin(toJSON);
TransactionSchema.plugin(paginate);

/**
 * @typedef Transaction
 */
const Transaction = mongoose.model('Transaction', TransactionSchema);

module.exports = Transaction;
