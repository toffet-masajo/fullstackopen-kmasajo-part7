const router = require('express').Router();

const Blog = require('../models/blogs');
const User = require('../models/users');
const { userExtractor } = require('../utils/middleware');

router.get('/', async (request, response, next) => {
  try {
    const blogs = await Blog.find({}).populate('user');
    response.json(blogs);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (request, response, next) => {
  try {
    const result = await Blog.findById(request.params.id);
    if (result === null) response.status(400).json({ error: 'blog not found' });
    else response.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

router.post('/', userExtractor, async (request, response, next) => {
  try {
    const user = request.user;
    if (!user) return response.status(401).json({ error: 'unauthorized access' });

    const body = request.body;
    if (!('likes' in body)) body.likes = 0;
    if (!('title' in body) || !body.title) return response.status(400).json({ error: 'title missing' });
    else if (!('url' in body) || !body.url) return response.status(400).json({ error: 'url missing' });

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
      user: user._id.toString(),
    });

    const result = await blog.save();
    user.blogs = user.blogs.concat(result._id);
    await user.save();

    response.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (request, response, next) => {
  try {
    const result = await Blog.findByIdAndUpdate(request.params.id, request.body, { new: true, context: 'query' });
    if (result === null) response.status(400).json({ error: 'blog not found' });
    else response.json(result);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', userExtractor, async (request, response, next) => {
  try {
    const blogToDelete = await Blog.findById(request.params.id);
    if (blogToDelete === null) return response.status(400).json({ error: 'blog not found' });

    const user = request.user;
    if (!user) return response.status(401).json({ error: 'unknown user' });

    const userId = user._id.toString();
    if (userId !== blogToDelete.user.toString()) return response.status(401).json({ error: 'unauthorized access' });

    const updatedUser = {
      username: user.username,
      name: user.name,
      passwordHash: user.passwordHash,
      blogs: user.blogs.filter((blog) => blog.toString() !== request.params.id),
    };

    await Blog.findByIdAndRemove(request.params.id);
    await User.findByIdAndUpdate(userId, updatedUser, { new: true, context: 'query' });
    return response.status(204).json({ message: 'blog deleted' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
