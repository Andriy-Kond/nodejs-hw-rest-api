const express = require('express');
const router = express.Router();

const ctrl = require('../../controllers/contacts');

const { validateBody, isValidId, authenticate } = require('../../middleWares');
const { joiSchemas } = require('../../models/contact');

router.get('/', authenticate, ctrl.listContacts);

router.get('/:contactId', authenticate, isValidId, ctrl.getContactById);

router.post(
  '/',
  authenticate,
  validateBody(joiSchemas.addSchema),
  ctrl.addContact
);

router.put(
  '/:contactId',
  authenticate,
  isValidId,
  validateBody(joiSchemas.addSchema),
  ctrl.changeContact
);

router.patch(
  '/:contactId/favorite',
  authenticate,
  isValidId,
  validateBody(joiSchemas.updateFavoriteSchema),
  ctrl.updateStatusContact
);

router.delete('/:contactId', authenticate, isValidId, ctrl.removeContact);

module.exports = router;
