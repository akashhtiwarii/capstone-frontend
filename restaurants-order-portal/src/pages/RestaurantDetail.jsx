import React from 'react';
import { useLocation } from 'react-router-dom';
import './RestaurantDetail.css';

const RestaurantDetail = () => {
  const location = useLocation();
  const { restaurantId } = location.state;

  return (
    <div className="restaurant-detail">
      <div className="sidebar">
        <ul>
          <li>Restaurant Profile</li>
          <li>Menu</li>
          <li>Categories</li>
          <li>Food Items</li>
          <li>Orders</li>
        </ul>
      </div>
      <div className="content">
        <h1>Restaurant ID: {restaurantId}</h1>
        {/* Content for each section will go here */}
      </div>
    </div>
  );
};

export default RestaurantDetail;
