import axios from 'axios';

const apiUrl = 'https://localhost:7273/api/Cart';
const api = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getCart = async (userId) => {
  const response = await axios.get(`${apiUrl}/${userId}`);
  return response.data; // returns the cart object, not an array!
};

export const addToCart = async ({ userID, productID, quantity }) => {
  const response = await axios.post(`${apiUrl}/add`, {
    userID,
    productID,
    quantity,
  });
  return response.data;
};

export const updateCartItem = async (itemId, itemDto) => {
  const response = await axios.put(`${apiUrl}/update/${itemId}`, itemDto);
  return response.data;
};

export const removeFromCart = async (itemId) => {
  const response = await axios.delete(`${apiUrl}/remove/${itemId}`);
  return response.data;
};

export const checkoutCart = async (userId, orderDetails) => {
    const response = await fetch(`https://localhost:7273/api/Cart/checkout/${userId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', // Specify the content type
            'Accept': 'application/json',
        },
        body: JSON.stringify(orderDetails), // Convert the order details to JSON
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
};