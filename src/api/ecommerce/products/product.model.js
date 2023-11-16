const mongoose = require('mongoose');
const { toJSON, paginate } = require('../../../models/plugins');

const ProductSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: [true, 'Please enter product name'],
      trim: true,
    },
    department: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Please enter product price'],
      min: 1,
      max: 500,
      maxLength: [8, 'Price cannot be more than 8 digits'],
    },
    isbn: {
      type: String,
      trim: true,
    },
    productDescription: {
      type: String,
      trim: true,
      required: [true, 'Please enter product description'],
    },
    category: {
      type: [String],
      required: [true, 'Please enter product category'],
      trim: true,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    images: [
      {
        public_id: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],
    supply: {
      type: Number,
      min: 1,
      max: 1000,
      required: [true, 'Please enter product stock'],
      maxLength: [5, 'Stock cannot exceeds 5 characters'],
    },
    numOfReviews: { type: Number, default: 0 },
    reviews: [
      {
        name: { type: String, required: true },
        rating: { type: Number, required: true },
        comment: { type: String, required: true },
      },
    ],
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    modifiedBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true, collection: 'Product' }
);

// add plugin that converts mongoose to json
ProductSchema.plugin(toJSON);
ProductSchema.plugin(paginate);

/**
 * @typedef Product
 */
const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;
