const express = require('express');
const productRoute = require('./products/product.route');
const orderRoute = require('./orders/order.route');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/products',
    route: productRoute,
  },
  {
    path: '/orders',
    route: orderRoute,
  },

];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
