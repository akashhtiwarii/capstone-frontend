import React, { useState, useEffect } from 'react';
import { addFoodItem, updateFoodItem, deleteFoodItem, getCategories } from '../services/apiService';
import Popup from './Popup';  
import '../styles/FoodItemsView.css'; 
import { validateFoodItem } from './utils/validationSchema';
import { useNavigate } from 'react-router-dom';

const sampleImageUrl = 'https://via.placeholder.com/150'; 

const FoodItemsView = ({ foodItems, restaurantId, setFoodItems, fetchFoodItems }) => {
  const [newFoodItem, setNewFoodItem] = useState({ name: '', description: '', price: '', image: null, categoryId: '' });
  const [editingFoodId, setEditingFoodId] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [updatedFoodItem, setUpdatedFoodItem] = useState({});
  const [popupMessage, setPopupMessage] = useState('');  
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const user = localStorage.getItem('user');
  const parsedUser = JSON.parse(user);
  const userRole = parsedUser.role;
  const userId = parsedUser.userId;

  useEffect(() => {
    if (userRole !== 'OWNER') {
      localStorage.removeItem('user'); 
      navigate('/login'); 
      return;
    }
    const fetchCategoriesData = async () => {
      try {
        const data = await getCategories(restaurantId);
        setCategories(data);
      } catch (err) {
        
      }
    };

    fetchCategoriesData();
  }, [userRole, navigate, restaurantId]);

  const handleAddFoodItem = async () => {
    const validationErrors = validateFoodItem(newFoodItem);
    if (Object.keys(validationErrors).length > 0) {
      setPopupMessage(Object.values(validationErrors).join(', '));
      return;
    }
  
    try {
      const formData = new FormData();
      formData.append('loggedInOwnerId', userId);
      formData.append('categoryId', newFoodItem.categoryId); 
      formData.append('name', newFoodItem.name);
      formData.append('description', newFoodItem.description || '');
      formData.append('price', newFoodItem.price);
      if (newFoodItem.image) {
        formData.append('image', newFoodItem.image);
      }
      
      const response = await addFoodItem(formData);
      setPopupMessage(response.message || 'Food item added successfully');
      setNewFoodItem({ name: '', description: '', price: '', image: null, categoryId: '' });
      setIsAdding(false);
      fetchFoodItems();
    } catch (err) {
      const errorData = err.response?.data || {};
      if (typeof errorData === 'object') {
        const errorMessages = Object.values(errorData).join(', ');
        setPopupMessage(`${errorMessages}`);
      } else {
        setPopupMessage('An unexpected error occurred');
      }
    }
  };

  const handleUpdateFoodItem = async (foodId) => {
    const validationErrors = validateFoodItem(updatedFoodItem);
    if (Object.keys(validationErrors).length > 0) {
      setPopupMessage(Object.values(validationErrors).join(', '));
      return;
    }

    try {
      const formData = new FormData();
      formData.append('loggedInOwnerId', userId);
      formData.append('categoryId', updatedFoodItem.categoryId);
      formData.append('name', updatedFoodItem.name);
      formData.append('description', updatedFoodItem.description || '');
      formData.append('price', updatedFoodItem.price);
      if (updatedFoodItem.image) {
        formData.append('image', updatedFoodItem.image);
      }

      const response = await updateFoodItem(foodId, formData);
      setPopupMessage(response.message || 'Food item updated successfully');
      setEditingFoodId(null);
      fetchFoodItems();
    } catch (err) {
      const message = err.response?.data || 'Failed to update food item';
      setPopupMessage(message);
    }
  };

  const handleDeleteFoodItem = async (foodId) => {
    try {
      const response = await deleteFoodItem(userId, foodId);
      setPopupMessage(response.message || 'Food item deleted successfully');
      fetchFoodItems();
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to delete food item';
      setPopupMessage(message);
    }
  };

  return (
    <div className="food-items-view">
      <h3>Food Items</h3>
      <ul>
        {foodItems.map((food) => (
          <li key={food.foodId}>
            {editingFoodId === food.foodId ? (
              <div className="update-food-item-form">
                <input
                  type="text"
                  placeholder="Name"
                  value={updatedFoodItem.name || food.name}
                  onChange={(e) => setUpdatedFoodItem({ ...updatedFoodItem, name: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Description"
                  value={updatedFoodItem.description || food.description}
                  onChange={(e) => setUpdatedFoodItem({ ...updatedFoodItem, description: e.target.value })}
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={updatedFoodItem.price || food.price}
                  onChange={(e) => setUpdatedFoodItem({ ...updatedFoodItem, price: e.target.value })}
                />
                <input
                  type="file"
                  onChange={(e) => setUpdatedFoodItem({ ...updatedFoodItem, image: e.target.files[0] })}
                  accept="image/*"
                />
                <select
                  value={updatedFoodItem.categoryId || food.categoryId}
                  onChange={(e) => setUpdatedFoodItem({ ...updatedFoodItem, categoryId: e.target.value })}
                >
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category.categoryId} value={category.categoryId}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <button className="btn" onClick={() => handleUpdateFoodItem(food.foodId)}>Update</button>
                <button className="btn cancel" onClick={() => setEditingFoodId(null)}>Cancel</button>
              </div>
            ) : (
              <>
                <div className="food-info">
                  <span>{food.name}</span>
                  <p>{food.description}</p>
                  <span>₹{food.price.toFixed(2)}</span>
                  <img
                    src={food.image ? `data:image/jpeg;base64,${food.image}` : sampleImageUrl}
                    alt={food.name}
                    className="food-item-image"
                  />
                </div>
                <button className="btn" onClick={() => {
                  setEditingFoodId(food.foodId);
                  setUpdatedFoodItem(food);
                }}>Edit</button>
                <button className="btn delete" onClick={() => handleDeleteFoodItem(food.foodId)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
      {!isAdding ? (
        <button className="btn add" onClick={() => setIsAdding(true)}>Add Food Item</button>
      ) : (
        <div className="add-food-item-form">
          <input
            type="text"
            placeholder="Name"
            value={newFoodItem.name}
            onChange={(e) => setNewFoodItem({ ...newFoodItem, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Description"
            value={newFoodItem.description}
            onChange={(e) => setNewFoodItem({ ...newFoodItem, description: e.target.value })}
          />
          <input
            type="number"
            placeholder="Price"
            value={newFoodItem.price}
            onChange={(e) => setNewFoodItem({ ...newFoodItem, price: e.target.value })}
          />
          <input
            type="file"
            onChange={(e) => setNewFoodItem({ ...newFoodItem, image: e.target.files[0] })}
            accept="image/*"
          />
          <select
            value={newFoodItem.categoryId}
            onChange={(e) => setNewFoodItem({ ...newFoodItem, categoryId: e.target.value })}
          >
            <option value="">Select Category</option>
            {categories.map(category => (
              <option key={category.categoryId} value={category.categoryId}>
                {category.name}
              </option>
            ))}
          </select>
          <button className="btn" onClick={handleAddFoodItem}>Add</button>
          <button className="btn cancel" onClick={() => setIsAdding(false)}>Cancel</button>
        </div>
      )}
      <Popup message={popupMessage} onClose={() => setPopupMessage('')} />
    </div>
  );
};

export default FoodItemsView;
