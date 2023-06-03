const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { User } = require("../models/user.js");
const { HttpError, ctrlWrapper } = require("../helpers");

const { SECRET_KEY } = process.env;

const register = async (req, res) => {
	// Якщо треба відправити на фронтенд унікальне повідомлення при помилці 409
	const { email, password } = req.body;
	const user = await User.findOne({ email }); // Перед тим, як зареєструвати давайте подивимось чи є вже у базі такий email
	if (user) {
		throw HttpError(409, "This email already in use");
	}
	// /Якщо треба відправити на фронтенд унікальне повідомлення при помилці 409

	const hashPassword = await bcrypt.hash(password, 10);

	const newUser = await User.create({ ...req.body, password: hashPassword });
	res.status(201).json({ email: newUser.email, name: newUser.name });
};

const login = async (req, res) => {
	const { email, password } = req.body;

	// Спочатку перевіряємо чи є такий юзер:
	const user = await User.findOne({ email });
	if (!user) {
		throw HttpError(401, "Email or password invalid");
	}

	// Якщо юзер є, то перевіряємо його пароль:
	const passCompare = await bcrypt.compare(password, user.password);
	if (!passCompare) {
		throw HttpError(401, "Email or password invalid");
	}

	// Якщо user знайдений і пароль збігається, то створюємо токен (пропуск) і відправляємо його на фронтенд. Далі фронтенд в кожний запит додає цей токен.
	// Токен (JWT - JSON Web Token) складається із: заголовків (Headers), даних користувача (зазвичай лише id) (payload) і секретного ключа (рядок, що використовується для шифрування).
	const payload = { id: user._id };
	const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "47h" });

	// Передаємо токен у відповідь:
	res.json({ token });
};

module.exports = {
	register: ctrlWrapper(register),
	login: ctrlWrapper(login),
};
