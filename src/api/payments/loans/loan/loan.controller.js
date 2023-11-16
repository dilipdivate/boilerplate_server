const httpStatus = require('http-status');
const pick = require('../../../../utils/pick');
const ApiError = require('../../../../utils/ApiError');
const catchAsync = require('../../../../utils/catchAsync');
const loanService = require('./loan.service');

const createLoan = catchAsync(async (req, res) => {
  const loan = await loanService.createLoan(req.body);
  res.status(httpStatus.CREATED).send(loan);
});

const getLoans = catchAsync(async (req, res) => {
  const filter = pick(req.query, []);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await loanService.queryLoans(filter, options);
  res.send(result);
});

const getLoan = catchAsync(async (req, res) => {
  const loan = await loanService.getLoanById(req.params.loanId);
  if (!loan) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Loan not found');
  }
  res.send(loan);
});

const getTransactionByLoan = catchAsync(async (req, res) => {
  const loan = await loanService.getTransactionsByLoan(req.params.loanId);
  if (!loan) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Loan not found');
  }
  res.send(loan);
});


const getLoanDetailByNumber = catchAsync(async (req, res) => {
  const loan = await loanService.getLoanByNumber(req.params.loanNumber);
  if (!loan) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Loan not found');
  }
  res.send(loan);
});

const updateLoan = catchAsync(async (req, res) => {
  const loan = await loanService.updateLoanById(req.params.loanId, req.body);
  res.send(loan);
});

const deleteLoan = catchAsync(async (req, res) => {
  await loanService.deleteLoanById(req.params.loanId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createLoan,
  getLoans,
  getLoan,
  getTransactionByLoan,
  getLoanDetailByNumber,
  updateLoan,
  deleteLoan,
};
