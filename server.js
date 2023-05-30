const app = require("./app");

// * Mongodb
// Login: Andriy-User
// Password: knxnEFLO6qBZbGQE
const mongoose = require("mongoose");
// const DB_HOST =
// 	"mongodb+srv://Andriy-User:knxnEFLO6qBZbGQE@cluster0.9p0p26j.mongodb.net/db-contacts?retryWrites=true&w=majority";
// const { DB_HOST } = require("./config");
const { DB_HOST } = process.env;

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

mongoose.set("strictQuery", true); // З сьомої версії Mangoose воно false за замовчуванням.

mongoose
	.connect(DB_HOST) // повертає проміс
	.then(() => app.listen(3000))
	.catch((error) => {
		console.log(error.message);
		process.exit(1); // Ця команда закриває запущені процеси. Якщо до того як під'єднатись до бази щось запустили, то воно буде закрито. "1" - означає "закрити з невідомою помилкою"
	});
// */ Mongodb

// app.listen(3000, () => {
// 	console.log("Server running. Use our API on port: 3000");
// });
