const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const { toJSON, paginate } = require('../../../../models/plugins');

const CustomerSchema = new mongoose.Schema(
  {
    accountNumber: {
      type: Number,
    },
    accountBalance: {
      type: Number,
      required: [true, 'Please enter transfer amount'],
      min: 0,
    },
    accountType: {
      type: String,
      required: true,
    },
    accountName: {
      type: String,
      required: true,
    },
    accountOpenDate: {
      type: Date,
    },
    accountStatus: {
      type: String,
      required: true,
    },
    offsetAccount: {
      type: Boolean,
      required: true,
    },
    ispreferredDebit: {
      type: Boolean,
      required: true,
      Default: false
    }
  },
  { timestamps: true, collection: 'Customer' }
);

CustomerSchema.plugin(AutoIncrement, { id: 'account_seq', inc_field: 'accountNumber' });
// add plugin that converts mongoose to json
CustomerSchema.plugin(toJSON);
CustomerSchema.plugin(paginate);

/**
 * @typedef Customer
 */
const Customer = mongoose.model('Customer', CustomerSchema);

module.exports = Customer;
