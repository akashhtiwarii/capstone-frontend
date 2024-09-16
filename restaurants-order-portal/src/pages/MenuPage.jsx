import React, { useEffect, useState } from 'react';
import axios from 'axios'; 
import '../styles/MenuPage.css';
import { getFoodItemsByRestaurant, getCategoriesByRestaurant } from '../services/apiService';
import { useParams, useNavigate } from 'react-router-dom';
import Popup from '../components/Popup'; 
import AppBar from '../components/AppBar';

const MenuPage = () => {
  const { restaurantId } = useParams();
  const [categories, setCategories] = useState([]);
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const fetchMenuData = async () => {
      try {
        const categoryData = await getCategoriesByRestaurant(restaurantId);
        const foodData = await getFoodItemsByRestaurant(restaurantId);

        setCategories(categoryData);
        setFoodItems(foodData);
      } catch (err) {
        console.error('Failed to fetch menu data:', err);
        setPopupMessage("Menu Not Available");
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuData();
  }, [restaurantId]);

  const handleAddToCart = async (foodItem) => { 
    if (!user) {
      setPopupMessage('Please log in to add items to your cart.');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      return;
    }

    const requestBody = {
      userId: user.userId, 
      restaurantId: parseInt(restaurantId, 10), 
      foodId: foodItem.foodId,
      quantity: 1, 
      price: foodItem.price,
    };

    try {
      const response = await axios.post('http://localhost:8082/order/cart/add', requestBody);

      if (response.status === 200) {
        setPopupMessage('Item added to cart successfully!');
      } else {
        setPopupMessage(response.data.message || 'Failed to add item to cart.');
      }
    } catch (error) {
      console.error('Error adding item to cart:', error);
      setPopupMessage(error.response?.data?.message || 'Failed to add item to cart.');
    }
  };

  const closePopup = () => {
    setPopupMessage('');
  };
  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  if (loading) {
    return <p>Loading menu...</p>;
  }

  return (
    <div className="menu-items-page">
      <AppBar user={user} handleLogout={handleLogout} />
      <div className="menu-page">
      {popupMessage && <Popup message={popupMessage} onClose={closePopup} />}
      
      {categories.map((category) => (
        <div key={category.categoryId} className="menu-category-section">
          <h2>{category.name}</h2>
          <ul className="menu-food-item-list">
            {foodItems
              .filter((food) => food.categoryId === category.categoryId)
              .map((food) => (
                <li key={food.foodId} className="menu-food-item">
                  <img
                    src={food.image ? `data:image/jpeg;base64,${food.image}` : "https://via.placeholder.com/100"}
                    alt={food.name}
                    className="menu-food-item-image"
                  />
                  <div className="menu-food-item-content">
                    <h3>{food.name}</h3>
                    <p>{food.description || <span className="menu-no-description">No description available.</span>}</p>
                    <p>Price: ₹{food.price}</p>
                    <button onClick={() => handleAddToCart(food)} className="menu-add-to-cart-button">
                      Add to Cart
                    </button>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      ))}
    </div>
    </div>
  );
};

export default MenuPage;
