import axios from 'axios';

const API_BASE = 'https://localhost:7273/api/Category';

const getAuthHeader = () => {
  const token = localStorage.getItem('authToken');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

export const getCategories = async () => {
  try {
    const response = await axios.get(API_BASE, getAuthHeader());
    return response.data; // Ensure this returns an array of categories with `categoryID` and `categoryName`
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};