import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AppBar.css';

const AppBar = ({ user, handleLogout }) => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleSignup = () => {
    navigate('/signup');
  };

  return (
    <header className="app-bar">
      <h1 className="app-title">Restaurant Order Portal</h1>
      <div className="app-buttons">
        {user ? (
          <>
            <span className="user-name">Welcome, {user.name}!</span>
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
