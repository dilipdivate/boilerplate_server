const httpStatus = require('http-status');
const Loan = require('./loan.model');
const Customer = require('../customer/customer.model');
const ApiError = require('../../../../utils/ApiError');
const Transaction = require('../transaction/transaction.model');

const initialLoanSetup = async (loanBody) => {
  const date = new Date(loanBody.startDate);
  const nextPaymentDate = new Date(date.setMonth(date.getMonth() + 1));
  const loanBalance = loanBody.loanAmount;
  let offsetAmt = 0;
  if (loanBody.offsetAccount) {
    const customerId = loanBody.customer;
    // const { accountBalance } = Customer.find({ customerId });
    const { accountBalance } = Customer.findById(customerId);
    offsetAmt = accountBalance;
  }

  const interestRate = loanBody.interestRate / 1200;
  const reduceBalance = (1 + interestRate) ** (loanBody.loanDuration * 12);
  let emi = loanBody.loanAmount * ((interestRate * reduceBalance) / (reduceBalance - 1));
  emi = parseFloat(emi.toFixed(2));
  return { loanBalance, nextPaymentDate, offsetAmt, emi };
};

const calculateOffsetAmt = async (loanBody) => {
  if (loanBody.offsetAccount) {
    const customerId = loanBody.customer;
    // const { accountBalance } = Customer.find({ customerId });
    const { accountBalance } = Customer.findById(customerId);
    loanBody[offsetAmt] = accountBalance;
  } else {
    loanBody[offsetAmt] = 0;
  }

  // return loanBody;
};

const calculateAmount = async (loanBody) => {
  // calculateOffsetAmt(loanBody);
  console.log('DilipBefore:', loanBody);
  if (loanBody.offsetAccount) {
    const customerId = loanBody.customer;
    // const { accountBalance } = Customer.find({ customerId });
    const { accountBalance } = await Customer.findById(customerId);
    loanBody.offsetAmt = accountBalance;
    loanBody.loanBalance -= loanBody.offsetAmt;
  } else {
    loanBody.offsetAmt = 0;
  }

  if (loanBody.loanAmount > 0) {
    loanBody.interestRate /= 100;
    loanBody.interestAmt = loanBody.loanBalance * loanBody.interestRate * loanBody.loanDuration;
    loanBody.EMI += loanBody.EMI + loanBody.principalAmt + loanBody.interestAmt;
    loanBody.loanBalance -= loanBody.principalAmt;
    loanBody.totalInterestPaid += loanBody.interestAmt;
    // loanBody.loanDuration -= 1;
    // loanBody.interestPaid.paymentDates = Date.now();
    // loanBody.interestPaid.interestCharged = loanBody.interestAmt;
  }
};

/**
 * Create a Loan
 * @param {Object} loanBody
 * @returns {Promise<Loan>}
 */
const createLoan = async (loanBody) => {
  const { loanBalance, nextPaymentDate, offsetAmt, emi } = await initialLoanSetup(loanBody);
  loanBody.loanBalance = loanBalance;
  loanBody.nextPaymentDate = nextPaymentDate;
  loanBody.offsetAmt = offsetAmt;
  loanBody.EMI = emi;
  return Loan.create(loanBody);
};

/**
 * Query for Loans
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryLoans = async (filter, options) => {
  const loans = await Loan.paginate(filter, options);
  return loans;
};

/**
 * Get Loan by id
 * @param {ObjectId} id
 * @returns {Promise<Loan>}
 */
const getLoanById = async (id) => {
  // return Loan.findById(id);
  // return Promise.all([Loan.findById(id), Transaction.find({ loan: id })]);
  const loan = await Loan.findById(id);
  const transactions = await Transaction.find({ loan: id });
  loan.transactions = transactions;
  return loan;
};

/**
 * Get Loan by id
 * @param {ObjectId} id
 * @returns {Promise<Loan>}
 */
const getTransactionsByLoan = async (id) => {
  return Loan.findById(id);
};

/**
 * Get Loan by loanNumber
 * @param {string} loanNumber
 * @returns {Promise<Loan>}
 */
const getLoanByNumber = async (loanNumber) => {
  return Loan.find({ loanNumber });
};

/**
 * Update Loan by id
 * @param {ObjectId} loanId
 * @param {Object} updateBody
 * @returns {Promise<Loan>}
 */
const updateLoanById = async (loanId, updateBody) => {
  const loan = await getLoanById(loanId);
  if (!loan) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Loan not found');
  }
  Object.assign(loan, updateBody);
  await loan.save();
  return loan;
};

/**
 * Delete Loan by id
 * @param {ObjectId} loanId
 * @returns {Promise<Loan>}
 */
const deleteLoanById = async (loanId) => {
  const loan = await getLoanById(loanId);
  if (!loan) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Loan not found');
  }
  await loan.remove();
  return loan;
};

module.exports = {
  createLoan,
  queryLoans,
  getLoanById,
  getTransactionsByLoan,
  getLoanByNumber,
  updateLoanById,
  deleteLoanById,
};
