const app = require("./app");

// * Mongodb
// Login: Andriy-User
// Password: knxnEFLO6qBZbGQE
const mongoose = require("mongoose");
// const DB_HOST =
// 	"mongodb+srv://Andriy-User:knxnEFLO6qBZbGQE@cluster0.9p0p26j.mongodb.net/db-contacts?retryWrites=true&w=majority";
// const { DB_HOST } = require("./config");
const { DB_HOST } = process.env;

// process.env - це об'єкт зі змінними оточення поточного пристрою (серверу/комп'ютеру).
// console.log("process.env :>> ", process.env);
// Тому ми залишимо ключ DB_HOST з необхідним значенням на сервері, а тут вкажемо, що звертатись треба до змінної оточення замість звертання до файлу config.js

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
