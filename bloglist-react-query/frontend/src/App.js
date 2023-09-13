import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import Blog from './components/Blog';
import NewBlogForm from './components/NewBlogForm';
import { createBlog, deleteBlog, getAllBlogs, setToken, updateBlog } from './services/blogs';
import loginService from './services/login';
import { useNotificationDispatch } from './components/NotificationContext';

import LoginForm from './components/LoginForm';
import Notification from './components/Notification';
import Togglable from './components/Togglable';

const App = () => {
  const [user, setUser] = useState(null);

  const notificationDispatch = useNotificationDispatch();
  const queryClient = useQueryClient();

  const compare = (a, b) => {
    if (a.likes > b.likes) return -1;
    if (a.likes < b.likes) return 1;
    return 0;
  };

  const result = useQuery('blogs', getAllBlogs, { retry: false, refetchOnWindowFocus: false });

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

  useEffect(() => {
    const userJSONobj = window.localStorage.getItem('loggedUser');
    if (userJSONobj) {
      const loggedUser = JSON.parse(userJSONobj);
      setUser(loggedUser);
      setToken(loggedUser.token);
    }
  }, []);

  const handleLogin = async (username, password) => {
    try {
      const loggedUser = await loginService.login({ username, password });

      window.localStorage.setItem('loggedUser', JSON.stringify(loggedUser));
      setUser(loggedUser);
      setToken(loggedUser.token);
      notificationDispatch({ type: 'NEW_MESSAGE', payload: { message: 'login successful', type: 'ok' } });
    } catch (error) {
      notificationDispatch({ type: 'NEW_MESSAGE', payload: { message: 'wrong username or password', type: 'ng' } });
    } finally {
      setTimeout(() => notificationDispatch({ type: 'CLEAR_MESSAGE' }), 5000);
    }
  };

  const handleLogout = (event) => {
    event.preventDefault();
    setUser(null);
    window.localStorage.removeItem('loggedUser');
    notificationDispatch({ type: 'NEW_MESSAGE', payload: { message: 'Logged out!', type: 'ok' } });
    setTimeout(() => notificationDispatch({ type: 'CLEAR_MESSAGE' }), 5000);
  };

  const handleCreateBlog = async (newBlog) => {
    newBlogMutation.mutate(newBlog);
  };

  const handleAddLike = async (updatedBlog) => {
    likeBlogMutation.mutate(updatedBlog);
  };

  const handleRemoveBlog = async (blogId) => {
    deleteBlogMutation.mutate(blogId);
  };

  if (result.isLoading) return <div>loading data...</div>;
  if (result.isError) return <div>blog service not available due to problems in the server.</div>;

  const blogs = result.data.sort(compare);

  if (user === null) {
    return (
      <>
        <h2>Log in to application</h2>
        <Notification />
        <LoginForm onLogin={handleLogin} />
      </>
    );
  }

  return (
    <div>
      <h2>Blogs</h2>
      <Notification />
      <p>
        {user.name} logged in{' '}
        <button id="logout-button" onClick={handleLogout}>
          logout
        </button>
      </p>
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

export default App;
