const { Contact } = require('../../models/contact');
const { HttpError } = require('../../helpers');

const changeContact = async (req, res) => {
  // * Виносимо повторювану перевірку валідації у функціях addContact та changeContact у middleware
  // // Валідація на відповідність схемі
  // const { error } = addSchema.validate(req.body);
  // if (error) {
  // 	throw HttpError(400, error.message);
  // }

  const { contactId } = req.params;
  const result = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });

  // Якщо результат null (від функції changeContact()), то повертаємо помилку:
  if (!result) {
    throw HttpError(404, 'Not Found');
  }
  res.json(result);
};
module.exports = changeContact;
