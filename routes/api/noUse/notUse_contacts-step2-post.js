const express = require('express');
const contacts = require('../../models/notUse_withoutSchemas');
const router = express.Router();
const HttpError = require('../../helpers');

const Joi = require('joi'); // імпорт бібліотеки для перевірки body запиту
// Створюємо joi-схему (опис вимог) Якщо передаємо об'єкт, то опис вимог до об'єкту
// викликаємо об'єкт, якщо працюємо з об'єктом
const addSchema = Joi.object({
  // схоже на prop-types
  name: Joi.string().required(), // name - це рядок і він обов'язковий
  email: Joi.string().required(), // email - це рядок і він обов'язковий,
  phone: Joi.string().required(), // phone - це рядок і він обов'язковий,
});

router.get('/', async (req, res, next) => {
  try {
    const result = await contacts.listContacts();
    res.json(result); // повертаю масив через res.json
  } catch (error) {
    next(error);
  }
});

router.get('/:contactId', async (req, res, next) => {
  try {
    // console.log(req.params); // у req.params зберігаються параметри запиту. В цьому випадку: {contactId: "значення id"}. contactId - це те, що написано у лапках після get: "/:contactId"
    const { contactId } = req.params;
    const result = await contacts.getContactById(contactId);

    // ~ Опрацювання помилки з окремою helper-функцією:
    if (!result) {
      throw HttpError(404, 'Not Found');
    }

    // Якщо результат є, то відправляємо його:
    res.json(result);
  } catch (error) {
    // Щоби не повторювати скрізь try...catch можна використати next():
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    // console.log(req.body); // у req.body зберігається тіло запиту
    // тіло запиту може бути в різних форматах. exrpess майє зрозуміти який це формат і перетворити його на об'єкт.
    // Якщо передається у JSON, то треба вказати доп.middleware у app.js: app.use(express.json());
    // Цей middleware перевіряє кожен запит на наявність тіла. Якщо тіло є, то цей middleware перевіряє в якому воно форматі по заголовку заголовку Content-Type.
    // Якщо Content-Type: application/json, то цей middleware бере переданий рядок (тіло) і перетворює його на об'єкт.

    // const result = await contacts.addContact(req.body);
    // // якщо ми щось успішно додали, то це 201-й статус
    // res.status(201).json(result);

    // Але тіло запиту треба перевіряти, бо воно може бути не повним. Це зручно робити за допомогою бібліотеки joi
    // Перевіряємо за створеною схемою:
    const { error } = addSchema.validate(req.body); // метод validate() перевіряє чи поля об'єкта відповідають вимогам у схемі і повертає великий об'єкт результату, в якому є поле error. Якщо все ок, то error = undefined. Якщо ж є помилка, то у error буде об'єкт помилки з повідомленням де саме.
    // console.log("router.post >> error:", error);

    if (error) {
      throw HttpError(400, error.message);
    }

    const result = await contacts.addContact(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
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
