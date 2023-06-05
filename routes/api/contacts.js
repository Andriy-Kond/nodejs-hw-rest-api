const express = require("express");
const router = express.Router();

const ctrl = require("../../controllers/contacts");
// Додаю middleware аутентифікації:
const { validateBody, isValidId, authenticate } = require("../../middleWares");
const { schemas } = require("../../models/contact");

// Тепер будь-де можна використати middleware аутентифікації
// було:
// router.get("/", ctrl.listContacts);
// Стало:
router.get("/", authenticate, ctrl.listContacts); // Тепер якщо прийде будь-який запит на /contacts, він буде перевірятись middleware-рой аутентифікації: чи є токен і чи він валідний
// Далі додаємо цю middleware до кожного запиту, який нам тре захистити. В цьому випадку - для усіх

router.get("/:contactId", authenticate, isValidId, ctrl.getContactById);

router.post(
	"/",
	authenticate,
	validateBody(schemas.addSchema),
	ctrl.addContact
);

router.put(
	"/:contactId",
	authenticate,
	isValidId,
	validateBody(schemas.addSchema),
	ctrl.changeContact
);

router.patch(
	"/:contactId/favorite",
	authenticate,
	isValidId,
	validateBody(schemas.updateFavoriteSchema),
	ctrl.updateStatusContact
);

router.delete("/:contactId", authenticate, isValidId, ctrl.removeContact);

module.exports = router;
