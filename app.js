const express = require("express");
const logger = require("morgan"); // виводить в консоль інформацію про запит
const cors = require("cors");

const contactsRouter = require("./routes/api/contacts");

// // Додаю нові змінні у глобальний об'єкт змінних оточення process.env:
// const dotenv = require("dotenv");
// dotenv.config(); // метод config() шукає файл .env і додає його значення до process.env
// Якщо dotenv не потрібна, то можна написати коротше:
require("dotenv").config();

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short"; // виводити у logger (як console.log) повну, або коротку інформацію

app.use(logger(formatsLogger));
app.use(cors()); // якщо треба обмежити доступ, то в пакет cors() можна передати список дозволених адрес
app.use(express.json());

app.use("/api/contacts", contactsRouter);

app.use((req, res) => {
	res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
	const { status = 500, message = "Server error" } = err;
	res.status(status).json({ message });
});

module.exports = app;
