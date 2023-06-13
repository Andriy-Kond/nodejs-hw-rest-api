const { HttpError } = require('../helpers');

const validateEmailBody = schema => {
  const func = (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      res.status(400).json({ message: 'missing required field email' });
    }
    next();
  };
  return func;
};

module.exports = validateEmailBody;
