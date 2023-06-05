// middleware аутентифікації
// Має перевіряти:
// 1. чи є в нас перше слово Bearer і друге - токен
// 2. чи токен валідний

const jwt = require("jsonwebtoken");
const { User } = require("../models/user");
const { HttpError } = require("../helpers");
const { SECRET_KEY } = process.env;
// console.log("SECRET_KEY authenticate.js:", SECRET_KEY);
// console.log(" process.env.COMMENT :>> ", process.env.COMMENT);

const authenticate = async (req, res, next) => {
	// Дістаємо значення заголовку Authorization із запиту (всі заголовки у node пишуться з маленької літери)
	const { authorization = "" } = req.headers;
	// значення за замовчуванням "" потрібно для подальшого методу split() - якщо заголовку не буде, то authorization===undefined, а split() від undefined дасть помилку

	// Дістаємо перше і друге значення з цього масиву через деструктуризацію:
	const [bearer, token] = authorization.split(" "); // методом split() визначаємо розділення слів

	// Якщо першого слова немає, то треба передати у next() помилку 401
	if (bearer !== "Bearer") {
		// next на відміну від json перериває функцію
		next(HttpError(401, `Not found key-word "Bearer"`));
	}

	// Якщо перше слово таки Bearer, то далі ми перевіряємо валідність токену (за допомогою бібліотеки jsonwebtoken)
	// Плюс тре перевірити чи шифрували токен секретним ключем
	// Оскільки метод jwt.verify() викидає помилку, а не повертає значення, то ми маємо огорнути його у try...catch
	try {
		// console.log("authenticate >> token:", token);
		// console.log("authenticate >> bearer:", bearer);
		// console.log("SECRET_KEY:", SECRET_KEY); // тут чомусь прилітає undefined
		// console.log("process.env:", process.env.SECRET_KEY);

		// Перевіряємо чи цим ключем шифрувався токен і чи час життя токену не завершився:
		const { id } = jwt.verify(token, SECRET_KEY);
		// Якщо токен валідний, то повертається payload, з якого ми беремо id (controllers/auth - const payload = { id: user._id })
		// Якщо токен не валідний, то verify() поверне помилку і ми потрапимо у catch

		// Але крім цього треба ще перевірити чи є ще людина з таким пропуском (токеном) у базі, бо може її вже видалили. Для цього нам треба її id
		const user = await User.findById(id);
		if (!user) {
			next(HttpError(401, "This user is no longer in the database"));
		}

		// До об'єкту req додаємо ключ user, який дорівнює користувачу, якого ми знайшли
		req.user = user;
		// Об'єкт req один на весь запит. Тобто у middleware-ах authenticate.js та validateBody.js і у функціях controllers/contacts.js (listContacts, etc.) це один і той самий об'єкт.
		// Тобто req.user буде скрізь той самий.

		// Якщо ж все добре, то просто йдемо далі:
		next();
	} catch (error) {
		console.log("authenticate >> error:", error);
		next(
			HttpError(
				401,
				"Token not valid, or it time is up, or it was encrypted with a different pass-key"
			)
		);
	}
};

module.exports = authenticate;

// COMMENT=У значенні змінних .env не має бути знаку hash-tag, інакше після цього знаку все подальші символи не запишуться у змінну
// SECRET_KEY=4xA-t2xB#y:NS<*$jEGM!q{&LdenI?

// Є пакет passport-jwt. Він робить те саме, але коду там менше на 5 рядків. Складний для розуміння.
