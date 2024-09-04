import React, { useState } from 'react';
import { addCategory, updateCategory, deleteCategory } from '../services/apiService';
import '../styles/CategoriesView.css'; // Import CSS

const CategoriesView = ({ categories, restaurantId, setCategories, fetchCategories }) => {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [updatedCategoryName, setUpdatedCategoryName] = useState('');
  const userId = localStorage.getItem('user');

  const handleAddCategory = async () => {
    try {
      await addCategory({ userId, restaurantId, name: newCategoryName });
      setNewCategoryName('');
      setIsAdding(false);
      fetchCategories();
    } catch (err) {
      console.error('Failed to add category:', err);
    }
  };

  const handleUpdateCategory = async (categoryId) => {
    try {
      await updateCategory(categoryId, { userId, name: updatedCategoryName });
      setEditingCategoryId(null);
      fetchCategories();
    } catch (err) {
      console.error('Failed to update category:', err);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      await deleteCategory(categoryId);
      fetchCategories();
    } catch (err) {
      console.error('Failed to delete category:', err);
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
    </div>
  );
};

export default CategoriesView;
