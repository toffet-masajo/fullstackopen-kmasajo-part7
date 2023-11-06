import axios from 'axios';

const baseUrl = '/api/login';

const login = async (loginDetails) => {
  const { data } = await axios.post(baseUrl, loginDetails);
  return data;
};

export default login;
