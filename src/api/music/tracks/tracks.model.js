const mongoose = require('mongoose');
const { toJSON, paginate } = require('../../../models/plugins');

const TracksSchema = new mongoose.Schema(
  {
    trackName: {
      type: String,
    },
    trackStatus: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, collection: 'Track' }
);

// add plugin that converts mongoose to json
TracksSchema.plugin(toJSON);
TracksSchema.plugin(paginate);

/**
 * @typedef Tracks
 */
const Tracks = mongoose.model('Tracks', TracksSchema);

module.exports = Tracks;
