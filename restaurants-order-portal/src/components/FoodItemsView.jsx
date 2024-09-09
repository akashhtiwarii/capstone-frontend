import React, { useState } from 'react';
import { addFoodItem, updateFoodItem, deleteFoodItem } from '../services/apiService';
import Popup from './Popup';  
import '../styles/FoodItemsView.css'; 
import { validateFoodItem } from './utils/validationSchema';

const sampleImageUrl = 'https://via.placeholder.com/150'; 

const FoodItemsView = ({ foodItems, restaurantId, setFoodItems, fetchFoodItems }) => {
  const [newFoodItem, setNewFoodItem] = useState({ name: '', description: '', price: '', image: null });
  const [editingFoodId, setEditingFoodId] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [updatedFoodItem, setUpdatedFoodItem] = useState({});
  const [popupMessage, setPopupMessage] = useState('');  
  const user = localStorage.getItem('user');
  const parsedUser = JSON.parse(user);
  const userId = parsedUser.userId;

  const handleAddFoodItem = async () => {
    const validationErrors = validateFoodItem(newFoodItem);
    if (Object.keys(validationErrors).length > 0) {
      alert(Object.values(validationErrors).join('\n'));
      return;
    }
  
    try {
      const formData = new FormData();
      formData.append('foodItem.loggedInOwnerId', userId);
      formData.append('foodItem.categoryId', restaurantId); 
      formData.append('foodItem.name', newFoodItem.name);
      formData.append('foodItem.description', newFoodItem.description || '');
      formData.append('foodItem.price', newFoodItem.price);
      if (newFoodItem.image) {
        formData.append('image', newFoodItem.image);
      }
      
      const response = await addFoodItem(formData);
      setPopupMessage(response.message || 'Food item added successfully');
      setNewFoodItem({ name: '', description: '', price: '', image: null });
      setIsAdding(false);
      fetchFoodItems();
    } catch (err) {
      const message = err && err.data && err.data.message 
        ? err.data.message 
        : 'Failed to add food item';
      setPopupMessage(message);
    }
  };
  

  const handleUpdateFoodItem = async (foodId) => {
    const validationErrors = validateFoodItem(updatedFoodItem);
    if (Object.keys(validationErrors).length > 0) {
      alert(Object.values(validationErrors).join('\n'));
      return;
    }

    try {
      const formData = new FormData();
      formData.append('loggedInOwnerId', userId);
      formData.append('name', updatedFoodItem.name);
      formData.append('description', updatedFoodItem.description || '');
      formData.append('price', updatedFoodItem.price);
      formData.append('userId', userId);
      if (updatedFoodItem.image) {
        formData.append('image', updatedFoodItem.image);
      }

      const response = await updateFoodItem(foodId, formData);
      setPopupMessage(response.message || 'Food item updated successfully');
      setEditingFoodId(null);
      fetchFoodItems();
    } catch (err) {
      const message = err.response && err.response.data && err.response.data.message 
        ? err.response.data.message 
        : 'Failed to update food item';
      setPopupMessage(message);
    }
  };

  const handleDeleteFoodItem = async (foodId) => {
    try {
      const response = await deleteFoodItem(foodId);
      setPopupMessage(response.message || 'Food item deleted successfully');
      fetchFoodItems();
    } catch (err) {
      const message = err.response && err.response.data && err.response.data.message 
        ? err.response.data.message 
        : 'Failed to delete food item';
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
              <>
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
                <button className="btn" onClick={() => handleUpdateFoodItem(food.foodId)}>Update</button>
                <button className="btn cancel" onClick={() => setEditingFoodId(null)}>Cancel</button>
              </>
            ) : (
              <>
                <div className="food-info">
                  <span>{food.name}</span>
                  <p>{food.description}</p>
                  <span>${food.price.toFixed(2)}</span>
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
          <button className="btn" onClick={handleAddFoodItem}>Add</button>
          <button className="btn cancel" onClick={() => setIsAdding(false)}>Cancel</button>
        </div>
      )}
      <Popup message={popupMessage} onClose={() => setPopupMessage('')} />
    </div>
  );
};

export default FoodItemsView;
