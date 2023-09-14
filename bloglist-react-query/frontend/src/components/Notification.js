import { useNotificationValue } from '../context/NotificationContext';

const Notification = () => {
  const message = useNotificationValue();
  if (message === null) return null;
  if (message.type === 'ok')
    return (
      <div className="success-message" style={{ color: 'green' }}>
        <h2>{message.message}</h2>
      </div>
    );
  return (
    <div className="error-message" style={{ color: 'red' }}>
      <h2>{message.message}</h2>
    </div>
  );
};

export default Notification;
