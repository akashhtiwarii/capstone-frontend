import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ContactSupportPopup from './ContactSupportPopup';
import Popup from './Popup';
import { contactSupport } from '../services/apiService';
import '../styles/AppBar.css';

const AppBar = ({ user, handleLogout }) => {
  const navigate = useNavigate();
  const [showContactPopup, setShowContactPopup] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [popupMessage, setPopupMessage] = useState(null);

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

  const submitContactForm = async ({ subject, message }) => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const fromEmail = storedUser.email;

    const contactData = {
      fromEmail,
      subject,
      message,
    };

    try {
      setIsSending(true);
      const response = await contactSupport(contactData);
    
      if (response && response.message) {
        setPopupMessage(response.message);
      } else {
        setPopupMessage("Support contacted successfully.");
      }
  
      setIsSending(false);
      setShowContactPopup(false);
    } catch (err) {
      const errorMessage = err.message || 'Failed to contact support';
      setPopupMessage(errorMessage);
      setIsSending(false);
    }
  };

  const closePopup = () => {
    setPopupMessage(null);
  };

  return (
    <header className="app-bar">
      <h1 className="app-title">Restaurant Order Portal</h1>
      <div className="app-buttons">
        {user ? (
          <>
            <span className="user-name">Welcome, {user.name}!</span>
            <button className="app-button" onClick={handleDefault}>Restaurants</button>
            <button className="app-button" onClick={handleProfile}>Profile</button>
            <button className="app-button" onClick={handleCart}>Cart</button>
            <button className="app-button" onClick={handleOrders}>Orders</button>
            <button className="app-button" onClick={handleAddressBook}>Address Book</button>
            <button className="app-button" onClick={() => setShowContactPopup(true)}>
              Contact Support
            </button>
            <button className="app-button" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <button className="app-button" onClick={handleLogin}>Login</button>
            <button className="app-button" onClick={handleSignup}>Signup</button>
          </>
        )}
      </div>
      
      {showContactPopup && (
        <ContactSupportPopup
          onClose={() => setShowContactPopup(false)}
          onSubmit={submitContactForm}
          isSending={isSending}
        />
      )}
      
      {popupMessage && (
        <Popup message={popupMessage} onClose={closePopup} />
      )}
    </header>
  );
};

export default AppBar;
