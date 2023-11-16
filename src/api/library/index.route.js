const express = require('express');
const bookRoute = require('./book/book.route');
const authorRoute = require('./author/author.route');
const genreRoute = require('./genre/genre.route');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/books',
    route: bookRoute,
  },
  {
    path: '/genres',
    route: genreRoute,
  },
  {
    path: '/authors',
    route: authorRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
