const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const roleSchema = mongoose.Schema(
  {
    name: String,
  },
  {
    timestamps: true,
    collection: 'Role',
  }
);

// add plugin that converts mongoose to json
roleSchema.plugin(toJSON);

/**
 * @typedef Role
 */
const Role = mongoose.model('Role', roleSchema);

module.exports = Role;
