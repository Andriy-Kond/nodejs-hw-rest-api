const { HttpError } = require('../../helpers');
const { User } = require('../../models/user');

const verifyEmail = async (req, res) => {
  // Отримуємо код з бази
  const { verificationToken } = req.params;
  // Перевіряємо чи є людина з таким кодом у базі
  const user = await User.findOne({ verificationToken });

  if (!user) {
    throw HttpError(404, 'User not found');
  }

  // Якщо ж людина є, то оновлюємо БД
  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: null,
  });

  // Відправляємо повідомлення:
  res.json({ message: 'Verification successful' });
};

module.exports = verifyEmail;
