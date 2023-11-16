const Joi = require('joi');
const objectId = require('joi-objectid');
const { objectById } = require('../../../../validations/custom.validation');

Joi.objectId = objectId(Joi);

const createLoan = {
  body: Joi.object().keys({
    loanNumber: Joi.number(),
    loanAmount: Joi.number().required(),
    // .message({
    //   'number.required': `loan amount is mandatory`,
    // }),
    loanBalance: Joi.number(),
    interestRate: Joi.number().required(),
    // .message({
    //   'number.required': `interest rate is mandatory`,
    // }),
    principalAmt: Joi.number(),
    interestAmt: Joi.number(),
    totalInterestPaid: Joi.number(),
    interestPaid: Joi.array().items(
      Joi.object().keys({
        paymentDates: Joi.date(),
        interestCharged: Joi.number(),
      })
    ),
    // .default([]),
    // customer: Joi.array().items(Joi.objectId().required()).default([]),
    EMI: Joi.number(),
    loanDuration: Joi.number().required(),
    // .message({
    //   'number.required': `loan duration is mandatory`,
    // }),
    paymentFrequency: Joi.number().required(),
    // .message({
    //   'number.required': `payment frequency is mandatory`,
    // }),
    loanType: Joi.string().required(),
    // .message({
    //   'string.required': `loan type is mandatory`,
    // }),
    startDate: Joi.date(),
    endDate: Joi.date(),
    nextPaymentDate: Joi.date(),
    loanStatus: Joi.string().required(),
    // .message({
    //   'string.required': `loan status is mandatory`,
    // }),
    offsetAccount: Joi.boolean().required(),
    // .message({
    //   'boolean.required': `does loan have offset facility`,
    // }),
    offsetAmt: Joi.number(),
    customer: Joi.array().items(Joi.objectId().required()).default([]),
    transactions: Joi.array().items(Joi.objectId()).default([]),
  }),
};

const getLoans = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getLoan = {
  params: Joi.object().keys({
    loanId: Joi.string().custom(objectById),
  }),
};

const getTransactionByLoan = {
  params: Joi.object().keys({
    loanId: Joi.string().custom(objectById),
  }),
};

const getLoanDetailByNumber = {
  params: Joi.object().keys({
    loanNumber: Joi.number(),
  }),
};

const updateLoan = {
  params: Joi.object().keys({
    loanId: Joi.required().custom(objectById),
  }),
  body: Joi.object()
    .keys({
      loanAmount: Joi.number(),
      interestRate: Joi.number(),
      loanDuration: Joi.number(),
      loanBalance: Joi.number(),
      principalAmt: Joi.number(),
      interestAmt: Joi.number(),
      totalInterestPaid: Joi.number(),
      paymentFrequency: Joi.number(),
      loanType: Joi.string(),
      startDate: Joi.date(),
      endDate: Joi.date(),
      nextPaymentDate: Joi.date(),
      loanStatus: Joi.string(),
      offsetAccount: Joi.boolean(),
    })
    .min(1),
};

const deleteLoan = {
  params: Joi.object().keys({
    loanId: Joi.string().custom(objectById),
  }),
};

module.exports = {
  createLoan,
  getLoans,
  getLoan,
  getTransactionByLoan,
  getLoanDetailByNumber,
  updateLoan,
  deleteLoan,
};
