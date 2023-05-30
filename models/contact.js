// Створюємо схему і модель mongoose (для mongodb)
const { Schema, model } = require("mongoose");
const { handleMongooseError } = require("../helpers");

// * Перенесена схема валідації Joi
const Joi = require("joi");
const addSchema = Joi.object({
	name: Joi.string().required(),
	email: Joi.string().required(),
	phone: Joi.string().required(),
	favorite: Joi.boolean(),
});

// */ Перенесена схема валідації Joi

// * Додаткова Joi-схема для patch-запиту (зміна одного поля)
const updateFavoriteSchemas = Joi.object({
	favorite: Joi.boolean().required(),
});
// */ Додаткова Joi-схема для patch-запиту (зміна одного поля)

// Схем Joi може бути багато, тому зазвичай їх об'єднують в один об'єкт і вже його експортують:
const schemas = {
	addSchema,
	updateFavoriteSchemas,
};

// 1. Створюємо схему валідації mongoose для об'єкту контакту
// Схоже на propTypes або Joi. Тільки Joi перевіряє тіло запиту - що і в якому форматі нам ПРИХОДИТЬ, а mongoose перевіряє те, що і в якому форматі ми ЗБЕРІГАЄМО у базі. А ці дані можуть бути різного формату.
// наприклад, дані можуть приходити у форматі YYYY-MM-DD, а у базі треба зберігати у форматі DD-MM-YYYY. Тоді дані треба фоматувати:
// const {data} = rqb.body //YYYY-MM-DD
// const formatData = // DD-MM-YYYY

// через ES5:
// const contactSchema = Schema({});
// через ES6:
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
	},
	{
		versionKey: false, // видаляє поле версії, що додавалось за замовчуванням __v 0
		timestamps: true, // додає поля часу додавання запису і зміни:
		// createdAt 2023-05-30T08:47:22.535+00:00
		// updatedAt 2023-05-30T08:47:22.535+00:00
	}
);

// // mongoose кидає помилки без статусу. А якщо статусу немає, то за замовчуванням статус = 500 (app.js - app.use((err, req, res, next)... )
// // А помилка валідації тіла - це помилка 400, а не 500
// // Тому до схеми валідації треба додавати middleware:
// contactSchema.post("save", (error, data, next) => {
// 	// Якщо при спробі збереження сталася помилка, то нехай спрацює цей middleware
// 	// В error буде записано яка саме помилка сталася (яку помилку буде викидати)
// 	// В data
// 	// В next - це функція яка передає обробку даних
// 	console.log("error :>> ", error);
// 	error.status = 400; // додаємо потрібний статус
// 	next();
// });

// Виносимо цю функцію у helpers, бо вона нам знадобиться для кожної схеми:
contactSchema.post("save", handleMongooseError);

// 2. Створюємо модель. Це клас, тому з великої літери.
// Обов'язково писати в лабках в однині. mongoose автоматично переведе її у множину (він "розумний"). Якщо написати у множині, чи переплутати слово, то він створить нову колекцію (з додаванням s в кінці). Тобто mongoose якщо немає такої бази чи колекції, сам її створить і підключиться до неї.
const Contact = model("contact", contactSchema); // тобто це клас, який буде працювати з колекцією "contact"

module.exports = { Contact, schemas };
