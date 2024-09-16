import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Popup from '../Popup';
import FormInput from '../FormInput';
import { validateLogin } from '../utils/validationSchema';
import { loginUser } from '../../services/apiService';

const Login = ({ onLogin }) => {
  const { register, handleSubmit, setError, formState: { errors } } = useForm();
  const [popupMessage, setPopupMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthentication = () => {
      const user = localStorage.getItem('user');
      if (user) {
        try {
          const parsedUser = JSON.parse(user);
          if (parsedUser.role === 'OWNER') {
            navigate('/owner-dashboard');
          } else if (parsedUser.role === 'USER') {
            navigate('/');
          }
        } catch (e) {
          console.error('Failed to parse user from localStorage:', e);
        }
      }
    };

    checkAuthentication();
  }, [navigate]);

  const onSubmit = async (data) => {
    const validationErrors = validateLogin(data);
    if (Object.keys(validationErrors).length > 0) {
      Object.entries(validationErrors).forEach(([field, message]) => {
        setError(field, { type: 'manual', message });
      });
      return;
    }

    try {
      const encryptedPassword = btoa(data.password);
      const requestData = { ...data, password: encryptedPassword };
      const response = await loginUser(requestData);

      const { userId, email, name, phone, role, message } = response;

      localStorage.setItem('user', JSON.stringify({
        userId,
        email,
        name,
        phone,
        role,
      }));

      onLogin(response);

      setPopupMessage(message || 'Login successful!');
      setTimeout(() => {
        navigate(role === 'USER' ? '/' : '/owner-dashboard');
      }, 1000);
      
    } catch (error) {
      if (error.response && error.response.data) {
        const { message } = error.response.data;
        setPopupMessage(message || 'Login failed! Please try again.');
      } else {
        console.error('Login error:', error);
        setPopupMessage('Login failed! Please check your connection.');
      }
    }
  };

  const closePopup = () => setPopupMessage('');

  return (
    <div className="form-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormInput 
          label="Email" 
          type="email" 
          register={register} 
          name="email" 
          errors={errors} 
        />
        <FormInput 
          label="Password" 
          type="password" 
          register={register} 
          name="password" 
          errors={errors} 
        />
        <button type="submit" className="btn btn-primary">Login</button>
      </form>
      <button 
        type="button" 
        className="btn btn-secondary" 
        onClick={() => navigate('/signup')}
      >
        Sign Up
      </button>
      <Popup message={popupMessage} onClose={closePopup} />
    </div>
  );
};

export default Login;
