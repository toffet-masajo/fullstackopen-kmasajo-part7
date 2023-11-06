import { createSlice } from '@reduxjs/toolkit';
import { getAllUsers } from '../services/users';

const userListSlice = createSlice({
  name: 'userlist',
  initialState: [],
  reducers: {
    addUserBlog(state, action) {
      const { userId, blog } = action.payload;
      return state.map((user) => (user.id === userId ? { ...user, blogs: user.blogs.concat(blog) } : user));
    },

    removeUserBlog(state, action) {
      const { blogId, userId } = action.payload;
      return state.map((user) =>
        user.id === userId ? { ...user, blogs: user.blogs.filter((blog) => blog.id !== blogId) } : user
      );
    },

    setList(state, action) {
      return action.payload;
    },

    clearList() {
      return [];
    },
  },
});

export const { addUserBlog, removeUserBlog, setList, clearList } = userListSlice.actions;

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

export const addNewBlogToUser = (blog) => {
  return async (dispatch) => {
    const userId = blog.user;
    delete blog.user;
    dispatch(addUserBlog({ userId, blog }));
  };
};

export const removeBlogFromUser = ({ blogId, userId }) => {
  return async (dispatch) => {
    dispatch(removeUserBlog({ blogId, userId }));
  };
};

export default userListSlice.reducer;
