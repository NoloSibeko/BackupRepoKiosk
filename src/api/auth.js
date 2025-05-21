import axios from 'axios';

const API_BASE_URL = 'https://localhost:7273/api/Auth';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptor to include token in requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwtToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Register user and persist details
export const register = async (userData) => {
  try {
    const response = await api.post('/register', userData);
    const user = response.data.user;
    console.log('API user object:', user);
    if (response.data.token && user) {
      localStorage.setItem('jwtToken', response.data.token);
      localStorage.setItem('userInfo', JSON.stringify(user));
      localStorage.setItem('userId', user.userID);
      localStorage.setItem('roleId', user.roleID);
      localStorage.setItem('userRole', user.role);
      localStorage.setItem('userName', user.name);
      // Log who is registered in
      console.log(
        `Registered and logged in as: ${user.name} (UserID: ${user.userID}, Role: ${user.role})`
      );
      // Log the generated token
      console.log('JWT Token:', response.data.token);
    }
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.response?.data || 'Registration failed. Please try again.';
  }
};

export const handleLogin = async (credentials) => {
  try {
    const response = await api.post('/login', credentials);
    const user = response.data.user;
    console.log('API user object:', user);
    if (response.data.token && user) {
      localStorage.setItem('jwtToken', response.data.token);
      localStorage.setItem('userInfo', JSON.stringify(user));
      localStorage.setItem('userId', user.userID);
      localStorage.setItem('roleId', user.roleID);
      localStorage.setItem('userRole', user.role);
      localStorage.setItem('userName', user.name);
      // Log who is logged in
      console.log(
        `Logged in as: ${user.name} (UserID: ${user.userID}, Role: ${user.role})`
      );
      // Log the generated token
      console.log('JWT Token:', response.data.token);
    }
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Login failed. Please try again.';
  }
};

// Logout and clear all persisted user details
export const logout = () => {
  localStorage.removeItem('jwtToken');
  localStorage.removeItem('userInfo');
  localStorage.removeItem('userId');
  localStorage.removeItem('roleId');
  localStorage.removeItem('userRole');
  localStorage.removeItem('userName');
};

// Helper functions to get persisted user details
export const getCurrentUserId = () => localStorage.getItem('userId');
export const getUserId = () => localStorage.getItem('userId');
export const getCurrentRoleId = () => localStorage.getItem('roleId');
export const getCurrentUserName = () => localStorage.getItem('userName');
export const getCurrentUserRole = () => localStorage.getItem('userRole');
export const getToken = () => localStorage.getItem('jwtToken');

// Optionally, get the full user object
export const getCurrentUser = () => {
  const userInfo = localStorage.getItem('userInfo');
  return userInfo ? JSON.parse(userInfo) : null;
};

// Example: check if user is superuser (customize as needed)
export const isSuperuser = () => {
  const user = getCurrentUser();
  return user?.Role === 'Superuser' || user?.RoleID === 2;
};