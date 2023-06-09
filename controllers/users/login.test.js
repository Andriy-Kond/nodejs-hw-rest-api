// // 1. Написати unit-тести для контролера входу (логін)
// // За допомогою Jest
// // відповідь повинна мати статус-код 200
// // у відповіді повинен повертатися токен
// // у відповіді повинен повертатися об'єкт user з 2 полями email и subscription з типом даних String

require('dotenv').config(); // має бут у горі всього, щоби якнайшвидше додати .env змінні у process
const mongoose = require('mongoose');
const supertest = require('supertest'); // спеціальний пакет, який може робити http-запит для тестів
const app = require('../../app'); // імпортуємо веб-сервер для запуску у тестовому режимі
// Для видалення всіх юзерів кожен раз з бази потрібна модель
const { User } = require('../../models/user');

const { DB_TEST_HOST } = process.env; // DB_TEST_HOST - тестова база

describe('login tests', () => {
  beforeAll(async () => {
    // Для supertest не потрібно запускати app на порту 3000 (app.listen(PORT))
    await mongoose.connect(DB_TEST_HOST);
  });

  afterAll(async () => {
    await User.deleteMany(); // видаляємо всіх юзерів з db після всіх тестів
    await mongoose.disconnect();
    // await mongoose.connection.close();
  });

  // Перевірка реєстрації
  it('should register a new user', async () => {
    const response = await supertest(app).post('/api/users/register').send({
      name: 'Bogdan',
      email: 'bogdan@mail.com',
      password: '123456',
    });

    expect(response.status).toEqual(201); // перевірка на правильний статус
    expect(response.body).toEqual({
      user: {
        email: 'bogdan@mail.com',
        subscription: 'starter',
      },
    }); // перевірка на наявність id
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
      email: 'bogdan@mail.com',
      password: '123456',
    };

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
        email: 'bogdan@mail.com',
        subscription: 'starter',
      },
    });

    // // * Чи токен, який нам повернули збігається з тим, що у базі
    // const { token } = await User.findById(user._id);
    // expect(response.body.token).toBe(token);
  });
});
