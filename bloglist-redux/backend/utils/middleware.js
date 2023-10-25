const jwt = require('jsonwebtoken');

const User = require('../models/users');

const tokenExtractor = (req, res, next) => {
  const auth = req.get('authorization');
  if (auth && auth.startsWith('Bearer ')) req.token = auth.replace('Bearer ', '');
  else req.token = null;

  next();
};

const userExtractor = async (req, res, next) => {
  if (req.token === null) req.user = null;
  else {
    const reqToken = req.token;
    const token = jwt.verify(reqToken, process.env.SECRET);
    if (!token) req.user = null;
    else {
      const user = await User.findById(token.id);
      if (!user) req.user = null;
      else req.user = user;
    }
  }

  next();
};

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (error, req, res, next) => {
  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformed id' });
  } else if (error.name === 'ValidationError') {
    return res.status(400).send({ error: error.message });
  } else if (error.name === 'JsonWebTokenError') {
    return res.status(401).send({ error: error.message });
  }

  next(error);
};

module.exports = {
  tokenExtractor,
  userExtractor,
  unknownEndpoint,
  errorHandler,
};
