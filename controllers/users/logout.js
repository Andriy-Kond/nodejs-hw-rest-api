const { User } = require('../../models/user');

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: '' });

  // res.json({ message: "Logout success" }); // повертаємо на фронтенд
  res.status(204).json();
};

module.exports = logout;
