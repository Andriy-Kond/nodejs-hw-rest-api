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

const { DB_TEST_HOST } = process.env;

describe('register tests', () => {
  beforeAll(async () => {
    // Для supertest не потрібно запускати app на порту 3000 (app.listen(PORT))
    await mongoose.connect(DB_TEST_HOST);
  });

  afterAll(async () => {
    // await User.deleteMany(); // видаляємо всіх юзерів з db після всіх тестів
    await mongoose.disconnect();
  });

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
});
