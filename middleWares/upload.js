const multer = require('multer');
const path = require('path');
const tempDir = path.join(__dirname, '../', 'tmp');

// Об'єкт налаштувань
const multerConfig = multer.diskStorage({
  // шлях до теки, в якій будемо зберігати тимчасовий файл
  // Можна і просто написати "./", але краще через path, бо різні є системи
  destination: tempDir,

  // налаштування - filename. Туди передаємо функцію, яка зберігає файл під іншим ім'ям
  // У функцію передається об'єкт request, об'єкт файл і колбек. file - це файл у пам'яті.
  // Тобто callback filename спрацьовує коли multer отримав file, зберіг його у пам'яті, але ще не зберіг його на диску
  filename: (req, file, cb) => {
    // Перший параметр null, якщо немає ніяких помилок. Другим параметром - ім'я файлу
    cb(null, file.originalname); // файл зберігається під оригінальним ім'ям. Тобто в цьому випадку запис filename ніби не потрібен. Але без нього файл зберігається під випадковим ім'ям без розширення, хоча його дані правильні.
  },
  // Налаштування limit дозволяє зробити певні обмеження
  // limit :
});

// Створення middleware для зберігання
const upload = multer({
  storage: multerConfig,
});

module.exports = upload;
