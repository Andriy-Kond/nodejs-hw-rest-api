const { HttpError } = require('../helpers');

const validateBody = schema => {
  const func = (req, res, next) => {
    const { error } = schema.validate(req.body);
    // console.log("func >> error:", error); // '"name" is required',

    // const errorArr = error.message.split(' ');
    // Якщо сталася помилка, передаємо її у next, який перериває виконання:
    if (error) {
      // next(HttpError(400, `missing fields: ${error.message}`));
      // next(HttpError(400, `missing fields: ${errorArr[0]}`));
      next(HttpError(400, `Помилка від Joi або іншої бібліотеки валідації`));
    }

    // Якщо помилки нема - йдемо далі:
    next();
  };
  return func;
};

module.exports = validateBody;
