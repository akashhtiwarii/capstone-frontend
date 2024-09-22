import React, { useState, useEffect } from 'react';
import Popup from './Popup';
import { updateRestaurant } from '../services/apiService';
import { getRestaurantDetails } from '../services/apiService';
import { useLocation } from 'react-router-dom';

const RestaurantProfile = ({ setRestaurant }) => {
  const [restaurant, setRestaurantState] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [image, setImage] = useState(null);
  const [popupMessage, setPopupMessage] = useState('');
  const location = useLocation();
  const { restaurantId } = location.state || {};

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      try {
        const response = await getRestaurantDetails(restaurantId); 
        setRestaurantState(response);
      } catch (err) {
        console.error('Failed to fetch restaurant details:', err);
        setPopupMessage('Failed to fetch restaurant details');
      }
    };

    fetchRestaurantDetails();
  }, [restaurantId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRestaurantState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]); 
  };

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    const user = localStorage.getItem('user');
    if (!user) {
      setPopupMessage('User ID is not Logged In');
      return;
    }
    const parsedUser = JSON.parse(user);

    try {
      const formData = new FormData();
      formData.append('name', restaurant.name);
      formData.append('email', restaurant.email);
      formData.append('phone', restaurant.phone);
      formData.append('address', restaurant.address);
      formData.append('restaurantId', restaurant.restaurantId);
      formData.append('loggedInOwnerId', parsedUser.userId);

      if (image) {
        formData.append('image', image); 
      }

      const response = await updateRestaurant(formData);

      setPopupMessage(response.message);
      setIsEditing(false);
      const updatedRestaurantDetails = await getRestaurantDetails(restaurant.restaurantId);
      setRestaurantState(updatedRestaurantDetails);
    } catch (err) {
      if (err.response && err.response.data) {
        const responseData = err.response.data;
        if (typeof responseData === 'object' && !responseData.message) {
          const errorMessages = Object.values(responseData).join(', ');
          setPopupMessage(`Validation Errors: ${errorMessages}`);
        } else if (responseData.message) {
          setPopupMessage(responseData.message);
        } else {
          setPopupMessage('An error occurred while adding the restaurant.');
        }
      } else {
        setPopupMessage('An error occurred while adding the restaurant.');
      }
    }
  };

  return restaurant ? (
    <>
      <h1>{restaurant.name}</h1>
      {restaurant.image ? (
        <img
          src={`data:image/jpeg;base64,${restaurant.image}`}
          alt="Restaurant"
          className="restaurant-detail-image"
        />
      ) : (
        <img
          src="https://via.placeholder.com/150"
          alt="Default Restaurant"
          className="restaurant-detail-image"
        />
      )}
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
        {isEditing && (
          <label>
            <strong>Image:</strong>
            <input type="file" onChange={handleImageChange} />
          </label>
        )}
      </div>
      <button onClick={toggleEditMode}>
        {isEditing ? 'Cancel' : 'Edit'}
      </button>
      {isEditing && (
        <button onClick={handleSave}>
          Save
        </button>
      )}
      <Popup message={popupMessage} onClose={() => setPopupMessage('')} />
    </>
  ) : (
    <p>Loading restaurant details...</p>
  );
};

export default RestaurantProfile;
