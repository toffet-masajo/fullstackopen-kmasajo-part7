import { useState } from 'react';

import login from '../services/login';
import { setToken } from '../services/blogs';
import { useNotificationDispatch } from '../context/NotificationContext';
import { useUserDispatch } from '../context/UserContext';

const LoginForm = () => {
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
    } catch (error) {
      notificationDispatch({ type: 'NEW_MESSAGE', payload: { message: 'wrong username or password', type: 'ng' } });
    } finally {
      setTimeout(() => notificationDispatch({ type: 'CLEAR_MESSAGE' }), 5000);
    }
  };

  return (
    <div>
      <form onSubmit={handleLogin}>
        <div>
          username{' '}
          <input type="text" value={username} name="Username" onChange={({ target }) => setUsername(target.value)} />
        </div>
        <div>
          password{' '}
          <input
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

export default LoginForm;
