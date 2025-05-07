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
  const response = await fetch(`${BASE_URL}`, {
    method: 'GET',
    headers: getAuthHeader().headers,
  });

  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }

  return await response.json();
};

export const createProduct = async (productData) => {
  const formData = new FormData();
  formData.append('name', productData.name);
  formData.append('description', productData.description);
  formData.append('price', productData.price);
  formData.append('quantity', productData.quantity);
  formData.append('categoryId', productData.categoryId);
  if (productData.image) {
    formData.append('image', productData.image);
  }

  const response = await fetch(`${BASE_URL}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('authToken')}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create product');
  }

  return await response.json();
};

export const updateProduct = async (id, productData) => {
  const formData = new FormData();
  formData.append('name', productData.name);
  formData.append('description', productData.description);
  formData.append('price', productData.price);
  formData.append('quantity', productData.quantity);
  formData.append('categoryId', productData.categoryId);
  if (productData.image) {
    formData.append('image', productData.image);
  }

  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: getAuthHeader().headers, // Include auth header
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to update product');
  }

  return await response.json();
};

export const deleteProduct = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete product');
    }

    // Nothing is returned for a successful delete 
    return true;
  } catch (error) {
    console.error('Error in deleteProduct:', error);
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