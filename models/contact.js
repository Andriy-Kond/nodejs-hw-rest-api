const Joi = require('joi');
const { Schema, model } = require('mongoose');

const { handleMongooseError } = require('../helpers');

const mongooseContactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Set name for contact'],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

mongooseContactSchema.post('save', handleMongooseError);
const Contact = model('contact', mongooseContactSchema);

// Joi Schemas
const joiAddSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
  favorite: Joi.boolean(),
});

const updateFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required(),
});

const joiSchemas = {
  joiAddSchema,
  updateFavoriteSchema,
};

module.exports = { Contact, joiSchemas };
