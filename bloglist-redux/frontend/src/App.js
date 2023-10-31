import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Navigate, Route, Routes, useMatch } from 'react-router-dom';

import Blog from './components/Blog';
import BlogList from './components/BlogList';
import Login from './components/Login';
import Message from './components/Message';
import User from './components/User';
import UserList from './components/UserList';

import blogService from './services/blogs';

import { initializeBlogs } from './reducers/blogReducer';
import { setUser, userLogout } from './reducers/userReducer';
import { getUserList } from './reducers/userListReducer';

const linkStyle = { padding: 5 };

const App = () => {
  const notification = useSelector((state) => state.notification);
  const blogs = useSelector((state) => state.blogs);
  const user = useSelector((state) => state.user);
  const users = useSelector((state) => state.userlist);
  const dispatch = useDispatch();

  const userMatch = useMatch('/users/:id');
  const userItem = userMatch ? users.find((item) => item.id === userMatch.params.id) : null;

  const blogMatch = useMatch('/blogs/:id');
  const blogItem = blogMatch ? blogs.find((item) => item.id === blogMatch.params.id) : null;

  useEffect(() => {
    const userJSONobj = window.localStorage.getItem('loggedUser');
    if (userJSONobj) {
      const loggedUser = JSON.parse(userJSONobj);
      dispatch(setUser(loggedUser));
      dispatch(getUserList());
      blogService.setToken(loggedUser.token);
    }
    dispatch(initializeBlogs());
  }, []);

  const handleLogout = (event) => {
    event.preventDefault();
    dispatch(userLogout());
  };

  return (
    <div>
      <div>
        <Link style={linkStyle} to="/">
          blogs
        </Link>
        <Link style={linkStyle} to="/users">
          users
        </Link>
        {user ? (
          <div>
            <em>{user.username} logged in </em> <button onClick={handleLogout}>logout</button>
          </div>
        ) : (
          <Link style={linkStyle} to="/login">
            login
          </Link>
        )}
      </div>
      <h2>Blogs</h2>
      {notification && <Message />}

      <Routes>
        <Route path="/users/:id" element={<User user={userItem} />} />
        <Route path="/users" element={user ? <UserList /> : <Navigate replace to="/login" />} />
        <Route path="/blogs/:id" element={<Blog blog={blogItem} />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate replace to="/" />} />
        <Route path="/" element={<BlogList />} />
      </Routes>
    </div>
  );
};

export default App;
