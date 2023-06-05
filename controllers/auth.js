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
		throw HttpError(409, "Email in use");
	}
	// /Якщо треба відправити на фронтенд унікальне повідомлення при помилці 409

	const hashPassword = await bcrypt.hash(password, 10);

	const newUser = await User.create({ ...req.body, password: hashPassword });
	res.status(201).json({
		user: { email: newUser.email, subscription: newUser.subscription },
	});
};

const login = async (req, res) => {
	const { email, password } = req.body;

	// Спочатку перевіряємо чи є такий юзер:
	const user = await User.findOne({ email });
	if (!user) {
		throw HttpError(401, "Email or password is wrong");
	}

	// Якщо юзер є, то перевіряємо його пароль:
	const passCompare = await bcrypt.compare(password, user.password);
	if (!passCompare) {
		throw HttpError(401, "Email or password is wrong");
	}

	// Якщо user знайдений і пароль збігається, то створюємо токен (пропуск) і відправляємо його на фронтенд. Далі фронтенд в кожний запит додає цей токен.
	// Токен (JWT - JSON Web Token) складається із: заголовків (Headers), даних користувача (зазвичай лише id) (payload) і секретного ключа (рядок, що використовується для шифрування).
	const payload = { id: user._id };
	const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "47h" });

	// Записуємо токен у базу для його видалення при розлогіні
	await User.findByIdAndUpdate(user._id, { token });

	// Передаємо токен у відповідь:
	res.json({
		token,
		user: {
			email: user.email,
			subscription: user.subscription,
		},
	});
};

const getCurrent = async (req, res) => {
	const { name, email } = req.user;
	res.json({ name, email }); // повертаємо на фронтенд
};

const logout = async (req, res) => {
	const { _id } = req.user;
	await User.findByIdAndUpdate(_id, { token: "" });

	res.json({ message: "Logout success" }); // повертаємо на фронтенд
};

module.exports = {
	register: ctrlWrapper(register),
	login: ctrlWrapper(login),
	getCurrent: ctrlWrapper(getCurrent), // не обов'язково загортати у ctrlWrapper, просто для універсальності
	logout: ctrlWrapper(logout),
};
