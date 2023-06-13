require('dotenv').config();
const mongoose = require('mongoose');
const supertest = require('supertest');

const app = require('../../app');
const { User } = require('../../models/user');

const { DB_TEST_HOST } = process.env;

describe('login tests', () => {
  beforeAll(async () => {
    await mongoose.connect(DB_TEST_HOST);
  });

  afterAll(async () => {
    await User.deleteMany();
    await mongoose.disconnect();
  });

  it('should register a new user', async () => {
    const response = await supertest(app).post('/api/users/register').send({
      name: 'Bogdan',
      email: 'akwebua.study@gmail.com',
      password: '123456',
    });

    expect(response.status).toEqual(201);
    expect(response.body).toEqual({
      user: {
        email: 'akwebua.study@gmail.com',
        subscription: 'starter',
      },
    });
  });

  it('should login user', async () => {
    const loginUser = {
      email: 'akwebua.study@gmail.com',
      password: '123456',
    };

    const response = await supertest(app)
      .post('/api/users/login')
      .send(loginUser);

    expect(response.status).toEqual(200);
    expect(response.body.token).toBeTruthy();
    expect(response.body).toEqual({
      token: expect.any(String),
      user: {
        email: 'akwebua.study@gmail.com',
        subscription: 'starter',
      },
    });
  });
});
