import { useState, useEffect } from 'react';
import Blog from './components/Blog';
import NewBlogForm from './components/NewBlogForm';
import Togglable from './components/Togglable';
import blogService from './services/blogs';
import loginService from './services/login';
import { useNotificationDispatch, useNotificationValue } from './components/NotificationContext';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  const notificationDispatch = useNotificationDispatch();
  const message = useNotificationValue();

  const compare = (a, b) => {
    if (a.likes > b.likes) return -1;
    if (a.likes < b.likes) return 1;
    return 0;
  };

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs.sort(compare)));
  }, []);

  useEffect(() => {
    const userJSONobj = window.localStorage.getItem('loggedUser');
    if (userJSONobj) {
      const loggedUser = JSON.parse(userJSONobj);
      setUser(loggedUser);
      blogService.setToken(loggedUser.token);
    }
  }, []);

  const messageForm = () => {
    if (message === null) return null;
    if (message.type === 'ok')
      return (
        <div className="success-message" style={{ color: 'green' }}>
          <h2>{message.message}</h2>
        </div>
      );
    return (
      <div className="error-message" style={{ color: 'red' }}>
        <h2>{message.message}</h2>
      </div>
    );
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const loggedUser = await loginService.login({ username, password });

      window.localStorage.setItem('loggedUser', JSON.stringify(loggedUser));
      setUser(loggedUser);
      blogService.setToken(loggedUser.token);
      setUsername('');
      setPassword('');
    } catch (error) {
      notificationDispatch({ type: 'NEW_MESSAGE', payload: { message: 'wrong username or password', type: 'ng' } });
      setTimeout(() => notificationDispatch({ type: 'CLEAR_MESSAGE' }), 5000);
    }
  };

  const handleLogout = (event) => {
    event.preventDefault();
    setUser(null);
    window.localStorage.removeItem('loggedUser');
  };

  const loginForm = () => {
    return (
      <div>
        <h2>Log in to application</h2>
        {message && messageForm()}
        <form onSubmit={handleLogin}>
          <div>
            username{' '}
            <input
              id="username"
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password{' '}
            <input
              id="password"
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button id="login-button" type="submit">
            Login
          </button>
        </form>
      </div>
    );
  };

  const handleCreateBlog = async (newBlog) => {
    try {
      const data = await blogService.createBlog(newBlog);
      data.user = { username: user.username, name: user.name };

      setBlogs(blogs.concat(data).sort(compare));
      notificationDispatch({
        type: 'NEW_MESSAGE',
        payload: {
          message: `a new blog ${newBlog.title} by ${newBlog.author} added`,
          type: 'ok',
        },
      });
    } catch (error) {
      notificationDispatch({ type: 'NEW_MESSAGE', payload: { message: 'error adding blog', type: 'ng' } });
    } finally {
      setTimeout(() => notificationDispatch({ type: 'CLEAR_MESSAGE' }), 5000);
    }
  };

  const handleAddLike = async (updatedBlog) => {
    try {
      const data = await blogService.updateBlog(updatedBlog);
      setBlogs(
        blogs
          .map((blog) => {
            if (blog.id === data.id) {
              blog.likes = data.likes;
            }
            return blog;
          })
          .sort(compare)
      );
    } catch (error) {
      notificationDispatch({ type: 'NEW_MESSAGE', payload: { message: 'error updating blog', type: 'ng' } });
      setTimeout(() => notificationDispatch({ type: 'CLEAR_MESSAGE' }), 5000);
    }
  };

  const handleRemoveBlog = async (blogId) => {
    try {
      await blogService.deleteBlog(blogId);
      setBlogs(blogs.filter((blog) => blog.id !== blogId));
    } catch (error) {
      notificationDispatch({ type: 'NEW_MESSAGE', payload: { message: 'error deleting blog', type: 'ng' } });
      setTimeout(() => notificationDispatch({ type: 'CLEAR_MESSAGE' }), 5000);
    }
  };

  const blogForm = () => {
    return (
      <div>
        <h2>Blogs</h2>
        {message && messageForm()}
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

  return <div>{user === null ? loginForm() : blogForm()}</div>;
};

export default App;
