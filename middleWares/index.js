const validateBody = require('./validateBody');
const isValidId = require('./isValidId');
const authenticate = require('./authentication');
const isValidUserId = require('./isValidUserId');
const upload = require('./upload');

module.exports = {
  validateBody,
  isValidId,
  authenticate,
  isValidUserId,
  upload,
};
