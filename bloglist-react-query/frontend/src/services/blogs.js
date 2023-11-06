import axios from 'axios';
const baseUrl = '/api/blogs';

let token = null;

export const createBlog = async (newBlog) => {
  const config = {
    headers: { Authorization: token },
  };

  const { data } = await axios.post(baseUrl, newBlog, config);
  return data;
};

export const updateBlog = async ({ author, title, url, likes, user, id }) => {
  const config = {
    headers: { Authorization: token },
  };

  const blogObject = {
    author,
    title,
    url,
    likes: likes + 1,
    user: user.id,
  };

  const { data } = await axios.put(`${baseUrl}/${id}`, blogObject, config);
  return data;
};

export const deleteBlog = async (id) => {
  const config = {
    headers: { Authorization: token },
  };

  const { data } = await axios.delete(`${baseUrl}/${id}`, config);
  return data ? data : id;
};

export const getAllBlogs = () => {
  return axios.get(baseUrl).then((response) => response.data);
};

export const getBlog = (id) => {
  return axios.get(`${baseUrl}/${id}`).then((response) => response.data);
};

export const addComment = ({ blogId, content }) => {
  return axios.post(`${baseUrl}/${blogId}/comments`, { blogId, content }).then((response) => response.data);
};

export const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};
