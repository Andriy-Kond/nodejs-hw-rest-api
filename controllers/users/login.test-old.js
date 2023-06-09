// // 1. Написати unit-тести для контролера входу (логін)
// // За допомогою Jest

// // відповідь повина мати статус-код 200
// // у відповіді повинен повертатися токен
// // у відповіді повинен повертатися об'єкт user з 2 полями email и subscription з типом даних String

require('dotenv').config();
const mongoose = require('mongoose');
const supertest = require('supertest'); // спеціальний пакет, який може робити http-запит для тестів
const app = require('../../app'); // імпортуємо веб-сервер для запуску у тестовому режимі
const { User } = require('../../models/user');

const { DB_TEST_HOST, PORT } = process.env; // DB_TEST_HOST - тестова база

// Перед тестами треба запустити веб-сервер, а після тестів зупинити його.
describe('test auth routes', () => {
  let server;
  // beforeAll виконує певні дії до тестів, beforeAll - після тестів
  beforeAll(() => (server = app.listen(PORT))); // запускаю до тестів веб-сервер
  afterAll(() => server.close()); // зупиняю сервер після тестів

  // beforeEach робить дії до кожного тесту, afterEach - після кожного тесту
  // Підєднуюсь до бази
  beforeEach(() => {
    mongoose.connect(DB_TEST_HOST).then(() => done());
  });

  // Видаляю дані з бази, щоби вони не заважали новому тесту
  afterEach(done => {
    mongoose.connection.db.users(() => {
      mongoose.connection.close(() => done());
    });
  });

  test('test login route', async () => {
    // Перед тим як пееревіряти логін людину треба додати у базу:
    const newUser = {
      email: 'bogdan@mail.com',
      password: '123456',
    };
    // Додваємо людину у базу
    const user = await User.create(newUser);

    // Дані для логіну:
    const loginUser = {
      email: 'bogdan@mail.com',
      password: '123456',
    };

    // Робимо запит:
    const response = await supertest(app)
      .post('/api/users/login')
      .send(loginUser);
    expect(response.statusCode).toBe(200); // чи код 200?
    const { body } = response;
    expect(body.token).toByTruthy(); // чи є взагалі поле token
    const { token } = await User.findById(user._id);
    expect(body.token).toBe(token); // чи токен, який нам повернули збігається з тим, що у базі
  });
});

// describe('unit-tests for login', () => {
//   test('should have status 200', () => {
//     const result = login();
//     expect(result.status).toBe(200);
//   });

//   test('should have token', () => {
//     expect(() => {
//       const result = login();
//     }).toThrow('year must be exist');
//   });

//   test('should have object user', () => {
//     const result = login();
//   });

//   test('object should have field "email"', () => {
//     const result = login();
//   });
//   test('object should have field "subscription" ', () => {
//     const result = login();
//   });

//   test('field "email" should be string type', () => {
//     const result = login();
//   });
//   test('field "subscription" should be string type', () => {
//     const result = login();
//   });
// });
