const _ = require('lodash');

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  const reducer = (sum, blog) => {
    return sum + blog.likes;
  };

  return blogs.length === 0
    ? 0
    : blogs.reduce(reducer, 0);
};

const favoriteBlog = (blogs) => {
  let winner = { title: '', author: '', likes: 0 };
  let highestLikes = 0;

  blogs.map(blog => {
    if(blog.likes > highestLikes) {
      highestLikes = blog.likes;

      winner.title = blog.title;
      winner.author = blog.author;
      winner.likes = highestLikes;
    }
    return blog;
  });

  return winner;
};

const mostBlogs = (blogs) => {
  let mostBlogs = 0;
  let winner = { author: '', blogs: 0 };
  const authors = _.countBy(blogs, 'author');

  _.forEach(authors, function(value, key) {
    if(value > mostBlogs) {
      mostBlogs = value;
      winner.author = key;
      winner.blogs = value;
    }
  });

  return winner;
};

const mostLikes = (blogs) => {
  let highest = 0;
  let winner = { author: '', likes: 0 };
  let authorList = {};

  const authors = _.groupBy(blogs, 'author');
  _.forEach(authors, function(blogList, author) {
    const totalLikes = blogList.reduce((total, blog) => {
      return total + blog.likes;
    }, 0);
    authorList[author] = totalLikes;
  });
  _.forEach(authorList, function(value, key) {
    if(value > highest) {
      highest = value;
      winner.author = key;
      winner.likes = value;
    }
  });

  return winner;
};

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes };