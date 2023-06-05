const express = require("express");
const logger = require("morgan");
const cors = require("cors");
require("dotenv").config(); // має стояти перед contactsRouter, бо інакше у process.env.SECRET_KEY буде undefined до авторизації у /middleWares/authenticate.js
const contactsRouter = require("./routes/api/contacts");

const authRouter = require("./routes/api/auth");

const app = express();
const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));

app.use(cors());

app.use(express.json());

app.use("*/api/users", authRouter);
app.use("/api/contacts", contactsRouter);

app.use((req, res) => {
	res.status(404).json({ message: "Not found" });
});

// При будь-якій помилці від middleware ми потрапимо сюди:
app.use((err, req, res, next) => {
	const { status = 500, message = "Server error" } = err;

	if (status === 400) {
		res.status(status).json(message);
	}
	res.status(status).json({ message });
});

module.exports = app;
