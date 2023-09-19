import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { useUserValue, useUserDispatch } from './context/UserContext';
import { setToken } from './services/blogs';
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

  return (
    <Router>
      <Routes>
        <Route path="/" element={<BlogList />} />
        <Route path="/users" element={<UsersList />} />
        <Route path="/users/:id" element={<User />} />
      </Routes>
    </Router>
  );
};

export default App;
