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

export const getCategoriesByRestaurant = async (restaurantId) => {
  try {
    const response = await axios.get(`${RESTAURANT_API_URL}/restaurant/categories/${restaurantId}`);
    return response.data;
  } catch (err) {
    throw err;
  }
};

export const getFoodItemsByRestaurant = async (restaurantId) => {
  try {
    const response = await axios.get(`${RESTAURANT_API_URL}/restaurant/restaurantfood/${restaurantId}`);
    return response.data;
  } catch (err) {
    throw err;
  }
};

export const getRestaurantDetails = async (restaurantId) => {
  try {
    const response = await axios.get(`${RESTAURANT_API_URL}/restaurant/${restaurantId}`);
    return response.data;
  } catch (err) {
    throw err;
  }
};

export const addRestaurant = async (formData) => {
  try {
    const response = await axios.post(`${RESTAURANT_API_URL}/restaurant/add`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (err) {
    throw err;
  }
};

export const getCategories = async (restaurantId) => {
  const response = await axios.get(`http://localhost:8080/restaurant/categories/${restaurantId}`);
  return response.data;
};

export const addCategory = async (category) => {
  const response = await axios.post('http://localhost:8080/restaurant/categories/add', category);
  return response.data;
};

export const updateCategory = async (categoryId, category) => {
  const response = await axios.put(`http://localhost:8080/restaurant/categories/update/${categoryId}`, category);
  return response.data;
};

export const deleteCategory = async (categoryId) => {
  const response = await axios.delete(`http://localhost:8080/restaurant/categories/delete/${categoryId}`);
  return response.data;
};

export const getFoodItems = async (restaurantId) => {
  const response = await axios.get(`${RESTAURANT_API_URL}/restaurant/restaurantfood/${restaurantId}`);
  return response.data;
};

export const addFoodItem = async (foodItem) => {
  const response = await axios.post(`${RESTAURANT_API_URL}/restaurant/food/add`, foodItem);
  return response.data;
};

export const updateFoodItem = async (foodId, foodItem) => {
  const response = await axios.put(`${RESTAURANT_API_URL}/restaurant/food/update/${foodId}`, foodItem);
  return response.data;
};

export const deleteFoodItem = async (foodId) => {
  const response = await axios.delete(`${RESTAURANT_API_URL}/restaurant/food/delete/${foodId}`);
  return response.data;
};