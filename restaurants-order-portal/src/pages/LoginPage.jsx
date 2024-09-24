import React from 'react';
import Login from '../components/Auth/Login';
import '../styles.css';
const LoginPage = () => {
  const handleLogin = (data) => {
  };

  return (
    <div className="login-page">
      <Login onLogin={handleLogin} />
    </div>
  );
};

export default LoginPage;
