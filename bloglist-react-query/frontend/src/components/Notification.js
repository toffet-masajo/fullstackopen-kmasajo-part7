import { Alert } from 'react-bootstrap';
import { useNotificationValue } from '../context/NotificationContext';

const Notification = () => {
  const message = useNotificationValue();

  if (message === null) return null;
  return <Alert variant={message.type === 'ok' ? 'success' : 'warning'}>{message.message}</Alert>;
};

export default Notification;
