const sgMail = require('@sendgrid/mail');
require('dotenv').config();

const mongoose = require('mongoose');
const app = require('./app');

mongoose.set('strictQuery', true);
const { DB_HOST, PORT = 3000, SENDGRID_REST_API_KEY } = process.env;

// Передаємо ключ у імпортований об'єкт sgMail
sgMail.setApiKey(SENDGRID_REST_API_KEY);
// Після цього об'єкт sgMail готовий відправляти email.
// Але перед тим як відправляти його треба створити:
const email = {
  to: 'molobe5202@ratedane.com', // Кому ми відправляємо пошту
  from: 'bogdan@mail.com', // Від кого
  subject: 'Test email', // Тема листа
  html: '<p><strong>Test email</strong> from localhost:3000!!! </p>', // Зміст листа
};
// Більшість css-правил поштові клієнти не підтримують. Тому тре використовувати шаблонізатори по типу npm i ejs

mongoose
  .connect(DB_HOST)
  .then(() => app.listen(PORT))
  .catch(error => {
    console.error(error.message);
    process.exit(1);
  });

// Щоби відправити email потрібно викликати метод send():

sgMail.send;
