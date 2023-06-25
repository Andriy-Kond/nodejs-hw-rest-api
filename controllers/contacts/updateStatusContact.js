const { Contact } = require('../../models/contact');
const { HttpError } = require('../../helpers');

const updateStatusContact = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });
  // console.log("updateStatusContact >> result:", result);

  if (!result) {
    throw HttpError(404, 'Not Found');
  }
  res.json(result);
};
module.exports = updateStatusContact;
