import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Blog from './components/Blog';
import Message from './components/Message';
import NewBlogForm from './components/NewBlogForm';
import Togglable from './components/Togglable';
import blogService from './services/blogs';
import loginService from './services/login';
import { setNotification } from './reducers/notificationReducer';
import { initializeBlogs, setBlogs } from './reducers/blogReducer';

const App = () => {
  const [user, setUser] = useState(null);
  const blogs = useSelector((state) => state.blogs);
  const notification = useSelector((state) => state.notification);
  const dispatch = useDispatch();

  const compare = (a, b) => {
    if (a.likes > b.likes) return -1;
    if (a.likes < b.likes) return 1;
    return 0;
  };

  useEffect(() => {}, []);

  useEffect(() => {
    const userJSONobj = window.localStorage.getItem('loggedUser');
    if (userJSONobj) {
      const loggedUser = JSON.parse(userJSONobj);
      setUser(loggedUser);
      dispatch(initializeBlogs());
      blogService.setToken(loggedUser.token);
    }
  }, []);

  const handleLogout = (event) => {
    event.preventDefault();
    setUser(null);
    window.localStorage.removeItem('loggedUser');
  };

  const Login = () => {
    const handleLogin = async (event) => {
      event.preventDefault();

      try {
        const username = event.target.username.value;
        const password = event.target.password.value;
        const loggedUser = await loginService.login({ username, password });

        window.localStorage.setItem('loggedUser', JSON.stringify(loggedUser));
        setUser(loggedUser);
        blogService.setToken(loggedUser.token);
        dispatch(initializeBlogs());
      } catch (error) {
        dispatch(setNotification({ message: 'wrong username or password', type: 'ng' }, 5));
      }
    };

    return (
      <div>
        <h2>Log in to application</h2>
        {notification && <Message />}
        <form onSubmit={handleLogin}>
          <div>
            username <input key="username" type="text" name="username" />
          </div>
          <div>
            password <input key="password" type="password" name="password" />
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

      dispatch(setBlogs(blogs.concat(data).sort(compare)));
      dispatch(
        setNotification(
          {
            message: `a new blog ${newBlog.title} by ${newBlog.author} added`,
            type: 'ok',
          },
          5
        )
      );
    } catch (error) {
      dispatch(setNotification({ message: 'error adding blog', type: 'ng' }, 5));
    }
  };

  const handleAddLike = async (updatedBlog) => {
    try {
      const data = await blogService.updateBlog(updatedBlog);
      dispatch(
        setBlogs(
          blogs
            .map((blog) => {
              if (blog.id === data.id) {
                blog.likes = data.likes;
              }
              return blog;
            })
            .sort(compare)
        )
      );
    } catch (error) {
      dispatch(setNotification({ message: 'error updating blog', type: 'ng' }, 5));
    }
  };

  const handleRemoveBlog = async (blogId) => {
    try {
      await blogService.deleteBlog(blogId);
      dispatch(setBlogs(blogs.filter((blog) => blog.id !== blogId)));
      dispatch(setNotification({ message: 'blog successfully deleted', type: 'ok' }, 5));
    } catch (error) {
      dispatch(setNotification({ message: 'error deleting blog', type: 'ng' }, 5));
    }
  };

  const BlogList = () => {
    if (!blogs) return null;

    return (
      <div>
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

  if (!user) return <Login />;

  return (
    <div>
      <h2>Blogs</h2>
      {notification && <Message />}
      <p>
        {user.name} logged in{' '}
        <button id="logout-button" onClick={handleLogout}>
          logout
        </button>
      </p>
      <BlogList />
    </div>
  );
};

export default App;
