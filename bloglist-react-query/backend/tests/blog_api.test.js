const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const supertest = require('supertest');

const { allBlogs, blogsInDb, getRandomUser } = require('./blog_helper');
const Blog = require('../models/blogs');
const User = require('../models/users');
const app = require('../app');
const api = supertest(app);

beforeAll( async () => {
  await User.deleteMany({});

  const password = await bcrypt.hash('tester', 10);
  const user = new User({ username: 'tester', name: 'tester', passwordHash: password });
  await user.save();
});

beforeEach( async () => {
  await Blog.deleteMany({});

  const userId = await getRandomUser();
  const blogObjects = allBlogs.map( blog => {
    return {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes,
      user: userId
    };
  });

  await Blog.insertMany(blogObjects);
});

describe('blogs exist', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  }, 60000);

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs');

    expect(response.body).toHaveLength(allBlogs.length);
  });
});

describe('blog id element check', () => {
  test('blog id exists', async () => {
    const { body } = await api.get('/api/blogs');

    expect(body[0].id).toBeDefined();
  });
});

describe('adding new blog entry', () => {
  test('add valid entry', async () => {
    const oldBlogs = await blogsInDb();
    const userId = await getRandomUser();

    const response = await api
      .post('/api/login')
      .send({ username: 'tester', password: 'tester' });

    const initialLength = oldBlogs.length;
    const newBlog = {
      'title': 'Types and Tests',
      'author': 'Robert C. Martin',
      'url': 'http://blog.cleancoder.com/uncle-bob/2019/06/08/TestsAndTypes.html',
      'likes': 5,
      'user': userId,
    };

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${response.body.token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const { body } = await api.get('/api/blogs');
    const blogTitles = body.map(item => item.title);

    expect(body).toHaveLength(initialLength + 1);
    expect(blogTitles).toContain(newBlog.title);
  });

  test('token not provided', async () => {
    const userId = await getRandomUser();

    const newBlog = {
      'title': 'Types and Tests',
      'author': 'Robert C. Martin',
      'url': 'http://blog.cleancoder.com/uncle-bob/2019/06/08/TestsAndTypes.html',
      'likes': 5,
      'user': userId,
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/);
  });

  test('likes attribute missing', async () => {
    const oldBlogs = await blogsInDb();
    const initialLength = oldBlogs.length;
    const newBlog = {
      'title': 'Types and Tests',
      'author': 'Robert C. Martin',
      'url': 'http://blog.cleancoder.com/uncle-bob/2019/06/08/TestsAndTypes.html',
    };
    const response = await api
      .post('/api/login')
      .send({ username: 'tester', password: 'tester' });

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${response.body.token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const newBlogs = await blogsInDb();
    expect(newBlogs[initialLength].likes).toBeDefined();
  });

  test('title attribute missing', async () => {
    const newBlog = {
      'author': 'Robert C. Martin',
      'url': 'http://blog.cleancoder.com/uncle-bob/2019/06/08/TestsAndTypes.html',
      'likes': 5,
    };
    const response = await api
      .post('/api/login')
      .send({ username: 'tester', password: 'tester' });

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${response.body.token}`)
      .send(newBlog)
      .expect(400);
  });

  test('url attribute missing', async () => {
    const newBlog = {
      'title': 'Types and Tests',
      'author': 'Robert C. Martin',
      'likes': 5,
    };
    const response = await api
      .post('/api/login')
      .send({ username: 'tester', password: 'tester' });

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${response.body.token}`)
      .send(newBlog)
      .expect(400);
  });
});

describe('deleting blog entry', () => {
  test('delete existing blog entry', async () => {
    const oldBlogs = await blogsInDb();
    const blogToDelete = oldBlogs[0];
    const response = await api
      .post('/api/login')
      .send({ username: 'tester', password: 'tester' });

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${response.body.token}`)
      .expect(204);

    const newBlogs = await blogsInDb();
    expect(newBlogs).toHaveLength(oldBlogs.length - 1);
  });

  test('delete non-existing blog entry', async () => {
    const oldBlogs = await blogsInDb();
    const blogToDelete = '123456789abcdef123456789';

    await api
      .delete(`/api/blogs/${blogToDelete}`)
      .expect(400);

    const newBlogs = await blogsInDb();
    expect(newBlogs).toHaveLength(oldBlogs.length);
  });
});

describe('updating blog entry', () => {
  test('update existing blog entry', async () => {
    const oldBlogs = await blogsInDb();
    const blogToUpdate = {
      title: oldBlogs[0].title,
      author: oldBlogs[0].author,
      url: oldBlogs[0].url,
      likes: oldBlogs[0].likes + 1
    };

    await api
      .put(`/api/blogs/${oldBlogs[0].id}`)
      .send(blogToUpdate)
      .expect(200);

    const newBlogs = await blogsInDb();
    expect(newBlogs[0].likes).toEqual(blogToUpdate.likes);
  });

  test('update non-existing blog entry', async () => {
    const oldBlogs = await blogsInDb();
    const blogToUpdate = {
      title: oldBlogs[0].title,
      author: oldBlogs[0].author,
      url: oldBlogs[0].url,
      likes: oldBlogs[0].likes + 1
    };
    const id = '123456789abcdef123456789';

    await api
      .put(`/api/blogs/${id}`)
      .send(blogToUpdate)
      .expect(400);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});