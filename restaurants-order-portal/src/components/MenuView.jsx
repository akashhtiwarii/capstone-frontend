import React, { useEffect, useState } from 'react';
import '../styles/MenuView.css';
import { getFoodItemsByRestaurant } from '../services/apiService';
import { getCategoriesByRestaurant } from '../services/apiService';

const MenuView = ({ restaurantId }) => {
  const [categories, setCategories] = useState([]);
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const categoryData = await getCategoriesByRestaurant(restaurantId);
        const foodData = await getFoodItemsByRestaurant(restaurantId);

        setCategories(categoryData);
        setFoodItems(foodData);
      } catch (err) {
        console.error('Failed to fetch menu data:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuData();
  }, [restaurantId]);

  if (loading) {
    return <p>Loading menu...</p>;
  }

  if (error) {
    return <p>There was an error loading the menu.</p>;
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
                  <p>Price: ${food.price}</p>
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
    </div>
  );
};

export default MenuView;
