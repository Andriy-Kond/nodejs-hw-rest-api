require('dotenv').config();

const app = require('./app');
// * Mongodb
// Login: Andriy-User
// Password: knxnEFLO6qBZbGQE
const mongoose = require('mongoose');
// const DB_HOST =
// 	"mongodb+srv://Andriy-User:knxnEFLO6qBZbGQE@cluster0.9p0p26j.mongodb.net/db-contacts?retryWrites=true&w=majority";
// const { DB_HOST } = require("./config");
// const { DB_HOST } = process.env;
const { DB_HOST, PORT = 3000 } = process.env; // порт може бути від 1000 до 9999

// process.env - це глобальний об'єкт зі змінними оточення поточного пристрою (серверу/комп'ютеру).
// console.log("process.env :>> ", process.env);
// Тому ми залишимо ключ DB_HOST з необхідним значенням на сервері, а тут вкажемо, що звертатись треба до змінної оточення замість звертання до файлу config.js
// На render.com це вкладка Environment, на Heroku - це Config parts
// Тоді ми не будемо зберігати секретні дані на Github
// Але тепер локально ми не можемо підключитись, бо немає локально такого ключа як DB_HOST.
// Тому:
// 1. Встановлюємо пакет npm i dotenv
// 2. Замість config.js створюємо файл .env. Це простий текстовий файл з секретними даними. Тому одразу додаємо його у gitignore. Плюс .env.local (хоча це більше стосується фрронтенду)
// 3. Записуємо у .env змінну і значення через дорівнює без лапок і пробілів: DB_HOST=mongodb+srv://Andriy-User:knxnEFLO6qBZbGQE@cluster0.9p0p26j.mongodb.net/db-contacts?retryWrites=true&w=majority Якщо тре нову змінну оточення, то пишемо її з нового рядку. Наприклад, PORT=3000 А config.js можна тепер видалити.
// 4. Додаємо дані з файлу .env у process.env у app.js (через dotenv)
// 5. Через те, що .env прописаний у gitignore, то девопс не буде знати навіть назв змінних оточення. Тому для нього треба зробити окремий файл з назвою .env.example (або як домовитесь з девопсом)). Значення до цих назв девопс потім підставить.

// COMMENT=У значенні змінних .env не має бути знаку hash-tag, інакше після цього знаку все подальші символи не запишуться у змінну
// SECRET_KEY=4xA-t2xB#y:NS<*$jEGM!q{&LdenI?

mongoose.set('strictQuery', true); // З сьомої версії Mangoose воно false за замовчуванням.

// // Передаємо ключ у імпортований об'єкт sgMail
// sgMail.setApiKey(SENDGRID_REST_API_KEY);
// // Після цього об'єкт sgMail готовий відправляти email.
// // Але перед тим як відправляти його треба створити:
// const email = {
//   to: 'molobe5202@ratedane.com', // Кому ми відправляємо пошту
//   from: 'bogdan@mail.com', // Від кого
//   subject: 'Test email', // Тема листа
//   html: '<p><strong>Test email</strong> from localhost:3000!!! </p>', // Зміст листа
// };
// // Більшість css-правил поштові клієнти не підтримують. Тому тре використовувати шаблонізатори по типу npm i ejs
// Щоби відправити email потрібно викликати метод send():
// sgMail.send;

mongoose
  .connect(DB_HOST) // повертає проміс
  // .then(() => app.listen(3000)) // PORT вже прописаний у process.env
  .then(() => app.listen(PORT))
  .catch(error => {
    console.error(error.message);
    process.exit(1); // Ця команда закриває запущені процеси. Якщо до того як під'єднатись до бази щось запустили, то воно буде закрито. "1" - означає "закрити з невідомою помилкою"
  });

// app.listen(3000, () => {
// 	console.log("Server running. Use our API on port: 3000");
// });
