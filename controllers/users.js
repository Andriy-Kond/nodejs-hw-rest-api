const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar'); // робота з тимчасовими аватарками
const path = require('path');
const fs = require('fs/promises');

const { User } = require('../models/user.js');
const { HttpError, ctrlWrapper } = require('../helpers');

const { SECRET_KEY } = process.env;

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, 'Email in use');
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email); // у avatarURL буде посилання на тимчасову аватарку юзера з таким email

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL, // додаємо у базу ще і аватарку
  });
  res.status(201).json({
    user: { email: newUser.email, subscription: newUser.subscription },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, 'Email or password is wrong');
  }

  const passCompare = await bcrypt.compare(password, user.password);
  if (!passCompare) {
    throw HttpError(401, 'Email or password is wrong');
  }

  const payload = { id: user._id };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '47h' });

  await User.findByIdAndUpdate(user._id, { token });

  res.json({
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
};

const getCurrent = async (req, res) => {
  const { email, subscription } = req.user;
  res.json({ email, subscription });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: '' });

  res.status(204).json();
};

const updateSubscriptionUser = async (req, res) => {
  const { userId } = req.params;
  const result = await User.findByIdAndUpdate(userId, req.body, {
    new: true,
  });

  if (!result) {
    throw HttpError(404, 'Not Found');
  }
  res.json(result);
};

const avatarDir = path.join(__dirname, '../', 'public', 'avatars');

const Jimp = require('jimp');

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
      .resize(250, 250) // resize
      .quality(60) // set JPEG quality
      // .greyscale() // set greyscale
      .write(`${avatarDir}/${filename}`); // save
  });

  // Повертаємо на фронтенд:
  res.json({ avatarURL });
};

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  updateSubscriptionUser: ctrlWrapper(updateSubscriptionUser),
  updateAvatar: ctrlWrapper(updateAvatar),
};
