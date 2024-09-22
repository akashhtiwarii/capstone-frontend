import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import '../styles/AddRestaurantPage.css';
import { validateRestaurant } from '../components/utils/validationSchema';
import { addRestaurant } from '../services/apiService';
import Popup from '../components/Popup';

const AddRestaurantPage = () => {
  const { register, handleSubmit, setError, formState: { errors } } = useForm();
  const [popupMessage, setPopupMessage] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const validationErrors = validateRestaurant(data);
    if (Object.keys(validationErrors).length > 0) {
      Object.entries(validationErrors).forEach(([field, message]) => {
        setError(field, { type: 'manual', message });
      });
      return;
    }
  
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      setPopupMessage('User is not logged in');
      return;
    }
  
    const parsedUser = JSON.parse(storedUser);
  
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('phone', data.phone);
    formData.append('address', data.address);
    formData.append('ownerId', parsedUser.userId);
  
    if (data.image[0]) {
      formData.append('image', data.image[0]);
    }
  
    try {
      const response = await addRestaurant(formData);
      setPopupMessage(response.message);
      setTimeout(() => {
        navigate('/owner-dashboard');
      }, 2000);
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
  

  return (
    <div className="add-restaurant-page">
      <div className="sidebar">
        <ul>
          <li onClick={() => navigate('/owner-dashboard')} className="side-panel-item">My Restaurants</li>
          <li onClick={() => navigate('/profile')} className="side-panel-item">Profile</li>
          <li onClick={() => { localStorage.removeItem('user'); navigate('/login'); }} className="side-panel-item">Logout</li>
        </ul>
      </div>
      <div className="add-restaurant-main-content">
        <h1>Add Restaurant</h1>
        <Popup message={popupMessage} onClose={() => setPopupMessage('')} />
        <form onSubmit={handleSubmit(onSubmit)} className="add-restaurant-form">
          <label>
            Name:
            <input type="text" {...register('name', { required: 'Name is required' })} />
            {errors.name && <p className="error-message">{errors.name.message}</p>}
          </label>
          <label>
            Email:
            <input type="email" {...register('email', { required: 'Email is required' })} />
            {errors.email && <p className="error-message">{errors.email.message}</p>}
          </label>
          <label>
            Phone:
            <input type="text" {...register('phone', { required: 'Phone is required' })} />
            {errors.phone && <p className="error-message">{errors.phone.message}</p>}
          </label>
          <label>
            Address:
            <input type="text" {...register('address', { required: 'Address is required' })} />
            {errors.address && <p className="error-message">{errors.address.message}</p>}
          </label>
          <label>
            Image:
            <input type="file" accept="image/*" {...register('image')} />
          </label>
          <button type="submit" className="submit-button">Add Restaurant</button>
        </form>
      </div>
    </div>
  );
};

export default AddRestaurantPage;
