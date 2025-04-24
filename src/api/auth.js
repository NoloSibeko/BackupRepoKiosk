import axios from 'axios';

const API_BASE_URL = 'https://localhost:7273/api/Auth'; // Updated to your backend URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptor to include token in requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const register = async (userData) => {
  try {
    const response = await api.post('/register', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.response?.data || 'Registration failed. Please try again.';
  }
};

export const login = async (credentials) => {
  try {
    const response = await api.post('/login', credentials);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.response?.data || 'Login failed. Please try again.';
  }
};

export const logout = () => {
  localStorage.removeItem('authToken');
};