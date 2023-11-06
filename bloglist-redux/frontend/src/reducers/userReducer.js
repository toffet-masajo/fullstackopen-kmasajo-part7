import { createSlice } from '@reduxjs/toolkit';

import loginService from '../services/login';
import blogService from '../services/blogs';

import { initializeBlogs } from './blogReducer';
import { setNotification } from './notificationReducer';
import { clearList, getUserList } from './userListReducer';

const userSlice = createSlice({
  name: 'user',
  initialState: null,
  reducers: {
    setUser(state, action) {
      return action.payload;
    },
    clearUser() {
      return null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;

export const userLogin = ({ username, password }) => {
  return async (dispatch) => {
    try {
      const loggedUser = await loginService.login({ username, password });

      window.localStorage.setItem('loggedUser', JSON.stringify(loggedUser));
      blogService.setToken(loggedUser.token);
      dispatch(setUser(loggedUser));
      dispatch(initializeBlogs());
      dispatch(getUserList());
    } catch (error) {
      dispatch(setNotification({ message: 'wrong username or password', type: 'ng' }, 5));
    }
  };
};

export const userLogout = () => {
  return (dispatch) => {
    window.localStorage.removeItem('loggedUser');
    dispatch(clearUser());
    dispatch(clearList());
  };
};

export default userSlice.reducer;
