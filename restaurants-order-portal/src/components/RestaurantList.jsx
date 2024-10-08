import React from 'react';
import '../styles/RestaurantList.css';

const RestaurantList = ({ restaurants, defaultImage, onClickRestaurant }) => {
  return (
    <div className="restaurant-list">
      {restaurants.map((restaurant) => (
        <div key={restaurant.restaurantId} className="restaurant-card" onClick={() => onClickRestaurant(restaurant.restaurantId)}>
          <img
            src={restaurant.image ? `data:image/jpeg;base64,${restaurant.image}` : defaultImage}
            alt={restaurant.name}
            className="restaurant-image"
          />
          <div className="restaurant-details">
            <h2 className="restaurant-name">{restaurant.name}</h2>
            <p>
              <strong>Phone:</strong> {restaurant.phone}
            </p>
            <p>
              <strong>Email:</strong> {restaurant.email}
            </p>
            <p>
              <strong>Address:</strong> {restaurant.address}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RestaurantList;
