import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import RestaurantProfile from '../components/RestaurantProfile';
import MenuView from '../components/MenuView';
import CategoriesView from '../components/CategoriesView';
import FoodItemsView from '../components/FoodItemsView';
import OrdersView from '../components/OrderView';
import ContactSupportPopup from '../components/ContactSupportPopup';
import { getRestaurantDetails, getCategories, getFoodItems } from '../services/apiService';
import Popup from '../components/Popup';
import '../styles/RestaurantDetail.css';
import { contactSupport } from '../services/apiService';

const RestaurantDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { restaurantId } = location.state;
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentView, setCurrentView] = useState('profile');
  const [categories, setCategories] = useState([]);
  const [foodItems, setFoodItems] = useState([]);
  const [categoryError, setCategoryError] = useState('');
  const [foodError, setFoodError] = useState('');
  const [showContactPopup, setShowContactPopup] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [popupMessage, setPopupMessage] = useState(null);

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      try {
        const data = await getRestaurantDetails(restaurantId);
        setRestaurant(data);
      } catch (err) {
        const message = err.response?.data?.message || 'Failed to fetch restaurant details';
        setError(message);
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
      const message = err.response?.data?.message || 'Failed to fetch categories';
      setCategoryError(message);
    }
  };

  const fetchFoodItems = async () => {
    try {
      const data = await getFoodItems(restaurantId);
      setFoodItems(data);
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch food items';
      setFoodError(message);
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

  const handleContactSupport = () => {
    setShowContactPopup(true);
  };

  const handleOwnerDashboardClick = () => {
    navigate('/owner-dashboard');
  };

  const submitContactForm = async ({ subject, message }) => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const fromEmail = storedUser.email;
    const contactData = {
      fromEmail,
      subject,
      message
    };

    try {
      setIsSending(true);
      await contactSupport(contactData);
      setPopupMessage('Support contacted successfully');
      setIsSending(false);
      setShowContactPopup(false);
    } catch (err) {
      setError(true);
      setPopupMessage(err?.response?.data?.message || 'Failed to contact support');
      setIsSending(false);
    }
  };

  if (loading) {
    return <p>Loading restaurant details...</p>;
  }

  return (
    <div className="restaurant-detail">
      <Sidebar
        menuItems={menuItems}
        currentView={currentView}
        setCurrentView={setCurrentView}
        onContactSupport={handleContactSupport}
        onOwnerDashboardClick={handleOwnerDashboardClick}
      />
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
        {currentView === 'orders' && <OrdersView restaurantId={restaurantId} />}
      </div>
      {(error || categoryError || foodError || popupMessage) && (
        <Popup
          message={error || categoryError || foodError || popupMessage || 'Data Not Found'}
          onClose={() => {
            setError('');
            setCategoryError('');
            setFoodError('');
            setPopupMessage('');
          }}
        />
      )}
      {showContactPopup && (
        <ContactSupportPopup
          onClose={() => setShowContactPopup(false)}
          onSubmit={submitContactForm}
          isSending={isSending}
        />
      )}
    </div>
  );
};

export default RestaurantDetail;
