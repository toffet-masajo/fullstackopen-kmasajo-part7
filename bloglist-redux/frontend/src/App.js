import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes, useMatch } from 'react-router-dom';

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
  const user = useSelector((state) => state.user);
  const users = useSelector((state) => state.userlist);
  const dispatch = useDispatch();

  const userMatch = useMatch('/users/:id');
  const userItem = userMatch ? users.find((item) => item.id === userMatch.params.id) : null;

  useEffect(() => {
    const userJSONobj = window.localStorage.getItem('loggedUser');
    if (userJSONobj) {
      const loggedUser = JSON.parse(userJSONobj);
      dispatch(setUser(loggedUser));
      dispatch(getUserList());
      dispatch(initializeBlogs());
      blogService.setToken(loggedUser.token);
    }
  }, []);

  const handleLogout = (event) => {
    event.preventDefault();
    dispatch(userLogout());
  };

  if (!user) return <Login />;

  return (
    <div>
      <h2>Blogs</h2>
      {notification && <Message />}
      <p>
        {user.username} logged in{' '}
        <button id="logout-button" onClick={handleLogout}>
          logout
        </button>
      </p>

      <Routes>
        <Route path="/users/:id" element={<User user={userItem} />} />
        <Route path="/users" element={<UserList />} />
        <Route path="/" element={<BlogList />} />
      </Routes>
    </div>
  );
};

export default App;
