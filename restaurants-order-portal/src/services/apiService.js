import axios from 'axios';

const USER_API_URL = 'http://localhost:8081/user';
const RESTAURANT_API_URL = 'http://localhost:8080';
const ORDER_API_URL = 'http://localhost:8082';


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

export const getAddressList = async (userId) => {
  try {
    const response = await axios.get(`${USER_API_URL}/address`, {
      params: { userId },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const deleteAddress = async (userId, addressId) => {
  try {
    const response = await axios.delete(`${USER_API_URL}/address/delete`, {
      params: { userId, addressId },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateAddress = async (addressData) => {
  try {
    const response = await axios.put(`${USER_API_URL}/address/update`, addressData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const addAddress = async (addressData) => {
  try {
    const response = await axios.post(`${USER_API_URL}/address/add`, addressData);
    return response.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};


export const rechargeWallet = async (userId, amount) => {
  try {
    const response = await axios.put(`${USER_API_URL}/wallet/recharge`, null, {
      params: { userId, amount },
    });
    return response.data;
  } catch (err) {
    throw err;
  }
};

export const getUserProfile = async (userId) => {
  try {
    const response = await axios.get(`http://localhost:8081/user/profile`, {
    params: { userId }
  });
  return response.data;
  } catch (err) {
    throw err;
  }
};

export const updateUserProfile = async (userId, profileData) => {
  try {
    const response = await axios.put(`${USER_API_URL}/profile/update`, profileData, {
      params: { userId },
    });
    return response.data;
  } catch (err) {
    throw err;
  }
};

export const getRestaurantsByOwner = async (ownerId) => {
  try {
    const response = await axios.get(`${RESTAURANT_API_URL}/restaurant/owner`, {
      params: { ownerId }
    });
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


export const addFoodItem = async (formData) => {
  try {
    const response = await axios.post('http://localhost:8080/restaurant/food/add', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (err) {
    throw err.response;
  }
};

export const updateFoodItem = async (foodId, formData) => {
  try {
    const response = await axios.put(`${RESTAURANT_API_URL}/restaurant/food/update/${foodId}`, formData);
    return response.data;
  } catch (err) {
    throw err;
  }
};

export const deleteFoodItem = async (userId, foodId) => {
  try {
    const response = await axios.delete(`${RESTAURANT_API_URL}/restaurant/food/delete`,{
      params: {userId, foodId}
    });
    return response.data;
  } catch (err) {
    throw err;
  }
};

export const getRestaurantOrders = async (restaurantId) => {
  try {
    const response = await axios.get(`http://localhost:8082/order/restaurantId`, {
      params: {restaurantId}
    });
    return response.data;
  } catch (err) {
    throw err;
  }
};

export const getCartItems = async (userId) => {
  try {
    const response = await axios.get(`${ORDER_API_URL}/order/mycart`, {
      params: { userId },
    });
    return response.data;
  } catch (err) {
    if (err.response) {
      throw err.response.data;
    }
    throw err;
  }
};

export const getUserOrders = async (userId) => {
  const response = await axios.get(`http://localhost:8082/order/user/orders`, {
    params: { userId },
  });
  return response.data;
};

export const deleteCartItemById = async (cartItemId) => {
  try {
    const response = await axios.delete(`http://localhost:8082/order/cart/delete`, {
      params: { cartItemId },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};


export const updateCartItemQuantity = async (cartItemId, delta) => {
  try {
    console.log(cartItemId);
    console.log(delta)
    const response = await axios.put(`http://localhost:8082/order/cart/update`, null, {
      params: { cartItemId, delta },
    });
    return response.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

export const placeOrder = async (userId, addressId) => {
  try {
    const response = await axios.post(`${ORDER_API_URL}/order/add`, null, {
      params: { userId, addressId },
    });
    return response.data;
  } catch (err) {
    if (err.response) {
      throw err.response.data;
    }
    throw err;
  }
};


export const cancelOrder = async (orderId) => {
  try {
    const response = await axios.put(`${ORDER_API_URL}/order/cancel`, null, {
      params: { orderId },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateOrderStatus = async ({ ownerId, orderId, status }) => {
  console.log(orderId)
  console.log(ownerId)
  console.log(status)
  const response = await axios.put('http://localhost:8082/order/update', null, {
    params: { ownerId, orderId, status },
  });
  return response.data;
};

export const updateRestaurant = async (formData) => {
  try {
    const response = await axios.put(`${RESTAURANT_API_URL}/restaurant/update`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (err) {
    throw err;
  }
};