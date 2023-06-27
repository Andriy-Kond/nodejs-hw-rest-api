// Виносимо try...catch окремо задля запобіганню повторюванню у кожній функції з controllers/contacts
const tryCatchWrapper = ctrl => {
  const func = async (req, res, next) => {
    try {
      await ctrl(req, res, next);
    } catch (error) {
      next(error); // передає помилку в обробник помилок: у app.js, і там у app.use з чотирма параметрами: app.use((err, req, res, next)
    }
  };
  return func;
};

module.exports = tryCatchWrapper;
