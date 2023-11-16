const mongoose = require('mongoose');
const { toJSON, paginate } = require('../../../models/plugins');

const { Schema } = mongoose;
const bookSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 1,
      max: 500,
    },
    isbn: {
      type: String,
      trim: true,
    },
    publication_year: {
      type: Date,
    },
    number_of_pages: {
      type: Number,
    },
    available_copies: {
      type: Number,
    },
    summary: {
      type: String,
      trim: true,
    },
    return_date: {
      type: Date,
    },
    reservation_status: {
      type: String,
      trim: true,
      required: true,
    },
    author: { type: Schema.Types.ObjectId, ref: 'Author', required: true },
    genre: [{ type: Schema.Types.ObjectId, ref: 'Genre' }],
    reserved_by: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true, collection: 'Book' }
);

bookSchema.static('findByAuthor', function (author) {
  return this.find({ author });
});

// add plugin that converts mongoose to json
bookSchema.plugin(toJSON);
bookSchema.plugin(paginate);

/**
 * @typedef Book
 */
const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
