/* eslint-disable no-restricted-syntax */
const httpStatus = require('http-status');
const Loan = require('../loan/loan.model');
const Transaction = require('./transaction.model');
const ApiError = require('../../../../utils/ApiError');
const Customer = require('../customer/customer.model');

function daysInMonth(month, year) {
  return new Date(year, month, 0).getDate();
}

/**
 * Create a Transaction
 * @param {Object} transactionBody
 * @returns {Promise<Transaction>}
 */
const createTransaction = async (transactionBody) => {
  // Update Loan details using the transaction.
  const loanId = transactionBody.loan;
  const customerId = transactionBody.customer;
  const loan = await Loan.findById(loanId);
  if (!loan) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Loan not found');
  }
  let offsetAmt = 0;
  let interestAmt = 0;
  let interestCharged = 0;
  let totalOffsetBalance = 0;
  let { loanBalance } = loan;
  let principalBalance = loanBalance;
  let debitAccountBalance = 0;
  let debitAccount = {};
  let paymentDates = new Date();
  if (transactionBody.transactionDate !== undefined) {
    paymentDates = transactionBody.transactionDate;
  } 

  const date = new Date(loan.nextPaymentDate);

  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const nextPaymentDate = new Date(date.setMonth(date.getMonth() + 1));

  if (customerId !== undefined) {
    const customerTRNRcvd = await Customer.findById(customerId);
    debitAccount = customerTRNRcvd;
    debitAccountBalance = customerTRNRcvd.accountBalance;
  }

  const customerAccounts = loan.customer;
  for await (const customerAccount of customerAccounts) {
    const customers = await Customer.findById(customerAccount);

    if (customers.offsetAccount) {
      totalOffsetBalance += customers.accountBalance;
    }
    offsetAmt = totalOffsetBalance;
    if (customers.ispreferredDebit && customerId === undefined) {
      debitAccount = customers;
      debitAccountBalance = customers.accountBalance;
    }
  }

  if (loanBalance - offsetAmt > 0) {
    principalBalance -= offsetAmt;
    principalBalance = parseFloat(principalBalance.toFixed(2));
    interestAmt = (principalBalance * loan.interestRate * daysInMonth(month, year)) / (365 * 100);
    interestAmt = parseFloat(interestAmt.toFixed(2));
    interestCharged = interestAmt;
  }
  const principalAmt = transactionBody.transactionAmount - interestAmt;
  loanBalance -= principalAmt;
  loanBalance = parseFloat(loanBalance.toFixed(2));
  let totalInterestPaid = loan.totalInterestPaid + interestAmt;
  totalInterestPaid = parseFloat(totalInterestPaid.toFixed(2));
  const loanBody = {
    loanBalance,
    principalAmt,
    interestAmt,
    totalInterestPaid,
    nextPaymentDate,
    interestPaid: [
      ...loan.interestPaid,
      {
        paymentDates,
        interestCharged,
      },
    ],
  };
  Object.assign(loan, loanBody);
  await loan.save();

  // Update customer details using transaction
  debitAccountBalance -= transactionBody.transactionAmount;
  const accountBody = {
    accountBalance: debitAccountBalance,
  };
  Object.assign(debitAccount, accountBody);
  await debitAccount.save();

  return Transaction.create(transactionBody);
};

/**
 * Query for Transactions
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryTransactions = async (filter, options) => {
  const transactions = await Transaction.paginate(filter, options);
  return transactions;
};

/**
 * Get Transaction by id
 * @param {ObjectId} id
 * @returns {Promise<Transaction>}
 */
const getTransactionById = async (id) => {
  return Transaction.findById(id);
};

module.exports = {
  createTransaction,
  queryTransactions,
  getTransactionById,
};
