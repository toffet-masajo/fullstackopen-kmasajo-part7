import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NewBlogForm from './NewBlogForm';

test('create new blog', async () => {
  const title = 'My New Blog Entry';
  const author = 'A. U. Thor';
  const url = 'www.myblogurl.com';
  const handleCreateForm = jest.fn();

  render(<NewBlogForm handleCreate={handleCreateForm} />);

  const titleBox = screen.getByPlaceholderText('blog title');
  const authorBox = screen.getByPlaceholderText('blog author');
  const urlBox = screen.getByPlaceholderText('blog url');
  const createButton = screen.getByText('create');

  await userEvent.type(titleBox, title);
  await userEvent.type(authorBox, author);
  await userEvent.type(urlBox, url);
  await userEvent.click(createButton);

  expect(handleCreateForm.mock.calls).toHaveLength(1);
  expect(handleCreateForm.mock.calls[0][0].title).toBe(title);
  expect(handleCreateForm.mock.calls[0][0].author).toBe(author);
  expect(handleCreateForm.mock.calls[0][0].url).toBe(url);
});
