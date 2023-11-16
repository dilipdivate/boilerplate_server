const express = require('express');
const albumsRoute = require('./albums/albums.route');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/albums',
    route: albumsRoute,
  },

];


defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});


module.exports = router;
