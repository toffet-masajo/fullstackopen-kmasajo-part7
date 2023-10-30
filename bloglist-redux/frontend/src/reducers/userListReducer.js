import { createSlice } from '@reduxjs/toolkit';
import { getAllUsers } from '../services/users';

const userListSlice = createSlice({
  name: 'userlist',
  initialState: [],
  reducers: {
    setList(state, action) {
      return action.payload;
    },
    clearList() {
      return [];
    },
  },
});

export const { setList, clearList } = userListSlice.actions;

export const getUserList = () => {
  return async (dispatch) => {
    const data = await getAllUsers();
    dispatch(setList(data));
  };
};

export const clearUserList = () => {
  return async (dispatch) => {
    dispatch(clearList());
  };
};

export default userListSlice.reducer;
