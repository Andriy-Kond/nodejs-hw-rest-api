const { Contact } = require("../models/contact");
const { HttpError, ctrlWrapper } = require("../helpers");

const listContacts = async (req, res) => {
	const { _id: owner } = req.user;
	// const result = await Contact.find({ owner }, "-createdAt -updatedAt");
	// -createdAt -updatedAt - каже, що нам ці поля не потрібні у відповіді. Тобто повернеться об'єкт без цих полів.

	// Іноді повертати id не достатньо. Іноді потрібно передати перелік певної інформації. Для цього можна використати метод populate(). Це особливий інструмент пошуку для поширення запиту.
	// Якщо у populate() написати назву поля, яке треба поширити, то mongoose візьме id, яке зберігається у полі owner у models/contacts.js (type: Schema.Types.ObjectId), потім піде в колекцію, яка записана у ref (ref: "user"). Знайде там об'єкт з таким id і вставить його замість owner

	// const result = await Contact.find(
	// 	{ owner },
	// 	"-createdAt -updatedAt"
	// ).populate("owner");
	// Тобто: візьми поле owner, знайди з якої воно колекції, піди у ту колекцію, знайди об'єкт з таким id і встав його замість поля owner
	// Тоді у відповіді замість цього
	// "owner": "647da226a4640183d0205727"
	// буде оце:
	// "owner": {
	//           "_id": "647da226a4640183d0205727",
	//           "name": "Bogdan 123",
	//           "password": "$2b$10$CDNH0eJLst9rS4zhjSez3uSnX7uAeCSw4z4JLCOFW2rsUUti8dqxC",
	//           "email": "bogdan123@mail.com",
	//           "subscription": "starter",
	//           "createdAt": "2023-06-05T08:51:50.304Z",
	//           "updatedAt": "2023-06-05T08:51:50.304Z"
	//       }

	// Зазвичай всі поля не потрібні, тому можна вказати які саме поля треба повернути (другим аргументом у лапках через пробіл). Через дефіс можна виключити поля, які не потрібні.
	// const result = await Contact.find(
	// 	{ owner },
	// 	"-createdAt -updatedAt"
	// ).populate("owner", "name email -_id");

	// Для пагінації. Всі параметри запиту(пошуку, шо після ?) містяться у об'єкті req.query:
	const { page = 1, limit = 20, favorite } = req.query; // одразу пишемо зі значенням за замовчуванням
	console.log("listContacts >> favorite:", favorite);
	console.log("listContacts >> req.query:", req.query);
	// Теоретично можна взяти всі книги, потім зробити slice() і т.і. Але правильно робити запит, який одразу поверне те, що потрібно.
	// Це робиться через третій параметр у методі find(). Там можна передати різні налаштування, сортування і т.і. А у mongoose вже є вбудовані методи для пагінації - skip та limit.
	// skip - це скільки пропустити об'єктів з початку бази
	// limit - скільки повернути об'єктів
	const skip = (page - 1) * limit;
	const result = await Contact.find({ owner }, "-createdAt -updatedAt", {
		skip,
		limit,
	}).populate("owner", "name email");

	// Додаю сортування в залежності від переданого чи не переданого параметра favorite після "?"
	// console.log("listContacts >> result:", result);
	if (favorite) {
		const newResult = result.filter((item) => {
			// console.log(item.favorite === Boolean(favorite));
			return item.favorite === Boolean(favorite);
		});
		res.json(newResult);
	} else {
		res.json(result);
	}
};

// Тут перевірку робити не потрібно, тому що id, який користувач передасть може бути лише зі списку його особистих id. Тобто тих, які він отримує, зробивши запит через функцію listContacts
const getContactById = async (req, res) => {
	const { contactId } = req.params;
	// console.log("req.params :>> ", req.params);
	const result = await Contact.findById(contactId);
	if (!result) {
		throw HttpError(404, "Not Found");
	}
	res.json(result);
};

const addContact = async (req, res) => {
	// через те, що у authenticate у req ми записали знайденого юзера, то тепер можемо перевіряти його тут, бо req - це той самий об'єкт для усіх запитів.
	console.log("req.user :>> ", req.user);
	// name: 'Bogdan 123',
	// password: '$2b$10$CDNH0eJLst9rS4zhjSez3uSnX7uAeCSw4z4JLCOFW2rsUUti8dqxC',
	// email: 'bogdan123@mail.com',
	// subscription: 'starter',
	// createdAt: 2023-06-05T08:51:50.304Z,
	// updatedAt: 2023-06-05T08:51:50.304Z

	// Беремо id людини, яка робить запит:
	const { _id: owner } = req.user; // одразу перейменовуємо змінну

	const result = await Contact.create({ ...req.body, owner });
	res.status(201).json(result);
};

const changeContact = async (req, res) => {
	const { contactId } = req.params;
	const result = await Contact.findByIdAndUpdate(contactId, req.body, {
		new: true,
	});
	if (!result) {
		throw HttpError(404, "Not Found");
	}
	res.json(result);
};

const updateStatusContact = async (req, res) => {
	const { contactId } = req.params;
	const result = await Contact.findByIdAndUpdate(contactId, req.body, {
		new: true,
	});
	// console.log("updateStatusContact >> result:", result);

	if (!result) {
		throw HttpError(404, "Not Found");
	}
	res.json(result);
};

const removeContact = async (req, res) => {
	const { contactId } = req.params;
	const result = await Contact.findByIdAndDelete(contactId);
	if (!result) {
		throw HttpError(404, "Not Found");
	}
	res.json({ message: "Contact deleted" });
};

module.exports = {
	listContacts: ctrlWrapper(listContacts),
	getContactById: ctrlWrapper(getContactById),
	addContact: ctrlWrapper(addContact),
	changeContact: ctrlWrapper(changeContact),
	updateStatusContact: ctrlWrapper(updateStatusContact),
	removeContact: ctrlWrapper(removeContact),
};
