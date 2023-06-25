const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../../models/user.js');
const { HttpError } = require('../../helpers');

const { SECRET_KEY } = process.env;

const login = async (req, res) => {
  // console.log('login >> req:', req);
  // console.log('login >> res:', res);
  const { email, password } = req.body;

  // Спочатку перевіряємо чи є такий юзер:
  const user = await User.findOne({ email });
  // Чи є така людина у базі?
  if (!user) {
    throw HttpError(401, 'Email or password is wrong');
  }

  // Чи людина підтвердила свй email?
  if (!user.verify) {
    throw HttpError(401, 'Email was not verified. Please verify your email.');
  }

  // Чи збігаються паролі?
  const passCompare = await bcrypt.compare(password, user.password);
  if (!passCompare) {
    throw HttpError(401, 'Email or password is wrong');
  }

  // Якщо user знайдений і пароль збігається, то створюємо токен (пропуск) і відправляємо його на фронтенд. Далі фронтенд в кожний запит додає цей токен.
  // Токен (JWT - JSON Web Token) складається із: заголовків (Headers), даних користувача (payload - зазвичай лише id)  і секретного ключа (рядок, що використовується для шифрування).
  const payload = { id: user._id };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '47h' }); // 1d - 1 день, 1w - один тиждень

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

module.exports = login;
