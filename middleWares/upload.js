const multer = require('multer'); // парсить payload і завантажує файл.
// multer потребує спеціальний заголовок Content-Type: multipart/form-data при надсиланні файлу. Інакше він працювати на буде.
//* А з фронтенду ми юзаємо у скрипті FormData і коли fetch бачить цей formData, він теж додає цей заголовок:
// <form id="form">
// // <input type="file" name="image" multiple/> // - для декількох файлів.
// <label for="image">Movie image</label>
// <input type="file" name="image" /> // type="file" додає кнопку Choose File автоматично
// <button type="submit">Upload</button>
// </form>;

// <script>
// const form = document.getElementById('form');
// form.addEventListener('submit', e => {
//   e.preventDefault();

//   const formData = new FormData();
//   formData.append('image', e.target.image.files[0]);

//   const url = 'http://localhost:3000/api/upload';
//   fetch(url, {
//     method: 'post',
//     body: formData,
//   }).catch(console.error);
//   console.log('submit');
// });
// </script>

//* Якщо треба з поля інпут отримувати текст
//<script src="https://cdnjs.cloudflare.com/ajax/libs/axios/1.4.0/axios.min.js" /> // axios

// <form id="form">
// <label for="movieName">Movie image</label>
// <input type="text" name="movieName" />
// <button type="submit">Create new movie</button>
// </form>;

// <script>
// const form = document.getElementById('form');
// form.addEventListener('submit', e => {
//   e.preventDefault();

//   const movieName = e.target.movieName.value);
//   console.log('movieName:', movieName)

// const url = 'http://localhost:3001/api/movies';
// // і далі або fetch:
// fetch(url, {
//   method: 'POST',
//   headers: { 'Content-Type': 'application/json' },
//   body: { title: movieName },
// })
//   .then(res => console.log(res))
//   .catch(err => console.log(err));
// // або axios:
// axios
//   .post(url, '/user', {
//     title: movieName,
//   })
//   .then(res => console.log(res))
//   .catch(err => console.log(err));
// });
// </script>

const path = require('path');
const { Script } = require('vm');

const tempDir = path.join(__dirname, '../', 'tmp');

// Об'єкт налаштувань multer-a
const multerConfig = multer.diskStorage({
  // шлях до теки, в якій будемо зберігати тимчасовий файл
  // Можна і просто написати "./", але краще через path, бо різні є системи
  destination: tempDir, // тут теж можна вказати ф-ю. Наприклад, (req, file, cb) => {...}
  // замість destination можна писати dest - обидва - це налаштування шляху до тимчасового сховища файлів

  // налаштування - filename.
  // Туди передаємо функцію, яка зберігає файл під іншим ім'ям
  // У функцію передається об'єкт request, об'єкт файл і колбек (cb).
  // file - це файл у пам'яті.
  // Тобто колбек filename-а (cb) спрацьовує коли multer отримав file, зберіг його у пам'яті, але ще не зберіг його на диску
  filename: (req, file, cb) => {
    // Перший параметр null (означає, що немає помилок). Другий параметр - ім'я файлу, під яким я хочу його зберегти
    cb(null, `${+new Date()}_${file.originalname}`); // завантажує файл у tempDir (/tmp)
    // файл зберігається під оригінальним ім'ям. Тобто в цьому випадку запис "filename: ..." ніби не потрібен. Але без нього файл зберігається під випадковим ім'ям без розширення, хоча його дані правильні.

    // new Date(); - додаємо до імені дату файлу, щоби один й той самий файл мав різні імена
    // +new Date(); - замість довгої дати робить цифровий код timestamp
  },
  // Налаштування limit дозволяє зробити певні обмеження

  // limits: {
  //   fileSize: 100, // дозволено завантажувати файли не більше 100 байт. Інакше буде помилка "File too large"
  // },
  // fileFilter: // тут вказуємо дозволені типи файлів, інакше можна кидати помилку з серверу.
});

// Створення middleware для зберігання
const upload = multer({
  storage: multerConfig,
});

module.exports = upload;
