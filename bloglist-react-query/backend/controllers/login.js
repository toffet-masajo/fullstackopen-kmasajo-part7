const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const loginRouter = require('express').Router();

const User = require('../models/users');

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body;

  const user = await User.findOne({ username });
  const loginOk = user === null
    ? false
    : bcrypt.compareSync(password, user.passwordHash);

  if( !(user && loginOk) ) {
    return response.status(401).json({
      error: 'invalid username or password'
    });
  }

  const userDetails = { username: user.username, id: user._id };
  const token = jwt.sign( userDetails, process.env.SECRET );

  response
    .status(200)
    .send({ token, username: user.username, name: user.name });
});

module.exports = loginRouter;