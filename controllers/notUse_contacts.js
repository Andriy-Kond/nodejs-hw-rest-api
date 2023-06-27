// // Було:
// const contacts = require("../models/contacts");
// // Стало:
const { Contact } = require('../models/contact');

const { HttpError, tryCatchWrapper } = require('../helpers');
// Схеми валідації теж виносимо в окремий файл, в якому під кожен об'єкт створюємо свої схеми (schemas/contacts.js)
// const Joi = require("joi");
// const addSchema = Joi.object({
// 	name: Joi.string().required(),
// 	email: Joi.string().required(),
// 	phone: Joi.string().required(),
// });

// & Отримання даних
// // Було
// const listContacts = async (req, res) => {
// 	const result = await contacts.listContacts();
// 	res.json(result);
// };
// // Стало:
const listContacts = async (req, res) => {
  // При роботі з БД використовуємо її методи.
  // Тобто там, де ми вертались до .json тепер ми використовуємо методи моделі.
  const result = await Contact.find();
  // метод find() - знайти і повернути всі об'єкти в колекції
  // Завжди повертає масив
  // У find() можна передавати критерії пошуку: Contact.find({ email: "nulla.ante@vestibul.co.uk" });
  // Шукає повний збіг: email: "nulla" - нічого не знайде
  // Можна повертати не всі поля, а лише деякі. Для цього другим аргументом передається рядок, в якій перелічуються необхідні поля через пробіл (перший арг. обов'язковий, навіть, якщо він пустий):
  // Contact.find({}, "name email");
  // Через дефіс можна визначити поля які не треба повертати: Contact.find({}, "-phone -createdAt -updatedAt");

  res.json(result);
};

// & Пошук по ID
// // Було:
// const getContactById = async (req, res) => {
// 	const { contactId } = req.params;
// 	const result = await contacts.getContactById(contactId);

// 	if (!result) {
// 		throw HttpError(404, "Not Found");
// 	}

// 	res.json(result);
// };
// // Стало:
// Є два методи.
// // 1) Більш універсальний findOne()
// // Знаходить перший збіг і повертає цей об'єкт. Якщо не знаходить, то повертає null
const getContactById = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findOne({ _id: contactId });
  if (!result) {
    throw HttpError(404, 'Not Found');
  }
  res.json(result);
};

// 2) Метод findById()
// const getContactById = async (req, res) => {
// 	const { contactId } = req.params;
// 	console.log("req.params :>> ", req.params);
// 	const result = await Contact.findById(contactId);
// 	if (!result) {
// 		throw HttpError(404, "Not Found");
// 	}
// 	res.json(result);
// };
// Тому зазвичай метод findOne() використовується для пошуку всього, крім id, а findById() - для пошуку по id

// Mongoose повертає дибільну помилку, якщо id невірного формату. Тому треба писати окремий middleware (isValuedId), щоби помилка була 404, а не 500, як ми зробили за замовчуванням

// ~ Отримання даних з конспекту:
// find([query], [options]);
// Встановлює операцію пошуку, яка повертає масив об'єктів типу Document, які збігаються із запитом
// findOne([query], [options]);
// Встановлює операцію пошуку одного документа, що повертає перший об'єкт Document, який збігається із запитом

// & Додавання даних
// // Було:
// const addContact = async (req, res) => {
// 	const result = await contacts.addContact(req.body);
// 	res.status(201).json(result);
// };
// // Стало:
const addContact = async (req, res) => {
  const result = await Contact.create(req.body); // Для додавання об'єкту викликаємо метод create() і пердаємо йому цей об'єкт
  res.status(201).json(result);
  // Ящо сталася помилка, то вона буде без статусу, бо mongoose кидає її без статусу
};

// & Зміна даних (всі поля)
// // Було:
// const changeContact = async (req, res) => {
// 	const { contactId } = req.params;
// 	const result = await contacts.changeContact(contactId, req.body);

// 	if (!result) {
// 		throw HttpError(404, "Not Found");
// 	}
// 	res.json(result);
// };
// // Стало:
const changeContact = async (req, res) => {
  const { contactId } = req.params;
  // Метод findByIdAndUpdate() за замовчуванням повертає стару версію об'єкту, а не нову
  // const result = await Contact.findByIdAndUpdate(contactId, req.body);
  // Якщо треба повернути нову версію об'єкту, то треба третім аргументом передати об'єкт {new: true}:
  const result = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });
  if (!result) {
    throw HttpError(404, 'Not Found');
  }
  res.json(result);
};

// & Зміна даних (одне поле)
// updateFavorite буде точно таким, як і changeContact, бо метод findByIdAndUpdate насправді оновлює лише ті поля, які йому передали і по ним робить валідацію. Навіть якщо в інших полях стоїть required.
const updateStatusContact = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true, // за замовчуванням цей метод повертає стару версію документу. Щоби він повернув нову версію треба вказати new: true
  });

  if (!result) {
    throw HttpError(404, 'Not Found');
  }
  res.json(result);
};

// ~ Зміна даних з конспекту:
// update([query], [update], [options]);
// Встановлює операцію поновлення, в ході якої в колекції оновлюються всі документи, що збігаються із запитом.
// findOneAndUpdate([query], [update], [options]);
// Встановлює операцію пошуку та оновлення, під час якої в колекції оновлюється перший же документ, що збігається із запитом.

// & Видалення даних
// // Було:
// const removeContact = async (req, res) => {
// 	const { contactId } = req.params;
// 	const result = await contacts.removeContact(contactId);
// 	if (!result) {
// 		throw HttpError(404, "Not Found");
// 	}

// 	res.json({ message: "Contact deleted" });
// };
// // Стало:
// Для видалення використовуються або findByIdAndDelete(), або findByIdAndUpdate(). Працюють однаково, результат однаковий, просто під капотом різні методи.
// Повертають об'єкт, який видалив. Якщо такого об'єкту у базі немає, то повертає null
const removeContact = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findByIdAndDelete(contactId);
  // const result = await Contact.findByIdAndUpdate(contactId);
  if (!result) {
    throw HttpError(404, 'Not Found');
  }

  res.json({ message: 'Contact deleted' });
};

// ~ Видалення даних з конспекту:
// remove([query], [options]);
// Встановлює операцію видалення, під час якої з колекції видаляються всі об'єкти, що збігаються із запитом
// findOneAndRemove([query], [options]);
// Встановлює операцію пошуку та видалення, під час якої з колекції видаляється перший же документ, що збігається із запитом

module.exports = {
  listContacts: tryCatchWrapper(listContacts),
  getContactById: tryCatchWrapper(getContactById),
  addContact: tryCatchWrapper(addContact),
  changeContact: tryCatchWrapper(changeContact),
  updateStatusContact: tryCatchWrapper(updateStatusContact),
  removeContact: tryCatchWrapper(removeContact),
};
