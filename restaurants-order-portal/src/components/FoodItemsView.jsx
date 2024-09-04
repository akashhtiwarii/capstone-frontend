import React, { useState } from 'react';
import { addFoodItem, updateFoodItem, deleteFoodItem } from '../services/apiService';
import '../styles/FoodItemsView.css'; // Import CSS

const FoodItemsView = ({ foodItems, restaurantId, setFoodItems, fetchFoodItems }) => {
  const [newFoodItem, setNewFoodItem] = useState({ name: '', description: '', price: '', image: null });
  const [editingFoodId, setEditingFoodId] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [updatedFoodItem, setUpdatedFoodItem] = useState({});
  const userId = localStorage.getItem('user');

  const handleAddFoodItem = async () => {
    try {
      await addFoodItem({ ...newFoodItem, restaurantId, userId });
      setNewFoodItem({ name: '', description: '', price: '', image: null });
      setIsAdding(false);
      fetchFoodItems();
    } catch (err) {
      console.error('Failed to add food item:', err);
    }
  };

  const handleUpdateFoodItem = async (foodId) => {
    try {
      await updateFoodItem(foodId, { ...updatedFoodItem, userId });
      setEditingFoodId(null);
      fetchFoodItems();
    } catch (err) {
      console.error('Failed to update food item:', err);
    }
  };

  const handleDeleteFoodItem = async (foodId) => {
    try {
      await deleteFoodItem(foodId);
      fetchFoodItems();
    } catch (err) {
      console.error('Failed to delete food item:', err);
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
                <button className="btn" onClick={() => handleUpdateFoodItem(food.foodId)}>Update</button>
                <button className="btn cancel" onClick={() => setEditingFoodId(null)}>Cancel</button>
              </>
            ) : (
              <>
                <div className="food-info">
                  <span>{food.name}</span>
                  <p>{food.description}</p>
                  <span>${food.price.toFixed(2)}</span>
                  {food.image && <img src={food.image} alt={food.name} />}
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
          <button className="btn" onClick={handleAddFoodItem}>Add</button>
          <button className="btn cancel" onClick={() => setIsAdding(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default FoodItemsView;
