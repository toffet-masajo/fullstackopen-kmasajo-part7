import { Alert } from '@mui/material';
import { useSelector } from 'react-redux';

const Message = () => {
  const notification = useSelector((state) => state.notification);

  if (notification === null) return null;

  return <Alert severity={notification.type === 'ok' ? 'success' : 'error'}>{notification.message}</Alert>;
};

export default Message;
