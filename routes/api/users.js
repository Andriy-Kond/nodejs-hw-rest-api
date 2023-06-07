const express = require('express');
const ctrl = require('../../controllers/users');
const {
  validateBody,
  authenticate,
  isValidUserId,
  upload,
} = require('../../middleWares');

const { schemas } = require('../../models/user');

const router = express.Router();

router.post('/register', validateBody(schemas.registerSchema), ctrl.register);
router.post('/login', validateBody(schemas.loginSchema), ctrl.login);
router.get('/current', authenticate, ctrl.getCurrent);
router.post('/logout', authenticate, ctrl.logout);
router.patch(
  '/:userId/subscription',
  authenticate,
  isValidUserId,
  validateBody(schemas.updateSubscriptionSchema),
  ctrl.updateSubscriptionUser
);

// Маршрут для зміни аватарки користувачем
// Змінити аватарку може лише людина, що залогінилась. Тому має бути authenticate
router.patch(
  '/avatars',
  authenticate,
  upload.single('avatar'),
  ctrl.updateAvatar
);

module.exports = router;
