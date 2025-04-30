import axios from 'axios';

const BASE_URL = 'https://localhost:7273/api/Product';

const getAuthHeader = () => {
  const token = localStorage.getItem('authToken');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

// Get all products
export const getProducts = async () => {
  try {
    const response = await axios.get(BASE_URL, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

// Create new product
export const createProduct = async (productData) => {
  try {
    const response = await axios.post(BASE_URL, productData, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

// Update existing product
export const updateProduct = async (id, productData) => {
  try {
    const response = await axios.put(`${BASE_URL}/${id}`, productData, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

// Delete product
export const deleteProduct = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}/${id}`, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

// Make sure all exports are included
export default {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct
};