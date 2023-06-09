const { Contact } = require('../../models/contact');

const listContacts = async (req, res) => {
  const { _id: owner } = req.user;

  const { page = 1, limit = 20, favorite } = req.query;

  const skip = (page - 1) * limit;
  const result = await Contact.find({ owner }, '-createdAt -updatedAt', {
    skip,
    limit,
  }).populate('owner', 'name email');

  if (favorite) {
    const filteredResult = result.filter(item => {
      return item.favorite === Boolean(favorite);
    });
    res.json(filteredResult);
  } else {
    res.json(result);
  }
};

module.exports = listContacts;