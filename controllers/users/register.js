const bcrypt = require('bcrypt');
const gravatar = require('gravatar'); // робота з тимчасовими аватарками
const { User } = require('../../models/user.js');
const { HttpError } = require('../../helpers');

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, 'Email in use');
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email); // у avatarURL буде посилання на тимчасову аватарку юзера з таким email

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL, // додаємо у базу ще і аватарку
  });
  res.status(201).json({
    user: { email: newUser.email, subscription: newUser.subscription },
  });
};

module.exports = register;
