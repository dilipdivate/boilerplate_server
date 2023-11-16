const mongoose = require('mongoose');
const { toJSON, paginate } = require('../../../models/plugins');

const { Schema } = mongoose;
const AuthorSchema = new Schema(
  {
    first_name: { type: String, required: true, trim: true, maxLength: 100 },
    family_name: { type: String, required: true, trim: true, maxLength: 100 },
    date_of_birth: { type: Date },
    date_of_death: { type: Date },
  },
  { timestamps: true, collection: 'Author' }
);

// Virtual for author's full name
AuthorSchema.virtual('name').get(function () {
  // To avoid errors in cases where an author does not have either a family name or first name
  // We want to make sure we handle the exception by returning an empty string for that case
  let fullname = '';
  if (this.first_name && this.family_name) {
    fullname = `${this.family_name}, ${this.first_name}`;
  }
  if (!this.first_name || !this.family_name) {
    fullname = '';
  }
  return fullname;
});

// Virtual for author's lifespan
AuthorSchema.virtual('lifespan').get(function () {
  let lifetime = '';
  if (this.date_of_birth) {
    lifetime = this.date_of_birth.getYear().toString();
  }
  lifetime += ' - ';
  if (this.date_of_death) {
    lifetime += this.date_of_death.getYear();
  }
  return lifetime;
});

// add plugin that converts mongoose to json
AuthorSchema.plugin(toJSON);
AuthorSchema.plugin(paginate);

/**
 * @typedef Author
 */
const Author = mongoose.model('Author', AuthorSchema);

module.exports = Author;
