const bcrypt = require('bcrypt');
const router = require('express').Router();

const User = require('../models/users');

router.get('/', async (request, response, next) => {
  try {
    const users = await User.find({}).populate('blogs');
    response.json(users);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (request, response, next) => {
  try {
    const result = await User.findById(request.params.id);
    if (result === null) response.status(400).json({ error: 'user not found' });
    else response.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (request, response, next) => {
  try {
    const { username, name, password } = request.body;

    if (password === undefined) response.status(400).json({ error: 'password missing' });
    else if (password.length < 3) response.status(400).json({ error: 'invalid password length' });
    else {
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      const user = new User({
        username,
        name,
        passwordHash,
      });

      const savedUser = await user.save();

      response.status(201).json(savedUser);
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
