import axios from 'axios';

const BASE_URL = 'https://localhost:7273/api/Product';

// Axios instance with Authorization header
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptor to include the JWT token in all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken'); // double-check the key
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Get all products
export const getProducts = async () => {
  const response = await api.get('/');
  return response.data;
};

// Create a product
export const createProduct = async (formData) => {
  return await api.post('/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// Update a product by ID (not name)
export const updateProduct = async (productId, formData) => {
  return await api.put(`/${productId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// Toggle product availability by ID
export const toggleProductAvailability = async (productId, isAvailable) => {
  const response = await api.put(`/${productId}/availability`, { isAvailable });
  return response.data;
};

// Delete a product by ID
export const deleteProduct = async (productId) => {
  const response = await api.delete(`/${productId}`);
  return response.data;
};

export default {
  getProducts,
  createProduct,
  updateProduct,
  toggleProductAvailability,
  deleteProduct,
};
