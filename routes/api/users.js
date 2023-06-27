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

const router = express.Router(); // дозволяє створювати окремий роут для різних шляхів (users, contacts)
// тепер замість app.get() app.use() можна писати router.get(), router.use()

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
  // у multer є метод single() - завантажити в одному полі один файл.
  upload.single('avatar'), // відбувається завантаження ОДНОГО файлу у теку tmp (зазначена у middleWares/upload.js).
  // // Після цього на req з'являться властивість-об'єкт file (req.file), в якому крім інших є властивість path - шлях до цього файлу (... path: "tmp/file.jpg" ... ):
  // (req, res) => {
  //   console.log('req.file :>> ', req.file);
  //   return res.json({ ok: true });
  // },
  // Таким чином multer парсить payload і завантажує файл. Більше він нічого не знає і не робить.
  ctrl.updateAvatar // в цьому контролері переміщуємо файл у теку /public/avatars
);
// // Запис upload.single("cover") означає: ми очікуємо у полі cover (JSON {cover: ...}) один файл, всі інші поля будуть текстовими і їх тре записати у req.body
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

// // Для завантаження одразу декількох файлів:
// router.patch(
//   '/avatars-multiple',
//   authenticate,
//   upload.array('avatar'),
//   // Тільки після цього у нас буде не req.file, а req.files. Це буде масив об'єктів таких же як раніше був req.file
//   ctrl.updateAvatars // а тут робимо цикл по файлах і переносимо кожний.
// );
