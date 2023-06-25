// Маршрути для авторизації і реєстрації
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
  // Є тіло запиту, тому перевіряємо по схемі joi. Але робимо відповідну нову схему
  validateEmailBody(joiSchemas.verifyEmailSchema),
  ctrl.resendVerifyEmail
);

// signin
router.post('/login', validateBody(joiSchemas.loginSchema), ctrl.login);

router.get('/current', authenticate, ctrl.getCurrent);

// logout - видалення токену
router.post('/logout', authenticate, ctrl.logout);

router.patch(
  '/:userId/subscription',
  authenticate,
  isValidUserId,
  validateBody(joiSchemas.updateSubscriptionSchema),
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
// // Запис upload.single("cover") означає: ми очикуємо у полі cover один файл, всі інші поля будуть текстовими і їх тре записати у req.body
// // Тобто - візьми з поля cover файл, збережи його у теці temp, а текстові поля передай у req.body
// // Якщо ми очікуємо кілька файлів: upload.array("cover", 8) - другий аргумент - максимальна кількість файлів
// // Якщо очікуємо кілька файлів у різних полях: upload.fields([{ name: "cover", maxCount: 1}, { name: "subcover", maxCount: 2}])
// app.post('/api/books', upload.single('cover'), async (req, res) => {
//   console.log('req.body :>> ', req.body);
//   // req.body :>>  [Object: null prototype] { title: 'girl genius', author: 'Gogilo' }
//   console.log('req.file :>> ', req.file);
//   //   req.file :>>  {
//   //   fieldname: 'cover',
//   //   originalname: 'Screenshot_1.jpg',
//   //   encoding: '7bit',
//   //   mimetype: 'image/jpeg',
//   //   destination: 'D:\\Programming\\JS-Node-HW\\Module-05\\file-delivery-multer\\temp',
//   //
//   //   filename: '095c5e971d252c8becfc0128aefdea6b',
//   //   path: 'D:\\Programming\\JS-Node-HW\\Module-05\\file-delivery-multer\\temp\\095c5e971d252c8becfc0128aefdea6b',
//   //
//   //   або, якщо прописати "filename: ..." у multerConfig middleWares/upload.js:
//   //   filename: 'Screenshot_1.jpg',
//   //   path: 'D:\\Programming\\JS-Node-HW\\Module-05\\file-delivery-multer\\temp\\Screenshot_1.jpg',
//   //
//   //   size: 59330
//   // }
// });

module.exports = router;
