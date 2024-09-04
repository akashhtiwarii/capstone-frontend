import React, { useState } from 'react';
import { addCategory, updateCategory, deleteCategory } from '../services/apiService';
import Popup from './Popup'; 
import '../styles/CategoriesView.css'; 

const CategoriesView = ({ categories, restaurantId, setCategories, fetchCategories }) => {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [updatedCategoryName, setUpdatedCategoryName] = useState('');
  const [popupMessage, setPopupMessage] = useState('');  
  const user = localStorage.getItem('user');
  const parsedUser = JSON.parse(user);
  const userId = parsedUser.userId;

  const handleAddCategory = async () => {
    try {
      const response = await addCategory({ userId, restaurantId, name: newCategoryName });
      setPopupMessage(response.message || 'Category added successfully');
      setNewCategoryName('');
      setIsAdding(false);
      fetchCategories();
    } catch (err) {
      const message = err.response && err.response.data && err.response.data.message 
        ? err.response.data.message 
        : 'Failed to add category';
      setPopupMessage(message);
    }
  };

  const handleUpdateCategory = async (categoryId) => {
    try {
      const response = await updateCategory(categoryId, { userId: userId, name: updatedCategoryName });
      setPopupMessage(response.message || 'Category updated successfully');
      setEditingCategoryId(null);
      fetchCategories();
    } catch (err) {
      const message = err.response && err.response.data && err.response.data.message 
        ? err.response.data.message 
        : 'Failed to update category';
      setPopupMessage(message);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      const response = await deleteCategory(categoryId);
      setPopupMessage(response.message || 'Category deleted successfully');
      fetchCategories();
    } catch (err) {
      const message = err.response && err.response.data && err.response.data.message 
        ? err.response.data.message 
        : 'Failed to delete category';
      setPopupMessage(message);
    }
  };

  return (
    <div className="categories-view">
      <h3>Categories</h3>
      <ul>
        {categories.map((category) => (
          <li key={category.categoryId}>
            {editingCategoryId === category.categoryId ? (
              <>
                <input
                  type="text"
                  value={updatedCategoryName}
                  onChange={(e) => setUpdatedCategoryName(e.target.value)}
                />
                <button className="btn" onClick={() => handleUpdateCategory(category.categoryId)}>Update</button>
                <button className="btn cancel" onClick={() => setEditingCategoryId(null)}>Cancel</button>
              </>
            ) : (
              <>
                <span>{category.name}</span>
                <button className="btn" onClick={() => {
                  setEditingCategoryId(category.categoryId);
                  setUpdatedCategoryName(category.name);
                }}>Edit</button>
                <button className="btn delete" onClick={() => handleDeleteCategory(category.categoryId)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
      {!isAdding ? (
        <button className="btn add" onClick={() => setIsAdding(true)}>Add Category</button>
      ) : (
        <div className="add-category-form">
          <input
            type="text"
            placeholder="New Category Name"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
          />
          <button className="btn" onClick={handleAddCategory}>Add</button>
          <button className="btn cancel" onClick={() => setIsAdding(false)}>Cancel</button>
        </div>
      )}
      <Popup message={popupMessage} onClose={() => setPopupMessage('')} />
    </div>
  );
};

export default CategoriesView;
