const validateBody = require('./validateBody');
const isValidId = require('./isValidId');
const authenticate = require('./authentication');
const isValidUserId = require('./isValidUserId');
const upload = require('./upload');
const validateEmailBody = require('./validateEmailBody');

module.exports = {
  validateBody,
  isValidId,
  authenticate,
  isValidUserId,
  upload,
  validateEmailBody,
};
