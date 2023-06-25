// 1. Написати unit-тести для контролера входу (логін)
// За допомогою Jest
// відповідь повинна мати статус-код 200
// у відповіді повинен повертатися токен
// у відповіді повинен повертатися об'єкт user з 2 полями email и subscription з типом даних String

require('dotenv').config(); // має бут у горі всього, щоби якнайшвидше додати .env змінні у process
const mongoose = require('mongoose');
const supertest = require('supertest'); // спеціальний пакет, який може робити http-запит для тестів

const app = require('../../app'); // імпортуємо веб-сервер для запуску у тестовому режимі

// Для видалення всіх юзерів кожен раз з бази потрібна модель:
const { User } = require('../../models/user');

const { DB_TEST_HOST } = process.env; // DB_TEST_HOST - тестова база

// Перед тестами треба запустити веб-сервер, а після тестів зупинити його.
// describe('test auth routes', () => {
//   let server;
//   // beforeAll виконує певні дії до тестів, afterAll - після тестів
//   beforeAll(() => (server = app.listen(PORT))); // запускаю до тестів веб-сервер
//   afterAll(() => server.close()); // зупиняю сервер після тестів

//   // beforeEach робить дії до кожного тесту, afterEach - після кожного тесту
//   // Підєднуюсь до бази
//   beforeEach(() => {
//     mongoose.connect(DB_TEST_HOST).then(() => done());
//   });

//   // Видаляю дані з бази, щоби вони не заважали новому тесту
//   afterEach(done => {
//     mongoose.connection.db.users(() => {
//       mongoose.connection.close(() => done());
//     });
//   });
// ...

// Але для supertest не потрібно явно запускати app на порту 3000 (app.listen(PORT)). Він запускає його автоматично.
describe('login tests', () => {
  beforeAll(async () => {
    await mongoose.connect(DB_TEST_HOST);
  });

  afterAll(async () => {
    await User.deleteMany(); // видаляю всіх юзерів з db після всіх тестів
    await mongoose.disconnect(); // Закриваю сервер
    // await mongoose.connection.close();  // Закриваю сервер?
  });

  // Перевірка реєстрації
  it('should register a new user', async () => {
    const response = await supertest(app).post('/api/users/register').send({
      name: 'Bogdan',
      email: 'akwebua.study@gmail.com',
      password: '123456',
    });

    // перевірка на правильний статус:
    expect(response.status).toEqual(201);

    expect(response.body).toEqual({
      user: {
        email: 'akwebua.study@gmail.com',
        subscription: 'starter',
      },
    });
  });

  // Перевірка логізації
  it('should login user', async () => {
    // // Перед тим як пееревіряти логін, людину треба додати у базу:
    // const newUser = {
    //   name: 'Bogdan',
    //   email: 'bogdan@mail.com',
    //   password: '123456',
    // };

    // // Додваємо людину у базу
    // const user = await User.create(newUser);

    // Дані для логіну:
    const loginUser = {
      email: 'akwebua.study@gmail.com',
      password: '123456',
    };

    // Роблю запит:
    const response = await supertest(app)
      .post('/api/users/login')
      .send(loginUser);

    // * Перевіряю статус чи він ===200
    expect(response.status).toEqual(200);
    // або:
    // expect(response.statusCode).toBe(200);

    // * Перевіряю токен чи він є
    expect(response.body.token).toBeTruthy(); // чи є взагалі поле token

    // * Перевіряю тіло на відповідність схемі
    expect(response.body).toEqual({
      token: expect.any(String),
      user: {
        email: 'akwebua.study@gmail.com',
        subscription: 'starter',
      },
    });

    // // * Чи токен, який нам повернули збігається з тим, що у базі
    // const { token } = await User.findById(user._id);
    // expect(response.body.token).toBe(token);
  });
});
