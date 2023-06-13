const express = require('express');
const ctrl = require('../../controllers/users');
const {
  validateBody,
  authenticate,
  isValidUserId,
  upload,
  validateEmailBody,
} = require('../../middleWares');

const { joiSchemas } = require('../../models/user');

const router = express.Router();

// signup
router.post(
  '/register',
  validateBody(joiSchemas.registerSchema),
  ctrl.register
);

router.get('/verify/:verificationToken', ctrl.verifyEmail);

router.post(
  '/verify/',
  validateEmailBody(joiSchemas.verifyEmailSchema),
  ctrl.resendVerifyEmail
);

// signin
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
