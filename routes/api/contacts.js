const express = require("express");
const router = express.Router();
const ctrl = require("../../controllers/contacts");

const { validateBody, isValidId } = require("../../middleWares");
// const schemas = require("../../schemas/contacts"); // перенесли цю Joi-схему до схеми mongoose
const { schemas } = require("../../models/contact");

router.get("/", ctrl.listContacts);
router.get("/:contactId", isValidId, ctrl.getContactById);
router.post("/", validateBody(schemas.addSchema), ctrl.addContact);
router.put(
	"/:contactId",
	isValidId,
	validateBody(schemas.addSchema),
	ctrl.changeContact
);

// Зміна конкретного поля/полів робиться через patch. Після id (/:contactId) вказується яке саме поле оновлюється
// І тоді addSchema нам вже не підходить, бо ми з фронтенду будемо передавати лише одне поле
router.patch(
	"/:contactId/favorite",
	isValidId,
	validateBody(schemas.updateFavoriteSchemas),
	ctrl.updateStatusContact
);

router.delete("/:contactId", isValidId, ctrl.removeContact);

module.exports = router;
