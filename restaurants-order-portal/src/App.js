import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import RestaurantPage from './pages/RestaurantPage';
import OwnerDashboard from './pages/OwnerDashboard';
const App = () => {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<RestaurantPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/owner-dashboard" element={<OwnerDashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
