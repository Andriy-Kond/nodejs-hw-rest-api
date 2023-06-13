const bcrypt = require('bcryptjs');
const gravatar = require('gravatar');
const { User } = require('../../models/user.js');
const { HttpError, sendEmail } = require('../../helpers');
// При реєстрації треба створити код верифікації і записати його у базі
const { nanoid } = require('nanoid');

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, 'Email already in use. Choose other email.');
  }

  const { BASE_URL } = process.env;
  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);
  const verificationToken = nanoid(); // створюємо код верифікації

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
    verificationToken,
  });

  // Створюємо email для людини на підтвердження її зареєстрованого email-у
  const verifyEmail = {
    to: email,
    subject: 'Verify your email',
    html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${verificationToken}">Click here to verify your email</a>`,
  };

  await sendEmail(verifyEmail);

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
      verificationToken,
    },
  });
};

module.exports = register;
