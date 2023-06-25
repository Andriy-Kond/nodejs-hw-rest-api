const { Contact } = require('../../models/contact');
const { HttpError } = require('../../helpers');

// Тут перевірку робити не потрібно, тому що id, який користувач передасть може бути лише зі списку його особистих id. Тобто тих, які він отримує, зробивши запит через функцію listContacts()
const getContactById = async (req, res) => {
  const { contactId } = req.params;
  // console.log("req.params :>> ", req.params);
  const result = await Contact.findById(contactId);

  // Опрацювання помилки з окремою helper-функцією:
  if (!result) {
    throw HttpError(404, 'Not Found');
  }
  console.log('getContactById >> result:', result);
  res.json(result);
};

module.exports = getContactById;
