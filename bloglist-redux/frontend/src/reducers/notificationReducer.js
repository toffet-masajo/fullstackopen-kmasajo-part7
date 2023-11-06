import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
  name: 'notification',
  initialState: null,
  reducers: {
    setMessage(state, action) {
      return action.payload;
    },
    clearMessage() {
      return null;
    },
  },
});

export const { setMessage, clearMessage } = notificationSlice.actions;

export const setNotification = (payload, timeout) => {
  return async (dispatch) => {
    dispatch(setMessage(payload));
    setTimeout(() => dispatch(clearMessage()), timeout * 1000);
  };
};

export default notificationSlice.reducer;
