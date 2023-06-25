const getCurrent = async (req, res) => {
  const { email, subscription } = req.user;
  res.json({ email, subscription }); // повертаємо на фронтенд
};

module.exports = getCurrent;
