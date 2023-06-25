// * Підключаємо схему Joi (обробка вхідної інформації з фронтенду)
const Joi = require('joi');

// ^ Створюємо схему і модель mongoose (для mongodb) - перевірка інформації при записі у БД
const { Schema, model } = require('mongoose');
const { handleMongooseError } = require('../helpers');

// 1. Створюємо схему валідації mongoose для об'єкту контакту
// Схоже на propTypes або Joi. Тільки Joi перевіряє тіло запиту - що і в якому форматі нам ПРИХОДИТЬ, а mongoose перевіряє те, що і в якому форматі ми ЗБЕРІГАЄМО у базі. А ці дані можуть бути різного формату.
// Наприклад, дані можуть приходити у форматі YYYY-MM-DD, а у базі треба зберігати у форматі DD-MM-YYYY. Тоді дані треба фоматувати:
// const {data} = rqb.body //YYYY-MM-DD
// const formatData = // DD-MM-YYYY

// Для додаткових прикладів схем валідації:
// const genresList = ['fantastic', 'adventure', 'love'];
// const dateRegexp = /^\d{2}-\d{2}-\d{4}$/;

// через ES5:
// const contactSchema = Schema({});
// через ES6:
// const contactSchema = new Schema({});
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
    // Для ідентифікації хто саме додав контакт маємо записати id власника
    owner: {
      type: Schema.Types.ObjectId, // специфічний тип даних mongoose для позначення id власника. Тобто тут зберігається id, який генерує mongodb
      ref: 'user', // а тут пишуть назву колекції, з якої цей id
      required: true,
    },

    // genre: {
    //   type: String,
    //   // enum: ["fantastic", "adventure", "love"], // Якщо має бути певний перелік значень.
    //   // Цей масив можна винести в окрему змінну:
    //   enum: genresList,
    //   required: true,
    // },
    // date: {
    //   type: String,
    //   // Якщо треба передати рядок у певному форматі (наприклад, 16-10-2022), то використовується ключ match в який передаємо регулярний вираз
    //   // match: /^\d{2}-\d{2}-\d{4}$/, // 2 цифри, дефіс, 2 цифри, дефіс, 4 цифри
    //   // Переносимо регулярний вираз в окрему змінну:
    //   match: dateRegexp, // 2 цифри, дефіс, 2 цифри, дефіс, 4 цифри
    //   required: true,
    // },
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
mongooseContactSchema.post('save', handleMongooseError);

// 2. Створюємо модель. Це клас, тому з великої літери.
// Обов'язково писати в лабках в однині. mongoose автоматично переведе її у множину (він "розумний"). Якщо написати у множині, чи переплутати слово, то він створить нову колекцію (з додаванням s в кінці). Тобто mongoose якщо немає такої бази чи колекції, сам її створить і підключиться до неї.
const Contact = model('contact', mongooseContactSchema); // тобто це клас, який буде працювати з колекцією "contact"
// Перший параметр - назва моделі, другий - сама схема.
// Далі можна створювати об'єкти для цієї моделі:
// const contact = new Conctact({
//   name: 'Andriy',
//   email: andriy@mail.com,
// ...
// });

// * Перенесена схема валідації Joi
const joiAddSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
  favorite: Joi.boolean(),

  // genre: Joi.string()
  // 	.required()
  // 	.validate(...genresList),

  // genre: Joi.string()
  //   .valid(...genresList)
  //   .required(),
  // // .validate(...genresList).required() - видає помилку, а так працює: .required().validate(...genresList)
  // date: Joi.string().pattern(dateRegexp).required(),
});

// * Додаткова Joi-схема для patch-запиту (зміна одного поля)
const updateFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required(),
});

// Схем Joi може бути багато, тому зазвичай їх об'єднують в один об'єкт і вже його експортують:
const joiSchemas = {
  joiAddSchema,
  updateFavoriteSchema,
};

module.exports = { Contact, joiSchemas };
