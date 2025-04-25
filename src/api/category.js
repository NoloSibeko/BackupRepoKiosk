import axios from 'axios';

const API_BASE = 'https://localhost:7273/Category';

export const getCategories = async () => {
  try {
    const response = await axios.get(`${API_BASE}/Category`);
    return response.data;
  } catch (err) {
    console.error('Error fetching categories:', err);
    return [];
  }
};
