const listContacts = require('./listContacts');
const getContactById = require('./getContactById');
const addContact = require('./addContact');
const changeContact = require('./changeContact');
const updateStatusContact = require('./updateStatusContact');
const removeContact = require('./removeContact');
const { tryCatchWrapper } = require('../../helpers');

module.exports = {
  listContacts: tryCatchWrapper(listContacts),
  getContactById: tryCatchWrapper(getContactById),
  addContact: tryCatchWrapper(addContact),
  changeContact: tryCatchWrapper(changeContact),
  updateStatusContact: tryCatchWrapper(updateStatusContact),
  removeContact: tryCatchWrapper(removeContact),
};
