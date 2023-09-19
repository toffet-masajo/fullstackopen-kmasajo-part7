import axios from 'axios';
const baseUrl = '/api/users';

export const getUser = (id) => {
  return axios.get(`${baseUrl}/${id}`).then((response) => response.data);
};

export const getAllUsers = () => {
  return axios.get(baseUrl).then((response) => response.data);
};
