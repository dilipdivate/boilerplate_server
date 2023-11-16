const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const { toJSON, paginate } = require('../../../../models/plugins');

const LoanSchema = new mongoose.Schema(
  {
    loanNumber: {
      type: Number,
    },
    loanAmount: {
      type: Number,
      required: [true, 'Please enter transfer amount'],
      min: 1,
      default: 0,
    },
    loanBalance: {
      type: Number,
      required: [true, 'Please enter transfer amount'],
      min: 0,
      default: 0,
    },
    interestRate: {
      type: Number,
      required: [true, 'Please enter interest rate'],
    },
    principalAmt: {
      type: Number,
      default: 0,
    },
    interestAmt: {
      type: Number,
      default: 0,
    },
    totalInterestPaid: {
      type: Number,
      default: 0,
    },
    interestPaid: [
      {
        paymentDates: {
          type: Date,
        },
        interestCharged: {
          type: Number,
          default: 0,
        },
      },
    ],
    EMI: {
      type: Number,
      default: 0,
    },
    loanDuration: {
      type: Number,
      required: [true, 'Please enter loan duration'],
      min: 0,
      default: 0,
    },
    paymentFrequency: {
      type: Number,
      required: [true, 'Please enter loan duration'],
      min: 0,
      default: 0,
    },
    loanType: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    interestDate: {
      type: Date,
    },
    nextPaymentDate: {
      type: Date,
      default: Date.now(),
    },
    loanStatus: {
      type: String,
      required: true,
    },
    offsetAccount: {
      type: Boolean,
      required: true,
    },
    offsetAmt: {
      type: Number,
      min: 0,
      default: 0,
    },
    customer: [
      {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'Customer',
      },
    ],
    transactions: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'transaction',
      },
    ],
  },
  { timestamps: true, collection: 'Loan' }
);

LoanSchema.plugin(AutoIncrement, { id: 'loan_seq', inc_field: 'loanNumber' });
// add plugin that converts mongoose to json
LoanSchema.plugin(toJSON);
LoanSchema.plugin(paginate);

/**
 * @typedef Loan
 */

// LoanSchema.pre('save', async function (next) {
//   const loan = this;
//   loan.EMI = 0;
//   next();
// });

const Loan = mongoose.model('Loan', LoanSchema);

module.exports = Loan;
