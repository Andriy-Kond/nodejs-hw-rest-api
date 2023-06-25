const { HttpError } = require('../../helpers');
const { User } = require('../../models/user');

const verifyEmail = async (req, res) => {
  // Отримую код з бази
  const { verificationToken } = req.params;

  const user = await User.findOne({ verificationToken });
  // Перевіряю чи є людина з таким кодом у базі
  if (!user) {
    throw HttpError(404, 'User not found');
  }

  // Якщо ж людина є, то оновлюю БД
  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: null,
  });

  // Відправляю повідомлення:
  res.json({ message: 'Verification successful' });
};

module.exports = verifyEmail;
