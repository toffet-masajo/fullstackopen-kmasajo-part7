import { useMutation, useQuery, useQueryClient } from 'react-query';

import { useUserValue } from '../context/UserContext';
import { useNotificationDispatch } from '../context/NotificationContext';
import { createBlog, deleteBlog, getAllBlogs, updateBlog } from '../services/blogs';

import Blog from './Blog';
import NewBlogForm from './NewBlogForm';
import Togglable from './Togglable';
import LogoutForm from './LogoutForm';

const BlogList = () => {
  const user = useUserValue();
  const notificationDispatch = useNotificationDispatch();
  const queryClient = useQueryClient();

  const compare = (a, b) => {
    if (a.likes > b.likes) return -1;
    if (a.likes < b.likes) return 1;
    return 0;
  };

  const newBlogMutation = useMutation(createBlog, {
    onSuccess: (newBlog) => {
      const blogs = queryClient.getQueryData('blogs');
      newBlog.user = { username: user.username, name: user.name };
      queryClient.setQueryData('blogs', blogs.concat(newBlog).sort(compare));
      notificationDispatch({
        type: 'NEW_MESSAGE',
        payload: {
          message: `a new blog ${newBlog.title} by ${newBlog.author} added`,
          type: 'ok',
        },
      });
    },
    onError: ({ response }) =>
      notificationDispatch({ type: 'NEW_MESSAGE', payload: { message: `${response.data.error}`, type: 'ng' } }),
    onSettled: () => setTimeout(() => notificationDispatch({ type: 'CLEAR_MESSAGE' }), 5000),
  });

  const likeBlogMutation = useMutation(updateBlog, {
    onSuccess: (updatedBlog) => {
      const blogs = queryClient.getQueryData('blogs');
      updatedBlog.user = { username: user.username, name: user.name };
      queryClient.setQueryData(
        'blogs',
        blogs.map((blog) => {
          if (blog.id === updatedBlog.id) return updatedBlog;
          return blog;
        })
      );
    },
    onError: ({ response }) =>
      notificationDispatch({ type: 'NEW_MESSAGE', payload: { message: `${response.data.error}`, type: 'ng' } }),
    onSettled: () => setTimeout(() => notificationDispatch({ type: 'CLEAR_MESSAGE' }), 5000),
  });

  const deleteBlogMutation = useMutation(deleteBlog, {
    onSuccess: (blogId) => {
      const blogs = queryClient.getQueryData('blogs');
      queryClient.setQueryData(
        'blogs',
        blogs.filter((blog) => blog.id !== blogId)
      );
    },
    onError: ({ response }) => {
      notificationDispatch({ type: 'NEW_MESSAGE', payload: { message: `${response.data.error}`, type: 'ng' } });
    },
    onSettled: () => setTimeout(() => notificationDispatch({ type: 'CLEAR_MESSAGE' }), 5000),
  });

  const handleCreateBlog = async (newBlog) => {
    newBlogMutation.mutate(newBlog);
  };

  const handleAddLike = async (updatedBlog) => {
    likeBlogMutation.mutate(updatedBlog);
  };

  const handleRemoveBlog = async (blogId) => {
    deleteBlogMutation.mutate(blogId);
  };

  const result = useQuery('blogs', getAllBlogs, { retry: false, refetchOnWindowFocus: false });
  if (result.isLoading) return <div>loading data...</div>;
  if (result.isError) return <div>blog service not available due to problems in the server.</div>;

  const blogs = result.data.sort(compare);

  return (
    <div>
      <LogoutForm />
      <Togglable buttonLabel="new blog">
        <NewBlogForm handleCreate={handleCreateBlog} />
      </Togglable>
      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          user={user.username}
          handleUpdate={handleAddLike}
          handleDelete={handleRemoveBlog}
        />
      ))}
    </div>
  );
};

export default BlogList;
