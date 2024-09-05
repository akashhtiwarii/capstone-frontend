import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Popup from '../components/Popup';
import '../styles/OwnerDashboard.css';
import { getRestaurantsByOwner } from '../services/apiService';

const OwnerDashboard = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState('dashboard');

  useEffect(() => {
    const fetchRestaurants = async () => {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        return;
      }

      try {
        const parsedUser = JSON.parse(storedUser);
        const data = await getRestaurantsByOwner(parsedUser.userId);

        if (data.error) {
          setErrorMessage(data.message);
          setShowPopup(true);
          return;
        }

        setRestaurants(data);
      } catch (err) {
        console.error('Failed to fetch restaurants:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  // Re-add handleRestaurantClick function
  const handleRestaurantClick = (restaurantId) => {
    navigate('/restaurant-detail', { state: { restaurantId } });
  };

  const handleLogoutClick = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleAddRestaurantClick = () => {
    navigate('/add-restaurant');
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const menuItems = [
    { label: 'My Restaurants', view: 'dashboard', onClick: () => navigate('/owner-dashboard') },
    { label: 'Profile', view: 'profile', onClick: () => navigate('/profile') },
    { label: 'Logout', view: 'logout', onClick: handleLogoutClick },
  ];

  return (
    <div className="owner-dashboard">
      <Sidebar menuItems={menuItems} currentView={currentView} setCurrentView={setCurrentView} />
      <div className="owner-dashboard-main-content">
        <h1>My Restaurants</h1>
        {loading ? (
          <p>Loading restaurants...</p>
        ) : error ? (
          <p>There was an error loading the restaurants.</p>
        ) : (
          <div>
            <button onClick={handleAddRestaurantClick} className="add-restaurant-button">Add Restaurant</button>
            {restaurants.length > 0 ? (
              <div className="owner-dashboard-restaurant-list">
                {restaurants.map((restaurant) => (
                  <div
                    key={restaurant.restaurantId}
                    className="owner-dashboard-restaurant-card"
                    onClick={() => handleRestaurantClick(restaurant.restaurantId)}
                  >
                    <img
                      src={restaurant.image ? `data:image/jpeg;base64,${restaurant.image}` : 'https://via.placeholder.com/150'}
                      alt={restaurant.name}
                      className="owner-dashboard-restaurant-image"
                    />
                    <div className="owner-dashboard-restaurant-details">
                      <h2 className="owner-dashboard-restaurant-name">{restaurant.name}</h2>
                      <p><strong>Phone:</strong> {restaurant.phone}</p>
                      <p><strong>Email:</strong> {restaurant.email}</p>
                      <p><strong>Address:</strong> {restaurant.address}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No restaurants available. Please add a new restaurant.</p>
            )}
          </div>
        )}
      </div>

      {showPopup && <Popup message={errorMessage} onClose={closePopup} />}
    </div>
  );
};

export default OwnerDashboard;
