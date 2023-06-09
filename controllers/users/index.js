const register = require('./register');
const login = require('./login');
const getCurrent = require('./getCurrent');
const logout = require('./logout');
const updateSubscriptionUser = require('./updateSubscriptionUser');
const updateAvatar = require('./updateAvatar');
const { ctrlWrapper } = require('../../helpers');

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  updateSubscriptionUser: ctrlWrapper(updateSubscriptionUser),
  updateAvatar: ctrlWrapper(updateAvatar),
};
