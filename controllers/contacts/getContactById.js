const { Contact } = require('../../models/contact');
const { HttpError } = require('../../helpers');

const getContactById = async (req, res) => {
  const { contactId } = req.params;

  const result = await Contact.findById(contactId);
  if (!result) {
    throw HttpError(404, 'Not Found');
  }
  console.log('getContactById >> result:', result);
  res.json(result);
};

module.exports = getContactById;
