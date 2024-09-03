import axios from 'axios';

const USER_API_URL = 'http://localhost:8081/user';
const RESTAURANT_API_URL = 'http://localhost:8080';

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${USER_API_URL}/register`, userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const loginUser = async (userData) => {
  try {
    const response = await axios.post(`${USER_API_URL}/login`, userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getRestaurantsByOwner = async (ownerId) => {
  try {
    const response = await axios.post(`${RESTAURANT_API_URL}/restaurant/owner`, { ownerId });
    return response.data;
  } catch (err) {
    throw err;
  }
};

export const getAllRestaurants = async () => {
  try {
    const response = await axios.get(`${RESTAURANT_API_URL}/restaurant/all`);
    return response.data;
  } catch (err) {
    throw err;
  }
};
