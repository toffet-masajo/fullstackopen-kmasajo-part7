import { createSlice } from '@reduxjs/toolkit';
import blogService from '../services/blogs';
import { setNotification } from './notificationReducer';

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    addBlog(state, action) {
      return state.concat(action.payload);
    },

    deleteBlog(state, action) {
      return state.filter((blog) => blog.id !== action.payload);
    },

    likeBlog(state, action) {
      return state.map((blog) => (blog.id === action.payload ? { ...blog, likes: blog.likes + 1 } : blog));
    },

    setBlogs(state, action) {
      return action.payload;
    },
  },
});

export const { addBlog, deleteBlog, likeBlog, setBlogs } = blogSlice.actions;

export const initializeBlogs = () => {
  return async (dispatch) => {
    const data = await blogService.getAll();
    dispatch(setBlogs(data));
  };
};

export const createNewBlog = (newBlog, user) => {
  return async (dispatch) => {
    try {
      const data = await blogService.createBlog(newBlog);
      data.user = { username: user.username, name: user.name };
      dispatch(addBlog(data));
      dispatch(setNotification({ message: `a new blog ${newBlog.title} by ${newBlog.author} added`, type: 'ok' }, 5));
    } catch (error) {
      console.log(error);
      dispatch(setNotification({ message: error.response.data.error, type: 'ng' }, 5));
    }
  };
};

export const addBlogLike = (updatedBlog) => {
  return async (dispatch) => {
    try {
      const data = await blogService.updateBlog(updatedBlog);
      dispatch(likeBlog(data.id));
    } catch (error) {
      dispatch(setNotification({ message: error.response.data.error, type: 'ng' }, 5));
    }
  };
};

export const removeBlog = (blogId) => {
  return async (dispatch) => {
    try {
      await blogService.deleteBlog(blogId);
      dispatch(deleteBlog(blogId));
      dispatch(setNotification({ message: 'blog deleted', type: 'ok' }, 5));
    } catch (error) {
      dispatch(setNotification({ message: error.response.data.error, type: 'ng' }, 5));
    }
  };
};

export default blogSlice.reducer;
