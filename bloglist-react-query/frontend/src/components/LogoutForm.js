import { useNotificationDispatch } from '../context/NotificationContext';
import { useUserDispatch, useUserValue } from '../context/UserContext';
import Notification from './Notification';

const LogoutForm = () => {
  const user = useUserValue();
  const userDispatch = useUserDispatch();
  const notificationDispatch = useNotificationDispatch();

  const handleLogout = (event) => {
    event.preventDefault();
    window.localStorage.removeItem('loggedUser');
    userDispatch({ type: 'SET_USER', payload: null });
    notificationDispatch({ type: 'NEW_MESSAGE', payload: { message: 'Logged out!', type: 'ok' } });
    setTimeout(() => notificationDispatch({ type: 'CLEAR_MESSAGE' }), 5000);
  };

  return (
    <div>
      <h2>Blogs</h2>
      <Notification />
      <p>
        {user.name} logged in{' '}
        <button id="logout-button" onClick={handleLogout}>
          logout
        </button>
      </p>
    </div>
  );
};

export default LogoutForm;
