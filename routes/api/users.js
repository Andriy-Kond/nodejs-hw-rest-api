const express = require('express');
const ctrl = require('../../controllers/users');
const {
  validateBody,
  authenticate,
  isValidUserId,
  upload,
} = require('../../middleWares');

const { joiSchemas } = require('../../models/user');

const router = express.Router();

router.post(
  '/register',
  validateBody(joiSchemas.registerSchema),
  ctrl.register
);
router.post('/login', validateBody(joiSchemas.loginSchema), ctrl.login);

router.get('/current', authenticate, ctrl.getCurrent);
router.post('/logout', authenticate, ctrl.logout);
router.patch(
  '/:userId/subscription',
  authenticate,
  isValidUserId,
  validateBody(joiSchemas.updateSubscriptionSchema),
  ctrl.updateSubscriptionUser
);

router.patch(
  '/avatars',
  authenticate,
  upload.single('avatar'),
  ctrl.updateAvatar
);

module.exports = router;
