import { createContext, useContext, useReducer } from 'react';

/* eslint-disable indent */
const messageReducer = (state, action) => {
  switch (action.type) {
    case 'NEW_MESSAGE':
      return action.payload;
    case 'CLEAR_MESSAGE':
      return {};
    default:
      return state;
  }
};

const NotificationContext = createContext();

export const NotificationContextProvider = (props) => {
  const [message, messageDispatch] = useReducer(messageReducer, '');

  return (
    <NotificationContext.Provider value={[message, messageDispatch]}>{props.children}</NotificationContext.Provider>
  );
};

export const useNotificationValue = () => {
  const notificationContext = useContext(NotificationContext);
  return notificationContext[0];
};

export const useNotificationDispatch = () => {
  const notificationContext = useContext(NotificationContext);
  return notificationContext[1];
};

export default NotificationContext;
