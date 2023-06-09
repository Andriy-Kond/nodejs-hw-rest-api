const { HttpError } = require('../../helpers');
const { User } = require('../../models/user');

const updateSubscriptionUser = async (req, res) => {
  const { userId } = req.params;
  const result = await User.findByIdAndUpdate(userId, req.body, {
    new: true,
  });

  if (!result) {
    throw HttpError(404, 'Not Found');
  }
  res.json(result);
};

module.exports = updateSubscriptionUser;
