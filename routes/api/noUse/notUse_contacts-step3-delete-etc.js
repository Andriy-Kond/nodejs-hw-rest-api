const express = require('express');
const router = express.Router();
const contacts = require('../../models/notUse_withoutSchemas');
const HttpError = require('../../helpers');

const Joi = require('joi');
const addSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
});

router.get('/', async (req, res, next) => {
  try {
    const result = await contacts.listContacts();
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get('/:contactId', async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await contacts.getContactById(contactId);

    // Опрацювання помилки з окремою helper-функцією:
    if (!result) {
      throw HttpError(404, 'Not Found');
    }

    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { error } = addSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const result = await contacts.addContact(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

router.put('/:contactId', async (req, res, next) => {
  try {
    // Валідація на відповідність схемі
    const { error } = addSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }

    const { contactId } = req.params;
    const result = await contacts.changeContact(contactId, req.body);
    // Якщо результат null (від функції changeContact()), то повертаємо помилку:
    if (!result) {
      throw HttpError(404, 'Not Found');
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.delete('/:contactId', async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await contacts.removeContact(contactId);
    if (!result) {
      throw HttpError(404, 'Not Found');
    }

    // Якщо операцію успішна, то можна повернути об'єкт:
    res.json(result);

    // або повідомлення:
    // res.json({ message: "Delete success" });

    // Іноді під час видалення треба відправити 204-й статус:
    // res.status(204).json(result);
    // З ним є нюанс: статус приходить як 204й, а тіло відповіді - не приходить зовсім. Бо 204й статус означає "no content". Тому тіло відповіді немає сенсу писати, його все одно не відправлять.
    // Коли статус не 204, то треба передати і статус і тіло.
  } catch (error) {
    next(error);
  }
});

module.exports = router;
