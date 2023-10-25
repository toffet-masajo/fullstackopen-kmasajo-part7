const bcrypt = require('bcrypt');
const User = require('../models/users');

const emptyUser = [];

const oneUser = [
  {
    username: 'scooper',
    name: 'Sheldon Cooper',
    password: 'bazinga!',
  },
];

const allUsers = [
  {
    username: 'scooper',
    name: 'Sheldon Cooper',
    password: 'bazinga!',
  },
  {
    username: 'lhofstadter',
    name: 'Leonard Hofstadter',
    password: 'sheldon!',
  },
  {
    username: 'hwolowitz',
    name: 'Howard Wolowitz',
    password: 'astronaut',
  },
  {
    username: 'rkoothrapali',
    name: 'Raj Koothrapali',
    password: 'quietman',
  },
];

const generatePasswordHashes = async (users) => {
  const modifiedUsers = users.map(async (user) => {
    user.hashPassword = await hashPassword(user.password);
    delete user.password;
  });
  console.log(modifiedUsers);
};

const hashPassword = (password) => {
  const saltRounds = 10;
  const hash = bcrypt.hashSync(password, saltRounds);
  return hash;
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((user) => user.toJSON());
};

module.exports = { emptyUser, oneUser, allUsers, generatePasswordHashes, hashPassword, usersInDb };
