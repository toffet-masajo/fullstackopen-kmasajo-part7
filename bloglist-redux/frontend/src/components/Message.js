import { useSelector } from 'react-redux';

const Message = () => {
  const notification = useSelector((state) => state.notification);
  if (notification === null) return null;

  return (
    <div style={{ color: notification.type === 'ok' ? 'green' : 'red' }}>
      <h2>{notification.message}</h2>
    </div>
  );
};

export default Message;
