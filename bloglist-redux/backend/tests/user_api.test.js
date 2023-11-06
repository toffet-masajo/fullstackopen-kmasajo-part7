const mongoose = require('mongoose');
const supertest = require('supertest');

const { allUsers, hashPassword, usersInDb } = require('./user_helper');
const User = require('../models/users');
const app = require('../app');
const api = supertest(app);

beforeEach(async () => {
  await User.deleteMany({});

  const users = allUsers.map((user) => {
    return { username: user.username, name: user.name, passwordHash: hashPassword(user.password) };
  });

  await User.insertMany(users);
});

describe('users exist', () => {
  test('users are returned as json', async () => {
    await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  }, 60000);

  test('all users are returned', async () => {
    const response = await api.get('/api/users');

    expect(response.body).toHaveLength(allUsers.length);
  });
});

describe('user element check', () => {
  test('user id exists', async () => {
    const { body } = await api.get('/api/users');

    expect(body[0].id).toBeDefined();
  });

  test('user username exists', async () => {
    const { body } = await api.get('/api/users');

    expect(body[0].username).toBeDefined();
  });

  test('user passwordHash should not exist', async () => {
    const { body } = await api.get('/api/users');

    expect(body[0].passwordHash).not.toBeDefined();
  });
});

describe('adding new user entry', () => {
  test('add valid entry', async () => {
    const oldUsers = await usersInDb();
    const initialLength = oldUsers.length;
    const newUser = {
      username: 'afowler',
      name: 'Amy Farrah Fowler',
      password: 'amylovessheldon',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const newUsers = await usersInDb();
    const userNames = newUsers.map((user) => user.username);

    expect(newUsers).toHaveLength(initialLength + 1);
    expect(userNames).toContain(newUser.username);
  });
  test('add duplicate entry', async () => {
    const oldUsers = await usersInDb();
    const initialLength = oldUsers.length;
    const newUser = {
      username: 'afowler',
      name: 'Amy Farrah Fowler',
      password: 'amylovessheldon',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    await api.post('/api/users').send(newUser).expect(400);

    const newUsers = await usersInDb();
    const userNames = newUsers.map((user) => user.username);

    expect(newUsers).toHaveLength(initialLength + 1);
    expect(userNames).toContain(newUser.username);
  });

  test('add invalid username', async () => {
    const oldUsers = await usersInDb();
    const initialLength = oldUsers.length;
    const newUser = {
      username: 'af',
      name: 'Amy Farrah Fowler',
      password: 'amylovessheldon',
    };

    await api.post('/api/users').send(newUser).expect(400);

    const newUsers = await usersInDb();
    const userNames = newUsers.map((user) => user.username);

    expect(newUsers).toHaveLength(initialLength);
    expect(userNames).not.toContain(newUser.username);
  });

  test('add missing username', async () => {
    const oldUsers = await usersInDb();
    const initialLength = oldUsers.length;
    const newUser = {
      name: 'Amy Farrah Fowler',
      password: 'amylovessheldon',
    };

    await api.post('/api/users').send(newUser).expect(400);

    const newUsers = await usersInDb();
    const userNames = newUsers.map((user) => user.username);

    expect(newUsers).toHaveLength(initialLength);
    expect(userNames).not.toContain(newUser.username);
  });

  test('add invalid password', async () => {
    const oldUsers = await usersInDb();
    const initialLength = oldUsers.length;
    const newUser = {
      username: 'afowler',
      name: 'Amy Farrah Fowler',
      password: 'am',
    };

    await api.post('/api/users').send(newUser).expect(400);

    const newUsers = await usersInDb();
    const userNames = newUsers.map((user) => user.username);

    expect(newUsers).toHaveLength(initialLength);
    expect(userNames).not.toContain(newUser.username);
  });

  test('add missing password', async () => {
    const oldUsers = await usersInDb();
    const initialLength = oldUsers.length;
    const newUser = {
      username: 'afowler',
      name: 'Amy Farrah Fowler',
    };

    await api.post('/api/users').send(newUser).expect(400);

    const newUsers = await usersInDb();
    const userNames = newUsers.map((user) => user.username);

    expect(newUsers).toHaveLength(initialLength);
    expect(userNames).not.toContain(newUser.username);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
