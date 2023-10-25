import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Blog from './Blog';

test('renders blog title & author, view button', () => {
  const blog = {
    title: 'Test Title',
    author: 'Test Author',
    url: 'www.testurl.com',
    likes: 0,
    user: {
      name: 'T.E. Ster',
      username: 'tester',
    },
  };

  const { container } = render(<Blog blog={blog} />);

  const element = container.querySelector('.blog');
  expect(element).toHaveTextContent('Test Title Test Author');
  expect(element).toHaveTextContent('view');
  expect(element).not.toHaveTextContent('www.testurl.com');
});

test('renders likes and url after clicking view button', async () => {
  const blog = {
    title: 'Test Title',
    author: 'Test Author',
    url: 'www.testurl.com',
    likes: 0,
    user: {
      name: 'T.E. Ster',
      username: 'tester',
    },
  };

  const { container } = render(<Blog blog={blog} />);

  const user = userEvent.setup();
  const button = screen.getByText('view');

  const blogBeforeClick = container.querySelector('.blog');
  expect(blogBeforeClick).toHaveTextContent('view');

  await user.click(button);

  const blogAfterClick = container.querySelector('.blog');
  expect(blogAfterClick).toHaveTextContent('hide');

  const blogDetails = container.querySelector('.blog-details');
  expect(blogDetails).toHaveTextContent('www.testurl.com');
});

test('click like button twice', async () => {
  const blog = {
    title: 'Test Title',
    author: 'Test Author',
    url: 'www.testurl.com',
    likes: 0,
    user: {
      name: 'T.E. Ster',
      username: 'tester',
    },
  };

  const likeHandler = jest.fn();

  const { container } = render(<Blog blog={blog} handleUpdate={likeHandler} />);

  const user = userEvent.setup();
  const viewButton = screen.getByText('view');

  const blogBeforeClick = container.querySelector('.blog');
  expect(blogBeforeClick).toHaveTextContent('view');

  await user.click(viewButton);

  const blogAfterClick = container.querySelector('.blog');
  expect(blogAfterClick).toHaveTextContent('hide');

  const likeButton = screen.getByText('like');

  await user.click(likeButton);
  await user.click(likeButton);

  expect(likeHandler.mock.calls).toHaveLength(2);
});
