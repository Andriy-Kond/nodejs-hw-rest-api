const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../../models/user.js');
const { HttpError } = require('../../helpers');

const { SECRET_KEY } = process.env;

const login = async (req, res) => {
  const { email, password } = req.body;

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

  const payload = { id: user._id };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '47h' });

  await User.findByIdAndUpdate(user._id, { token });

  res.json({
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
};

module.exports = login;
