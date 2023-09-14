import { createContext, useContext, useReducer } from 'react';

/* eslint-disable indent */
const userReducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER':
      return action.payload;
    default:
      return state;
  }
};

const UserContext = createContext();

export const UserContextProvider = (props) => {
  const [user, userDispatch] = useReducer(userReducer, null);

  return <UserContext.Provider value={[user, userDispatch]}>{props.children}</UserContext.Provider>;
};

export const useUserValue = () => {
  const userContext = useContext(UserContext);
  return userContext[0];
};

export const useUserDispatch = () => {
  const userContext = useContext(UserContext);
  return userContext[1];
};

export default UserContext;
