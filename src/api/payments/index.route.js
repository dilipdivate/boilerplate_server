const express = require('express');
const transferRoute = require('./transfers/transfer.route');
const loansRoute = require('./loans/index.route');
// const loansRoute = require('./loans/loan/loan.route');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/transfer',
    route: transferRoute,
  },
  {
    path: '/loans',
    route: loansRoute,
  },
];


defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});


module.exports = router;

