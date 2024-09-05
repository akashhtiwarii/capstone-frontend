import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import RestaurantProfile from '../components/RestaurantProfile';
import MenuView from '../components/MenuView';
import CategoriesView from '../components/CategoriesView';
import FoodItemsView from '../components/FoodItemsView';
import { getRestaurantDetails, getCategories, getFoodItems } from '../services/apiService';
import '../styles/RestaurantDetail.css';

const RestaurantDetail = () => {
  const location = useLocation();
  const { restaurantId } = location.state;
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentView, setCurrentView] = useState('profile');
  const [categories, setCategories] = useState([]);
  const [foodItems, setFoodItems] = useState([]);
  const [categoryError, setCategoryError] = useState(false);
  const [foodError, setFoodError] = useState(false);

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      try {
        const data = await getRestaurantDetails(restaurantId);
        setRestaurant(data);
      } catch (err) {
        console.error('Failed to fetch restaurant details:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantDetails();
  }, [restaurantId]);

  const fetchCategories = async () => {
    try {
      const data = await getCategories(restaurantId);
      setCategories(data);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
      setCategoryError(true);
    }
  };

  const fetchFoodItems = async () => {
    try {
      const data = await getFoodItems(restaurantId);
      setFoodItems(data);
    } catch (err) {
      console.error('Failed to fetch food items:', err);
      setFoodError(true);
    }
  };

  useEffect(() => {
    if (currentView === 'categories') {
      fetchCategories();
    } else if (currentView === 'food-items') {
      fetchFoodItems();
    }
  }, [currentView]);

  const menuItems = [
    { label: 'Restaurant Profile', view: 'profile', onClick: () => setCurrentView('profile') },
    { label: 'Menu', view: 'menu', onClick: () => setCurrentView('menu') },
    { label: 'Categories', view: 'categories', onClick: () => setCurrentView('categories') },
    { label: 'Food Items', view: 'food-items', onClick: () => setCurrentView('food-items') },
    { label: 'Orders', view: 'orders', onClick: () => setCurrentView('orders') },
  ];

  if (loading) {
    return <p>Loading restaurant details...</p>;
  }

  if (error) {
    return <p>There was an error loading the restaurant details.</p>;
  }

  return (
    <div className="restaurant-detail">
      <Sidebar menuItems={menuItems} currentView={currentView} setCurrentView={setCurrentView} />
      <div className="content">
        {currentView === 'profile' && restaurant && (
          <RestaurantProfile restaurant={restaurant} setRestaurant={setRestaurant} />
        )}
        {currentView === 'menu' && <MenuView restaurantId={restaurantId} />}
        {currentView === 'categories' && (
          <CategoriesView
            categories={categories}
            restaurantId={restaurantId}
            setCategories={setCategories}
            fetchCategories={fetchCategories}
          />
        )}
        {currentView === 'food-items' && (
          <FoodItemsView
            foodItems={foodItems}
            restaurantId={restaurantId}
            setFoodItems={setFoodItems}
            fetchFoodItems={fetchFoodItems}
          />
        )}
      </div>
    </div>
  );
};

export default RestaurantDetail;
