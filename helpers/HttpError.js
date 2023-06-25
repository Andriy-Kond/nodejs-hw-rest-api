// http-errors і нова версія - http-errors-enhanced	Робить те саме, що і helpers/HtppError.js, тому сенсу його ставити його

// Додавання стандартних повідомлень
const errorMessageList = {
  400: 'Bad Request',
  401: 'Not authorized',
  403: 'Forbidden',
  404: 'Not found',
  409: 'Conflict',
};

// Функція, що створює і повертає об'єкт починаються з великої літери...
const HttpError = (status, message = errorMessageList[status]) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

module.exports = HttpError;
