import axios from 'axios';
const BASE_URL = 'https://localhost:7273/api/Product';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptor to include the JWT token in all requests
// Add JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwtToken');
  console.log('JWT token used for API:', token); 
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
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};



// Toggle product availability by ID
export const toggleProductAvailability = async (productId, isAvailable) => {
  const response = await api.put(`/mark-available/${productId}`, isAvailable, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
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
