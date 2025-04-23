import axios from 'axios';

const API_URL = 'https://localhost:port/api/Auth'; // Replace `port` with backend port

export const registerUser = async (userData) => {
  return axios.post(`${API_URL}/register`, userData);
};

export const loginUser = async (userData) => {
  return axios.post(`${API_URL}/login`, userData);
};
