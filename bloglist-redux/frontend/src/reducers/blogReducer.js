import { createSlice } from '@reduxjs/toolkit';

import blogService from '../services/blogs';
import { setNotification } from './notificationReducer';
import { addNewBlogToUser, removeBlogFromUser } from './userListReducer';

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

    addComment(state, action) {
      const { blogId, comment } = action.payload;
      return state.map((blog) => (blog.id === blogId ? { ...blog, comments: blog.comments.concat(comment) } : blog));
    },

    setBlogs(state, action) {
      return action.payload;
    },
  },
});

export const { addBlog, deleteBlog, likeBlog, addComment, setBlogs } = blogSlice.actions;

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
      dispatch(addNewBlogToUser({ ...data }));
      data.user = { username: user.username, name: user.name, id: data.user };
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

export const addBlogComment = ({ blogId, comment }) => {
  return async (dispatch) => {
    try {
      const data = await blogService.addComment({ blogId, content: comment });
      dispatch(addComment({ blogId, comment: data }));
    } catch (error) {
      dispatch(setNotification({ message: error.response.data.error, type: 'ng' }, 5));
    }
  };
};

export const removeBlog = (blog) => {
  return async (dispatch) => {
    try {
      const { id, user } = blog;
      await blogService.deleteBlog(id);
      dispatch(deleteBlog(id));
      dispatch(removeBlogFromUser({ blogId: id, userId: user.id }));
      dispatch(setNotification({ message: 'blog deleted', type: 'ok' }, 5));
    } catch (error) {
      dispatch(setNotification({ message: error.response.data.error, type: 'ng' }, 5));
    }
  };
};

export default blogSlice.reducer;
