import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import { useUserValue, useUserDispatch } from './context/UserContext';
import { setToken } from './services/blogs';
import Blog from './components/Blog';
import BlogList from './components/BlogList';
import LoginForm from './components/LoginForm';
import Notification from './components/Notification';
import User from './components/User';
import UsersList from './components/UsersList';

const App = () => {
  const user = useUserValue();
  const userDispatch = useUserDispatch();

  useEffect(() => {
    const userJSONobj = window.localStorage.getItem('loggedUser');
    if (userJSONobj) {
      const loggedUser = JSON.parse(userJSONobj);
      userDispatch({ type: 'SET_USER', payload: loggedUser });
      setToken(loggedUser.token);
    }
  }, []);

  if (user === null) {
    return (
      <>
        <h2>Log in to application</h2>
        <Notification />
        <LoginForm />
      </>
    );
  }

  const linkStyle = { padding: 5 };

  return (
    <Router>
      <div>
        <Link style={linkStyle} to="/">
          blogs
        </Link>
        <Link style={linkStyle} to="/users">
          users
        </Link>
      </div>

      <Routes>
        <Route path="/" element={<BlogList />} />
        <Route path="/users" element={<UsersList />} />
        <Route path="/blogs/:id" element={<Blog />} />
        <Route path="/users/:id" element={<User />} />
      </Routes>
    </Router>
  );
};

export default App;
