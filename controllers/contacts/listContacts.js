const { Contact } = require('../../models/contact');

// Схеми валідації теж виносимо в окремий файл, в якому під кожен об'єкт створюємо свої схеми (schemas/contacts.js)
// const Joi = require("joi");
// const addSchema = Joi.object({
// 	name: Joi.string().required(),
// 	email: Joi.string().required(),
// 	phone: Joi.string().required(),
// });

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

  // Для пагінації. Всі параметри запиту(пошуку, що після "?") містяться у об'єкті req.query:
  const { page = 1, limit = 20, favorite } = req.query;
  // console.log('listContacts >> favorite:', favorite);
  // console.log('listContacts >> req.query:', req.query);

  // Теоретично можна взяти всі книги, потім зробити slice() і т.і. Але правильно робити запит, який одразу поверне те, що потрібно.
  // Це робиться через третій параметр у методі find(). Там можна передати різні налаштування, сортування і т.і. А у mongoose вже є вбудовані методи для пагінації - skip та limit.
  // skip - це скільки пропустити об'єктів з початку бази
  // limit - скільки повернути об'єктів
  const skip = (page - 1) * limit;
  const result = await Contact.find({ owner }, '-createdAt -updatedAt', {
    skip,
    limit,
  }).populate('owner', 'name email');

  // Додаю сортування в залежності від переданого чи не переданого параметра favorite після "?"
  // console.log("listContacts >> result:", result);
  if (favorite) {
    const filteredResult = result.filter(item => {
      // console.log(item.favorite === Boolean(favorite));
      return item.favorite === Boolean(favorite);
    });
    res.json(filteredResult); // повертаю масив через res.json
  } else {
    res.json(result); // повертаю масив через res.json
  }
};

module.exports = listContacts;
