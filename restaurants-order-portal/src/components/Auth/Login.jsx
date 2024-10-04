import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Popup from '../Popup';
import FormInput from '../FormInput';
import { validateLogin } from '../utils/validationSchema';
import { loginUser, forgotPassword } from '../../services/apiService';

const Login = ({ onLogin }) => {
  const { register, handleSubmit, setError, formState: { errors } } = useForm();
  const [popupMessage, setPopupMessage] = useState('');
  const [showForgotPasswordPopup, setShowForgotPasswordPopup] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
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
          setPopupMessage('Failed to parse user from localStorage:', e);
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
        setPopupMessage('Login failed! Please check your connection.');
      }
    }
  };

  const handleForgotPasswordClick = () => {
    setShowForgotPasswordPopup(true);
  };

  const handleForgotPasswordSubmit = async () => {
    try {
      await forgotPassword(forgotPasswordEmail);
      setPopupMessage('Password reset email sent successfully.');
    } catch (error) {
      if (error.response && error.response.data) {
        const { message } = error.response.data;
        setPopupMessage(message || 'Failed to send password reset email.');
      } else {
        setPopupMessage('Failed to send password reset email. Please check your connection.');
      }
    } finally {
      setShowForgotPasswordPopup(false);
    }
  };

  const closePopup = () => setPopupMessage('');

  return (
    <div className="form-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormInput 
          label={<span>Email <span style={{ color: 'red' }}>*</span></span>} 
          type="email" 
          register={register} 
          name="email" 
          errors={errors} 
        />
        <FormInput 
          label={<span>Password <span style={{ color: 'red' }}>*</span></span>} 
          type="password" 
          register={register} 
          name="password" 
          errors={errors} 
        />
        <button type="submit" className="btn btn-primary">Login</button>
        <button 
          type="button" 
          className="btn btn-link" 
          onClick={handleForgotPasswordClick}
        >
          Forgot Password?
        </button>
      </form>
      <button 
        type="button" 
        className="btn btn-secondary" 
        onClick={() => navigate('/signup')}
      >
        Sign Up
      </button>
      <Popup message={popupMessage} onClose={closePopup} />
      {showForgotPasswordPopup && (
        <Popup 
          message={
            <>
              <h3>Forgot Password</h3>
              <input 
                type="email" 
                value={forgotPasswordEmail} 
                onChange={(e) => setForgotPasswordEmail(e.target.value)} 
                placeholder="Enter your email" 
                className="forgot-password-input"
              />
              <div className="forgot-password-buttons">
                <button onClick={handleForgotPasswordSubmit} className="btn btn-primary">Submit</button>
              </div>
            </>
          }
          onClose={() => setShowForgotPasswordPopup(false)}
        />
      )}
    </div>
  );
};

export default Login;
