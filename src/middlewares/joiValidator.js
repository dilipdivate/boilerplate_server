const httpStatus = require('http-status');
const Joi = require('joi');
const ApiError = require('../utils/ApiError');

//* Include joi to check error type
//* Include all validators
const Validators = require('../validations');

module.exports = function (validator) {
  //! If validator is not exist, throw err
  if (!Validators.hasOwnProperty(validator)) throw new Error(`'${validator}' validator is not exist`);

  return async function (req, res, next) {
    try {
      const validated = await Validators[validator].validateAsync(req.body);
      console.log(validated);
      req.body = validated;
      next();
    } catch (err) {
      //* Pass err to next
      //! If validation error occurs call next with HTTP 422. Otherwise HTTP 500
      if (err.isJoi) throw new Error(`'${err.message}' `);
      next(new ApiError(httpStatus.BAD_REQUEST, 'Email already taken'));
    }
  };
};
