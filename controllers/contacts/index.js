const listContacts = require('./listContacts');
const getContactById = require('./getContactById');
const addContact = require('./addContact');
const changeContact = require('./changeContact');
const updateStatusContact = require('./updateStatusContact');
const removeContact = require('./removeContact');
const { ctrlWrapper } = require('../../helpers');

module.exports = {
  listContacts: ctrlWrapper(listContacts),
  getContactById: ctrlWrapper(getContactById),
  addContact: ctrlWrapper(addContact),
  changeContact: ctrlWrapper(changeContact),
  updateStatusContact: ctrlWrapper(updateStatusContact),
  removeContact: ctrlWrapper(removeContact),
};
