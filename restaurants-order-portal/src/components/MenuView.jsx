import React, { useEffect, useState } from 'react';
import '../styles/MenuView.css';
import { getFoodItemsByRestaurant, getCategoriesByRestaurant } from '../services/apiService';
import Popup from './Popup';

const MenuView = ({ restaurantId }) => {
  const [categories, setCategories] = useState([]);
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const categoryData = await getCategoriesByRestaurant(restaurantId);
        const foodData = await getFoodItemsByRestaurant(restaurantId);

        setCategories(categoryData);
        setFoodItems(foodData);
      } catch (err) {
        setErrorMessage('Menu Empty');
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuData();
  }, [restaurantId]);

  const handleClosePopup = () => {
    setError(false);
    setErrorMessage('');
  };

  if (loading) {
    return <p>Loading menu...</p>;
  }

  return (
    <div className="menu-view">
      {categories.map((category) => (
        <div key={category.categoryId} className="category-section">
          <h2>{category.name}</h2>
          <ul className="food-item-list">
            {foodItems
              .filter((food) => food.categoryId === category.categoryId)
              .map((food) => (
                <li key={food.foodId} className="food-item">
                  <h3>{food.name}</h3>
                  <p>{food.description}</p>
                  <p>Price: ₹{food.price}</p>
                  {food.image ? (
                    <img
                      src={`data:image/jpeg;base64,${food.image}`}
                      alt={food.name}
                      className="food-item-image"
                    />
                  ) : (
                    <img
                      src="https://via.placeholder.com/100"
                      alt={food.name}
                      className="food-item-image"
                    />
                  )}
                </li>
              ))}
          </ul>
        </div>
      ))}
      {error && <Popup message={errorMessage} onClose={handleClosePopup} />}
    </div>
  );
};

export default MenuView;
