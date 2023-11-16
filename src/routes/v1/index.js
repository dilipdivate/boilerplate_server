const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const ecommerceRoute = require('../../api/ecommerce/index.route');
const paymentRoute = require('../../api/payments/index.route');
const libraryRoute = require('../../api/library/index.route');
const docsRoute = require('./docs.route');
const config = require('../../config/config');
const musicRoute = require('../../api/music/index.route');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/ecommerce',
    route: ecommerceRoute,
  },
  {
    path: '/library',
    route: libraryRoute,
  },
  {
    path: '/payments',
    route: paymentRoute,
  },
  {
    path: '/music',
    route: musicRoute,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
