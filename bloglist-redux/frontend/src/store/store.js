import { configureStore } from '@reduxjs/toolkit';

import blogReducer from '../reducers/blogReducer';
import notificationReducer from '../reducers/notificationReducer';
import userReducer from '../reducers/userReducer';
import userListReducer from '../reducers/userListReducer';

const store = configureStore({
  reducer: {
    blogs: blogReducer,
    notification: notificationReducer,
    user: userReducer,
    userlist: userListReducer,
  },
});

export default store;
