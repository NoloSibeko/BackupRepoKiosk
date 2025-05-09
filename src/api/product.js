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
  const token = localStorage.getItem('authToken');
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
export const createProduct = async (productData) => {
  const formData = new FormData();
  Object.keys(productData).forEach((key) => {
    if (productData[key] !== null && productData[key] !== undefined) {
      formData.append(key, productData[key]);
    }
  });

  const response = await api.post('/', formData);
  return response.data;
};

// Update a product
export const updateProduct = async (id, productData) => {
  const formData = new FormData();
  Object.keys(productData).forEach((key) => {
    if (productData[key] !== null && productData[key] !== undefined) {
      formData.append(key, productData[key]);
    }
  });

  const response = await api.put(`/${id}`, formData);
  return response.data;
};

// Toggle product availability
export const toggleProductAvailability = async (id, isAvailable) => {
  const response = await api.put(`/${id}/availability`, { isAvailable });
  return response.data;
};

export default {
  getProducts,
  createProduct,
  updateProduct,
  toggleProductAvailability, // Export this function
};