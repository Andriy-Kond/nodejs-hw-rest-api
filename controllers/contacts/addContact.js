const { Contact } = require('../../models/contact');

const addContact = async (req, res) => {
  // * Виносимо повторювану перевірку валідації у функціях addContact та changeContact у middleware
  // // Валідація на відповідність схемі
  // const { error } = addSchema.validate(req.body);
  // if (error) {
  // 	throw HttpError(400, error.message);
  // }

  // // через те, що у authenticate у req ми записали знайденого юзера, то тепер можемо перевіряти його тут, бо req - це той самий об'єкт для усіх запитів.
  // console.log('req.user :>> ', req.user);
  // // name: 'Bogdan 123',
  // // password: '$2b$10$CDNH0eJLst9rS4zhjSez3uSnX7uAeCSw4z4JLCOFW2rsUUti8dqxC',
  // // email: 'bogdan123@mail.com',
  // // subscription: 'starter',
  // // createdAt: 2023-06-05T08:51:50.304Z,
  // // updatedAt: 2023-06-05T08:51:50.304Z

  // Беремо id людини, яка робить запит:
  const { _id: owner } = req.user; // одразу перейменовуємо змінну

  const result = await Contact.create({ ...req.body, owner });
  res.status(201).json(result);
};

module.exports = addContact;
