const path = require('path');
const fs = require('fs/promises');

const avatarDir = path.join(__dirname, '../', '../', 'public', 'avatars');
const Jimp = require('jimp');

const { User } = require('../../models/user');

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  // Щоби перемістити файл у fs використовується метод rename()
  // Перший аргумент - старий шлях з ім'ям. Другий - новий шлях з ім'ям
  // await fs.rename('./temp/Screenshot_1.jpg', './public/books/Screenshot_1.jpg');

  // Старий шлях записаний у req.file.path. Ім'я файлу - у req.file.originalname
  const { path: tempUpload, originalname } = req.file;

  const filename = `${_id}_${originalname}`; // створюємо нове унікальне ім'я, щоби однакові імена файлів від різних юзерів не перезаписували їхні файли, бо всі вони будуть лежати в одній теці

  // Створюємо новий шлях - до шляху до теки books (booksDir) додаємо ім'я файлу
  const resultUpload = path.join(avatarDir, filename); // абсолютний шлях на сервер

  await fs.rename(tempUpload, resultUpload); // переміщуємо з tempUpload до resultUpload

  // Обробляємо поля з фронтенду - додаємо унікальний id і відносний шлях (відносно адреси сайту), де лежить доданий файл
  // const newFilePath = path.join('public', 'books', originalname);
  // записуємо цей шлях у базу
  const avatarURL = path.join('avatars', filename); // "public" видаляємо, бо він тепер зазначений у middleware app.use(express.static('public'));

  await User.findByIdAndUpdate(_id, { avatarURL });

  // const avatarAbsolutePath = path.join(__dirname, '../', 'public', 'avatars');
  // open a file
  Jimp.read(`${avatarDir}/${filename}`, (err, fileAvatar) => {
    if (err) throw err;
    // console.log('Jimp.read >> fileAvatar:', fileAvatar);
    // console.log('Jimp.read >> filename:', filename);
    // console.log('Jimp.read >> avatarDir:', avatarDir);
    fileAvatar
      .cover(250, 250) // resize
      .quality(60) // set JPEG quality
      // .greyscale() // set greyscale
      .write(`${avatarDir}/${filename}`); // save
  });

  // Повертаємо на фронтенд:
  res.json({ avatarURL });
};

module.exports = updateAvatar;