const Joi = require('joi');
const { Schema, model } = require('mongoose');

const { handleMongooseError } = require('../helpers');

const emailRageXP = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

const mongooseUserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: [true, 'Set password for user'],
      minlength: 6,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      match: emailRageXP,
    },
    subscription: {
      type: String,
      enum: ['starter', 'pro', 'business'],
      default: 'starter',
    },
    token: {
      type: String,
      default: '',
    },
    avatarURL: {
      type: String,
      required: false,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

mongooseUserSchema.post('save', handleMongooseError);
const User = model('user', mongooseUserSchema);

const registerSchema = Joi.object({
  name: Joi.string().required(),
  password: Joi.string().min(6).required(),
  email: Joi.string().pattern(emailRageXP).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().pattern(emailRageXP).required(),
  password: Joi.string().min(6).required(),
});

const updateSubscriptionSchema = Joi.object({
  subscription: Joi.string().valid('starter', 'pro', 'business').required(),
});

const joiSchemas = {
  registerSchema,
  loginSchema,
  updateSubscriptionSchema,
};

module.exports = { User, joiSchemas };
