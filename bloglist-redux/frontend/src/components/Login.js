import { useDispatch, useSelector } from 'react-redux';

import Message from './Message';
import { userLogin } from '../reducers/userReducer';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const notification = useSelector((state) => state.notification);
  const dispatch = useDispatch();

  const handleLogin = async (event) => {
    event.preventDefault();

    const username = event.target.username.value;
    const password = event.target.password.value;
    dispatch(userLogin({ username, password }));
    navigate('/');
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

export default Login;
