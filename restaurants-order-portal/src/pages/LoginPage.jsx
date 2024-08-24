import React from 'react';
import Login from '../components/Auth/Login';

const LoginPage = () => {
  const handleLogin = (data) => {
    console.log('Login data:', data);
  };

  return (
    <div className="login-page">
      <Login onLogin={handleLogin} />
    </div>
  );
};

export default LoginPage;
