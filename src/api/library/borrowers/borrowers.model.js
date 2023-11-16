const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON, paginate } = require('../../../models/plugins');

const { Schema } = mongoose;
const borrowerSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Pleae Enter your name'],
      maxLength: [30, 'Name should be maximum of 30 characters'],
      minLength: [4, 'Name should be atleast 4 characters long'],
      trim: true,
    },
    phone_number: {
      type: Number,
      required: true,
      min: 10,
      max: 10,
    },
    email: {
      type: String,
      required: [true, 'Pleae Enter your Email'],
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
    address: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true, collection: 'Borrower' }
);

// add plugin that converts mongoose to json
borrowerSchema.plugin(toJSON);
borrowerSchema.plugin(paginate);

/**
 * @typedef Borrower
 */
const Borrower = mongoose.model('Borrower', borrowerSchema);

module.exports = Borrower;
