// src/api/transaction.js

import axios from "axios";

const BASE_URL = "https://localhost:7273/api";

export const getUserTransactions = async (userId) => {
  try {
    const response = await axios.get(`${BASE_URL}/Transaction/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch transactions:", error);
    throw error;
  }
};
