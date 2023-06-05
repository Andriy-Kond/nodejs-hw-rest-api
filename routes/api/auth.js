// Маршрути для авторизації і реєстрації

const express = require("express");
const ctrl = require("../../controllers/auth");
const {
	validateBody,
	authenticate,
	isValidUserId,
} = require("../../middleWares");
const { schemas } = require("../../models/user");

const router = express.Router();

// signup
router.post("/register", validateBody(schemas.registerSchema), ctrl.register);

// signin
router.post("/login", validateBody(schemas.loginSchema), ctrl.login);

router.get("/current", authenticate, ctrl.getCurrent);

// logout - видалення токену
router.post("/logout", authenticate, ctrl.logout);

router.patch(
	"/:userId/subscription",
	authenticate,
	isValidUserId,
	validateBody(schemas.updateSubscriptionSchema),
	ctrl.updateSubscriptionUser
);

module.exports = router;
