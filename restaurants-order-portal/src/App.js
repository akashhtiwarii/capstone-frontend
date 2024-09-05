import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import RestaurantPage from './pages/RestaurantPage';
import OwnerDashboard from './pages/OwnerDashboard';
import RestaurantDetail from './pages/RestaurantDetail';
import AddRestaurantPage from './pages/AddRestaurantPage';
const App = () => {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<RestaurantPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/owner-dashboard" element={<OwnerDashboard />} />
        <Route path="/restaurant-detail" element={<RestaurantDetail />} />
        <Route path="/add-restaurant" element={<AddRestaurantPage />} />
      </Routes>
    </Router>
  );
};

export default App;
