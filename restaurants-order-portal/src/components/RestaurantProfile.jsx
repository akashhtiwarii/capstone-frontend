import React, { useState } from 'react';
import ImageUpload from './ImageUpload';

const RestaurantProfile = ({ restaurant, setRestaurant }) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRestaurant((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    console.log('Saving updated restaurant details:', restaurant);
    setIsEditing(false);
  };

  return (
    <>
      <h1>{restaurant.name}</h1>
      <ImageUpload
        image={restaurant.image}
        name={restaurant.name}
        isEditing={isEditing}
        setRestaurant={setRestaurant}
      />
      <div className="restaurant-info">
        <label>
          <strong>Name:</strong>
          {isEditing ? (
            <input
              type="text"
              name="name"
              value={restaurant.name}
              onChange={handleInputChange}
            />
          ) : (
            <span>{restaurant.name}</span>
          )}
        </label>
        <label>
          <strong>Email:</strong>
          {isEditing ? (
            <input
              type="email"
              name="email"
              value={restaurant.email}
              onChange={handleInputChange}
            />
          ) : (
            <span>{restaurant.email}</span>
          )}
        </label>
        <label>
          <strong>Phone:</strong>
          {isEditing ? (
            <input
              type="tel"
              name="phone"
              value={restaurant.phone}
              onChange={handleInputChange}
            />
          ) : (
            <span>{restaurant.phone}</span>
          )}
        </label>
        <label>
          <strong>Address:</strong>
          {isEditing ? (
            <input
              type="text"
              name="address"
              value={restaurant.address}
              onChange={handleInputChange}
            />
          ) : (
            <span>{restaurant.address}</span>
          )}
        </label>
      </div>
      <button onClick={toggleEditMode}>
        {isEditing ? 'Cancel' : 'Edit'}
      </button>
      {isEditing && (
        <button onClick={handleSave}>
          Save
        </button>
      )}
    </>
  );
};

export default RestaurantProfile;
