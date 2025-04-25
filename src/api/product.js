import axios from 'axios';

const BASE_URL = 'https://localhost:7273/api/Product';

export const getAllProducts = async () => {
  const token = localStorage.getItem('authToken');
  const response = await axios.get(BASE_URL, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data; 
};


export const createProduct = async (productData) => {
  const token = localStorage.getItem('authToken');

  const formData = new FormData();
  formData.append('name', productData.name);
  formData.append('description', productData.description);
  formData.append('price', productData.price);
  if (productData.image) {
    formData.append('image', productData.image);
  }

  return axios.post('https://localhost:7273/api/Product', formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    }
  });
};


export const deleteProduct = async (id) => {
  const token = localStorage.getItem('authToken');
  return axios.delete(`${BASE_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};
