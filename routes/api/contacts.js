const express = require('express');
const router = express.Router(); // дозволяє створювати окремий роут для різних шляхів (users, contacts)
// тепер замість app.get() app.use() можна писати router.get(), router.use()

const ctrl = require('../../controllers/contacts');
// Додаю middleware аутентифікації:
const { validateBody, isValidId, authenticate } = require('../../middleWares');
// const schemas = require("../../schemas/contacts"); // перенесли цю Joi-схему до схеми mongoose
const { joiSchemas } = require('../../models/contact');

// Тепер будь-де можна використати middleware аутентифікації
// було:
// router.get("/", ctrl.listContacts);
// Стало:
router.get('/', authenticate, ctrl.listContacts); // Тепер якщо прийде будь-який запит на /contacts, він буде перевірятись middleware-рой аутентифікації: чи є токен і чи він валідний
// Далі додаємо цю middleware до кожного запиту, який нам тре захистити. В цьому випадку - для усіх

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

// Зміна конкретного поля/полів робиться через patch. Після id (/:contactId) вказується яке саме поле оновлюється
// І тоді addSchema нам вже не підходить, бо ми з фронтенду будемо передавати лише одне поле. Тому створюємо нову схему (updateFavoriteSchema).
router.patch(
  '/:contactId/favorite',
  authenticate,
  isValidId,
  validateBody(joiSchemas.updateFavoriteSchema),
  ctrl.updateStatusContact
);

router.delete('/:contactId', authenticate, isValidId, ctrl.removeContact);

module.exports = router;
