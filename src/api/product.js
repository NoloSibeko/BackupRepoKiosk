import axios from 'axios';

const BASE_URL = 'https://localhost:7273/api/Product';

export const getAllProducts = async () => {
  const token = localStorage.getItem('authToken');
  return axios.get(BASE_URL, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const createProduct = async (productData) => {
  const token = localStorage.getItem('authToken');
  return axios.post(BASE_URL, productData, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const deleteProduct = async (id) => {
  const token = localStorage.getItem('authToken');
  return axios.delete(`${BASE_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};
