const { Contact } = require('../../models/contact');
const { HttpError } = require('../../helpers');

const removeContact = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findByIdAndDelete(contactId);
  if (!result) {
    throw HttpError(404, 'Not Found');
  }

  // Якщо операцію успішна, то можна повернути об'єкт:
  res.json({ message: 'Contact deleted' });
  // або повідомлення:
  // res.json({ message: "Delete success" });

  // Іноді під час видалення треба відправити 204-й статус:
  // res.status(204).json(result);
  // З ним є нюанс: статус приходить як 204й, а тіло відповіді - не приходить зовсім. Бо 204й статус означає "no content". Тому тіло відповіді немає сенсу писати, його все одно не відправлять.
  // Коли статус не 204, то треба передати і статус і тіло.
};
module.exports = removeContact;
