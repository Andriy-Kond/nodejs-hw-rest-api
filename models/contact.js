const { Schema, model } = require("mongoose");
const { handleMongooseError } = require("../helpers");
const Joi = require("joi");

const contactSchema = new Schema(
	{
		name: {
			type: String,
			required: [true, "Set name for contact"],
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
		// Для ідентифікації хто саме додав контакт маємо записати id власника
		owner: {
			type: Schema.Types.ObjectId, // специфічний тип даних mongoose для позначення id власника. Тобто тут зберігається id, який генерує mongodb
			ref: "user", // а тут пишуть назву колекції, з якої цей id
			required: true,
		},
	},
	{
		versionKey: false,
		timestamps: true,
	}
);

contactSchema.post("save", handleMongooseError);
const Contact = model("contact", contactSchema);

const addSchema = Joi.object({
	name: Joi.string().required(),
	email: Joi.string().required(),
	phone: Joi.string().required(),
	favorite: Joi.boolean(),
});

const updateFavoriteSchema = Joi.object({
	favorite: Joi.boolean().required(),
});

const schemas = {
	addSchema,
	updateFavoriteSchema,
};

module.exports = { Contact, schemas };
