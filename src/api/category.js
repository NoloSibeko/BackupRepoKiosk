import axios from 'axios';
const BASE_URL = 'https://localhost:7273/api/Category';



// Fetch all categories
export const getCategories = async () => {
  try {
    const response = await fetch(`${BASE_URL}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

// Add a new category (POST /api/Category)
export const addCategory = async ({ name }) => {
  try {
    const payload = { Name: name };

    const response = await axios.post('https://localhost:7273/api/Category', payload, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error adding category:', error.response?.data || error.message);
    throw error;
  }
};



export const getCategoryWithProducts = async (categoryName, setProducts) => {
  try {
    const response = await fetch(`https://localhost:7273/api/product/byCategory?name=${categoryName}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch');
    }

    //  This is now defined because we passed it in
    setProducts(data);
    return data;
  } catch (error) {
    console.error('Error fetching category with products:', error);
    throw error;
  }
};

