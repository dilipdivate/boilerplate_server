const mongoose = require('mongoose');
const { toJSON, paginate } = require('../../../models/plugins');

const AlbumsSchema = new mongoose.Schema(
  {
    albumName: {
      type: String,
    },
    albumStatus: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, collection: 'Album' }
);

// add plugin that converts mongoose to json
AlbumsSchema.plugin(toJSON);
AlbumsSchema.plugin(paginate);

/**
 * @typedef Albums
 */
const Albums = mongoose.model('Albums', AlbumsSchema);

module.exports = Albums;
