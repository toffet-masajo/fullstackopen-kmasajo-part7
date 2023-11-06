import { Button, Container } from '@mui/material';
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
    <Container>
      <div>{notification && <Message />}</div>
      <div>
        <Button variant="contained" color="primary" component={Link} to="/">
          blogs
        </Button>
        <Button variant="contained" color="primary" component={Link} to="/users">
          users
        </Button>
        {user ? (
          <>
            <Button variant="contained" color="primary" onClick={handleLogout}>
              logout
            </Button>{' '}
            <em>{user.username} logged in </em>
          </>
        ) : (
          <Button variant="contained" color="primary" component={Link} to="/login">
            login
          </Button>
        )}
        <h2>Blog App by Toffet Masajo</h2>
      </div>

      <Routes>
        <Route path="/users/:id" element={<User user={userItem} />} />
        <Route path="/users" element={user ? <UserList /> : <Navigate replace to="/login" />} />
        <Route path="/blogs/:id" element={<Blog blog={blogItem} />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate replace to="/" />} />
        <Route path="/" element={<BlogList />} />
      </Routes>
    </Container>
  );
};

export default App;
