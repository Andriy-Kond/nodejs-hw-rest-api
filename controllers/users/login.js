const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../../models/user.js');
const { HttpError } = require('../../helpers');

const { SECRET_KEY } = process.env;

const login = async (req, res) => {
  // console.log('login >> req:', req);
  // console.log('login >> res:', res);

  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, 'Email or password is wrong');
  }

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
