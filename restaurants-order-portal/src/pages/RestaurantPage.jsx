import React, { useState, useEffect } from 'react';
import '../styles/RestaurantPage.css';
import AppBar from '../components/AppBar';
import RestaurantList from '../components/RestaurantList';
import { useNavigate } from 'react-router-dom';
import { getAllRestaurants } from '../services/apiService';

const RestaurantPage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const data = await getAllRestaurants(); 
        setRestaurants(data);
        setLoading(false);
      } catch (err) {
        setError(true);
        setLoading(false);
      }
    };

    fetchRestaurants();

    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        if (parsedUser.role === 'OWNER') {
          navigate('/owner-dashboard');
        }
      } catch (e) {
        console.error('Failed to parse user from localStorage:', e);
        setUser(null);
      }
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  const defaultImage = 'https://via.placeholder.com/150';

  return (
    <div className="restaurant-page">
      <AppBar user={user} handleLogout={handleLogout} />
      <main className="main-content">
        {loading ? (
          <p>Loading restaurants...</p>
        ) : error ? (
          <p>There was an error loading the restaurants.</p>
        ) : (
          <RestaurantList restaurants={restaurants} defaultImage={defaultImage} />
        )}
      </main>
    </div>
  );
};

export default RestaurantPage;
