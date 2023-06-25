// Тут тре написати логи.
// Тобто коли приходить запит за контактом, то тре його або додати у json, або видалити, або замінити. І повернути його.
// Для цього сюди імпортуємо функції з models/withoutSchemas.js

const express = require('express');
const contacts = require('../../models/notUse_withoutSchemas');
const router = express.Router();
const HttpError = require('../../../helpers');

router.get('/', async (req, res, next) => {
  try {
    const result = await contacts.listContacts();
    res.json(result); // повертаю масив через res.json
  } catch (error) {
    // console.log(error.message);
    // res.status(500).json({
    // 	message: "Server error",
    // });
    next(error);
  }
});

router.get('/:contactId', async (req, res, next) => {
  try {
    // console.log(req.params); // у req.params зберігаються параметри запиту. В цьому випадку: {contactId: "значення id"}. contactId - це те, що написано у лапках після get: "/:contactId"
    const { contactId } = req.params;
    const result = await contacts.getContactById(contactId);

    // ~ Якщо не знайшли об'єкт по id, то тре переривати і відправляти помилку 404
    // if (!result) {
    // 	res.status(404).json({
    // 		message: "Not found",
    // 	});
    // }

    // ~ Краще відправляти помилку в одному місці (catch). Тому можна робити так:
    // if (!result) {
    // 	const error = new Error("Not found");
    // 	error.status = 404; // додаємо помилці потрібний статус
    // 	throw error; // прокидаємо помилку у catch
    // }

    // ~ Опрацювання помилки з окремою helper-функцією:
    if (!result) {
      throw HttpError(404, 'Not Found');
    }

    // Якщо результат є, то відправляємо його:
    res.json(result);
  } catch (error) {
    // console.log(error.message);
    // res.status(500).json({
    // 	message: "Server error",
    // });

    // const { status = 500, message = "Server error" } = error; // встановлюємо значення за замовчуванням, якщо немає статусу і месседжу
    // res.status(status).json({
    // 	message,
    // });

    // Щоби не повторювати скрізь try...catch можна використати next():
    next(error);
    // Якщо написати просто next(), то це означає - шукай далі. А якщо передати туди error - next(error), то express почне шукати обробник помилок.
    // Обробник помилок - це функція з 4-ма параметрами. В нас є така у app.js:
    // app.use((err, req, res, next) => {
    // 	...
    // });
    // І тоді у err потрапить помилка з потрібним статусом
  }

  // const result = await contacts.getContactById(req.id); // ??
  // res.json(result);
});

router.post('/', async (req, res) => {
  const result = await contacts.addContact(req.contactBody); // ??
  res.json(result);
});

router.delete('/:contactId', async (req, res) => {
  const result = await contacts.removeContact(req.id); // ??
  res.json(result);
});

router.put('/:contactId', async (req, res) => {
  const result = await contacts.changeContact(req.id, req.contactBody); // ??
  res.json(result);
});

module.exports = router;
