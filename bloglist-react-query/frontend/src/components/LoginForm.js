import { useState } from 'react';
import { Button, Form } from 'react-bootstrap';

import login from '../services/login';
import { setToken } from '../services/blogs';
import { useNotificationDispatch } from '../context/NotificationContext';
import { useUserDispatch } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const navigate = useNavigate();
  const userDispatch = useUserDispatch();
  const notificationDispatch = useNotificationDispatch();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const loggedUser = await login({ username, password });
      window.localStorage.setItem('loggedUser', JSON.stringify(loggedUser));
      userDispatch({ type: 'SET_USER', payload: loggedUser });
      setToken(loggedUser.token);
      notificationDispatch({ type: 'NEW_MESSAGE', payload: { message: 'login successful', type: 'ok' } });
      navigate('/');
    } catch (error) {
      notificationDispatch({ type: 'NEW_MESSAGE', payload: { message: 'wrong username or password', type: 'ng' } });
    } finally {
      setTimeout(() => notificationDispatch({ type: 'CLEAR_MESSAGE' }), 5000);
    }
  };

  return (
    <div>
      <Form onSubmit={handleLogin}>
        <Form.Group>
          <Form.Label>username:</Form.Label>
          <Form.Control
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />

          <Form.Label>password:</Form.Label>
          <Form.Control
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
          <Button id="login-button" variant="primary" type="submit">
            Login
          </Button>
        </Form.Group>
      </Form>
    </div>
  );
};

export default LoginForm;
