const listHelper = require('../utils/blog_helper');
const { emptyBlog, oneBlog, allBlogs } = require('./blog_helper');

test('dummy returns one', () => {
  const blogs = emptyBlog;

  const result = listHelper.dummy(blogs);
  expect(result).toBe(1);
});

describe('total likes', () => {
  test('of empty list is zero', () => {
    const blogs = emptyBlog;

    const result = listHelper.totalLikes(blogs);
    expect(result).toBe(0);
  });

  test('when list has only one blog equals the likes of that', () => {
    const blogs = oneBlog;

    const result = listHelper.totalLikes(blogs);
    expect(result).toBe(blogs[0].likes);
  });

  test('of a bigger list is calculated right', () => {
    const blogs = allBlogs;

    const result = listHelper.totalLikes(blogs);
    expect(result).toBe(36);
  });
});

describe('favorite blog', () => {
  test('of empty list is zero', () => {
    const blogs = emptyBlog;

    const result = listHelper.favoriteBlog(blogs);
    expect(result).toEqual({ author: '', title: '', likes: 0 });
  });

  test('when list has only one blog equals the likes of that', () => {
    const blogs = oneBlog;

    const winner = { title: blogs[0].title, author: blogs[0].author, likes: blogs[0].likes };
    const result = listHelper.favoriteBlog(blogs);
    expect(result).toEqual(winner);
  });

  test('of a bigger list is calculated right', () => {
    const blogs = allBlogs;

    const winner = blogs[2];
    const diff = { title: winner.title, author: winner.author, likes: winner.likes };
    const result = listHelper.favoriteBlog(blogs);
    expect(result).toEqual(diff);
  });
});

describe('most blogs', () => {
  test('of empty list is zero', () => {
    const blogs = emptyBlog;

    const result = listHelper.mostBlogs(blogs);
    expect(result).toEqual({ author: '', blogs: 0 });
  });

  test('when list has only one blog equals the likes of that', () => {
    const blogs = oneBlog;

    const winner = { author: blogs[0].author, blogs: 1 };
    const result = listHelper.mostBlogs(blogs);
    expect(result).toEqual(winner);
  });

  test('of a bigger list is calculated right', () => {
    const blogs = allBlogs;
    const diff = { author: 'Robert C. Martin', blogs: 3 };

    const result = listHelper.mostBlogs(blogs);
    expect(result).toEqual(diff);
  });
});

describe('most likes', () => {
  test('of empty list is zero', () => {
    const blogs = emptyBlog;

    const result = listHelper.mostLikes(blogs);
    expect(result).toEqual({ author: '', likes: 0 });
  });

  test('when list has only one blog equals the likes of that', () => {
    const blogs = oneBlog;

    const result = listHelper.mostLikes(blogs);
    expect(result).toEqual({ author: oneBlog[0].author, likes: oneBlog[0].likes });
  });

  test('of a bigger list is calculated right', () => {
    const blogs = allBlogs;

    const diff = { author: 'Edsger W. Dijkstra', likes: 17 };
    const result = listHelper.mostLikes(blogs);
    expect(result).toEqual(diff);
  });
});
