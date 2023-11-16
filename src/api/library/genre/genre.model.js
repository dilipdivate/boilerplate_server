const mongoose = require('mongoose');
const { toJSON, paginate } = require('../../../models/plugins');

const { Schema } = mongoose;
const GenreSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxLength: 100 },
  },
  { timestamps: true, collection: 'Genre' }
);

// add plugin that converts mongoose to json
GenreSchema.plugin(toJSON);
GenreSchema.plugin(paginate);

/**
 * @typedef Genre
 */
const Genre = mongoose.model('Genre', GenreSchema);

module.exports = Genre;
