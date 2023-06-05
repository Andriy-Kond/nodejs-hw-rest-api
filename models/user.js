// Колекція users призначена для маршрутів auth. Зазвичай назви збігаються.
const { Schema, model } = require("mongoose");
const { handleMongooseError } = require("../helpers");
const Joi = require("joi");

// const emailRageXP = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const emailRageXP = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

const userSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: [true, "Set password for user"],
			minlength: 6, // мінімальна довжина - 6 символів
		},
		email: {
			type: String,
			required: [true, "Email is required"],
			unique: true,
			match: emailRageXP, // регулярний вираз для email
		},

		subscription: {
			type: String,
			enum: ["starter", "pro", "business"],
			default: "starter",
		},

		// Для того, щоби видаляти токен для розлогіна
		token: {
			type: String,
			default: "", // не обов'язково
		},
	},
	{
		versionKey: false,
		timestamps: true,
	}
);

// Email має бути унікальним у колекції. Тому тут має бути додаткова валідація
// Якщо провалена валідація по будь-якому полю, то має повертатись помилка 404. А якщо по полю unique (при намаганні додати вже існуючий запис) має повертатись помилка 409.
userSchema.post("save", handleMongooseError);

// Joi-схеми має бути дві - на реєстрацію (email, password) і на авторизацію (login)
const registerSchema = Joi.object({
	name: Joi.string().required(),
	password: Joi.string().min(6).required(),
	// email: Joi.string().email().required(), // валідація email від Joi, але їх регулярний вираз може не відповідати моєму, тому краще зробити через pattern:
	email: Joi.string().pattern(emailRageXP).required(),
});

const loginSchema = Joi.object({
	email: Joi.string().pattern(emailRageXP).required(),
	password: Joi.string().min(6).required(),
});

const updateSubscriptionSchema = Joi.object({
	subscription: Joi.string().valid("starter", "pro", "business").required(),
});

const User = model("user", userSchema);

const schemas = {
	registerSchema,
	loginSchema,

	updateSubscriptionSchema,
};

module.exports = { User, schemas };
