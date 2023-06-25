// // Додаю нові змінні у глобальний об'єкт змінних оточення process.env:
// const dotenv = require("dotenv");
// dotenv.config(); // метод config() шукає файл .env і додає його значення до process.env
// Якщо змінна dotenv не потрібна, то можна написати коротше:
require('dotenv').config(); // має стояти перед contactsRouter, бо інакше у process.env.SECRET_KEY буде undefined до авторизації у /middleWares/authenticate.js

const express = require('express');
const logger = require('morgan'); // виводить у консоль інфу про запит (потрібно щоб дебажити код)
const cors = require('cors'); // для одночасного запуску фронтенду і бекенду на одному ПК

const contactsRouter = require('./routes/api/contacts'); // роутер для contacts

const authRouter = require('./routes/api/users');

const app = express(); // app - це наш web-server, що буде генерувати запити
const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'; // виводити у logger (як console.log) повну, або коротку інформацію

app.use(logger(formatsLogger));
app.use(cors()); // якщо треба обмежити доступ, то в пакет cors() можна передати список дозволених адрес
app.use(express.json());
app.use(express.static('public')); // Якщо прийде запит на статичний файл, то треба його шукати лише у теці "public"

app.use('*/api/users', authRouter);
app.use('/api/contacts', contactsRouter); // всі запити, що починаються з /api/books тре шукати у contactsRouter

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

// app.use((err, req, res, next) => {
// 	res.status(500).json({ message: err.message });
// });

// При будь-якій помилці від middleware ми потрапимо сюди:
// Обробка помилок (сюди її передає next(error) з ctrlWrapper)
// Для використання з різними помилками даємо значення за замовчуванням:
app.use((err, req, res, next) => {
  // mongoose кидає помилки без статусу. А якщо статусу немає, то за замовчуванням статус = 500
  // А помилка валідації тіла - це помилка 400, а не 500
  // Тому до схеми валідації треба додавати middleware
  const { status = 500, message = 'Server error' } = err;

  if (status === 400) {
    res.status(status).json(message);
  }
  res.status(status).json({ message });
});

module.exports = app;
