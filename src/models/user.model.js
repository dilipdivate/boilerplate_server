const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const { toJSON, paginate } = require('./plugins');
const { roles } = require('../config/roles');

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'Pleae Enter your firstname'],
      maxLength: [30, 'Name should be maximum of 30 characters'],
      minLength: [2, 'Name should be atleast 4 characters long'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Pleae Enter your lastname'],
      maxLength: [30, 'Name should be maximum of 30 characters'],
      minLength: [2, 'Name should be atleast 4 characters long'],
      trim: true,
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
    password: {
      type: String,
      required: [true, 'Pleae Enter your password'],
      trim: true,
      minLength: [8, 'Name should be atleast 8 characters long'],
      validate(value) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error('Password must contain at least one letter and one number');
        }
      },
      private: true, // used by the toJSON plugin
    },
    confirmPassword: {
      type: String,
      required: [true, 'Pleae confirm your password'],
      trim: true,
      select: false,
      minLength: [8, 'Name should be atleast 8 characters long'],
      validate(value) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error('Password must contain at least one letter and one number');
        }
      },
      private: true, // used by the toJSON plugin
    },
    city: {
      type: String,
      required: [true, 'Pleae Enter your city'],
      maxLength: [30, 'Name should be maximum of 30 characters'],
      minLength: [4, 'Name should be atleast 4 characters long'],
      trim: true,
    },
    state: {
      type: String,
      required: [true, 'Pleae Enter your state'],
      maxLength: [30, 'Name should be maximum of 30 characters'],
      minLength: [4, 'Name should be atleast 4 characters long'],
      trim: true,
    },
    country: {
      type: String,
      required: [true, 'Pleae Enter your country'],
      maxLength: [30, 'Name should be maximum of 30 characters'],
      minLength: [4, 'Name should be atleast 4 characters long'],
      trim: true,
    },
    occupation: {
      type: String,
      required: [true, 'Pleae Enter your occupation'],
      maxLength: [30, 'Name should be maximum of 30 characters'],
      minLength: [4, 'Name should be atleast 4 characters long'],
      trim: true,
    },
    phoneNumber: {
      type: Number,
      required: [true, 'Pleae Enter your phonenumber'],
      maxLength: [10, 'Name should be maximum of 10 characters'],
      minLength: [10, 'Name should be atleast 10 characters long'],
      trim: true,
    },
    avatar: {
      public_id: { type: String },
      url: { type: String },
    },
    role: {
      type: String,
      enum: roles,
      default: 'user',
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: String,
    verified: Date,
    resetToken: {
      resetPasswordToken: String,
      resetPasswordExpire: Date,
    },
    passwordReset: Date,
  },
  {
    timestamps: true,
    collection: 'User',
  }
);

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);
userSchema.plugin(paginate);

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

// Generating password reset token
userSchema.methods.getResetPasswordToken = async function () {
  // Generate Token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hashing and adding to User Schema
  this.resetPasswordToken = crypto.createHash('SHA256').update(resetToken).digest('hex');
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
};

userSchema.virtual('isVerified').get(function () {
  return !!(this.verified || this.passwordReset);
});

userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }
  if (user.isModified('confirmPassword')) {
    const salt = await bcrypt.genSalt(10);
    user.confirmPassword = await bcrypt.hash(user.confirmPassword, salt);
  }
  next();
});

/**
 * @typedef User
 */
const User = mongoose.model('User', userSchema);

module.exports = User;
