const register = require('./register');
const login = require('./login');
const getCurrent = require('./getCurrent');
const logout = require('./logout');
const updateSubscriptionUser = require('./updateSubscriptionUser');
const updateAvatar = require('./updateAvatar');
const { tryCatchWrapper } = require('../../helpers');
const verifyEmail = require('./verifyEmail');
const resendVerifyEmail = require('./resendVerifyEmail');

module.exports = {
  register: tryCatchWrapper(register),
  verifyEmail: tryCatchWrapper(verifyEmail),
  login: tryCatchWrapper(login),
  getCurrent: tryCatchWrapper(getCurrent), // не обов'язково загортати у tryCatchWrapper, просто для універсальності
  logout: tryCatchWrapper(logout),
  updateSubscriptionUser: tryCatchWrapper(updateSubscriptionUser),
  updateAvatar: tryCatchWrapper(updateAvatar),
  resendVerifyEmail: tryCatchWrapper(resendVerifyEmail),
};
