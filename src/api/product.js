import axios from 'axios';

const BASE_URL = 'https://localhost:7273/api/Product';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptor to include the JWT token in all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwtToken');
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

// Create a new product
export const createProduct = async (formData) => {
  return await api.post('/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// Update a product
export const updateProduct = async (productId, data) => {
  const payload = new FormData();
  payload.append('name', data.name);
  payload.append('description', data.description || '');
  payload.append('price', data.price);
  payload.append('quantity', data.quantity);
  payload.append('categoryID', data.categoryID);

  if (data.imageFile) {
    payload.append('image', data.imageFile);
  }

  return await api.put(`/${productId}`, payload, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// Toggle product availability
export const toggleProductAvailability = async (productId) => {
  const response = await api.put(`/mark-available/${productId}`);
  return response.data;
};

// Delete product
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
