import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AppBar.css';

const AppBar = ({ user, handleLogout }) => {
  const navigate = useNavigate();

  const handleDefault = () => {
    navigate('/');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleSignup = () => {
    navigate('/signup');
  };

  const handleCart = () => {
    navigate('/cart');
  };

  const handleProfile = () => {
    navigate('/profile');
  };

  const handleOrders = () => {
    navigate('/orders');
  };

  const handleAddressBook = () => {
    navigate('/address-book'); 
  };

  return (
    <header className="app-bar">
      <h1 className="app-title">Restaurant Order Portal</h1>
      <div className="app-buttons">
        {user ? (
          <>
            <span className="user-name">Welcome, {user.name}!</span>
            <button className="app-button" onClick={handleDefault}>
              Restaurants
            </button>
            <button className="app-button" onClick={handleProfile}>
              Profile
            </button>
            <button className="app-button" onClick={handleCart}>
              Cart
            </button>
            <button className="app-button" onClick={handleOrders}>
              Orders
            </button>
            <button className="app-button" onClick={handleAddressBook}>
              Address Book
            </button>
            <button className="app-button" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <button className="app-button" onClick={handleLogin}>
              Login
            </button>
            <button className="app-button" onClick={handleSignup}>
              Signup
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default AppBar;
