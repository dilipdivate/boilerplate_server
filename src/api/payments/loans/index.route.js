const express = require('express');
const customerRoute = require('./customer/customer.route');
const loanRoute = require('./loan/loan.route');
const transactionRoute = require('./transaction/transaction.route');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/customer',
    route: customerRoute,
  },
  {
    path: '/loan',
    route: loanRoute,
  },
  {
    path: '/transaction',
    route: transactionRoute,
  },
];


defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});


module.exports = router;

