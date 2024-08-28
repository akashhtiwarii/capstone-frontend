import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import Popup from '../Popup';
import FormInput from '../FormInput';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { validateLogin } from '../utils/validationSchema';

const Login = ({ onLogin }) => {
  const { register, handleSubmit, setError, formState: { errors } } = useForm();
  const [popupMessage, setPopupMessage] = React.useState('');
  const navigate = useNavigate();
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      navigate('/dashboard');
    }
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
      const response = await axios.post('http://localhost:8081/user/login', requestData);
      const { userId, email, name, phone, role, message } = response.data;
      localStorage.setItem('user', JSON.stringify({
        userId,
        email,
        name,
        phone,
        role,
      }));
      onLogin(response.data);
      setPopupMessage(message || 'Login successful!');
      setTimeout(() => {
        navigate('/dashboard');
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

  const closePopup = () => setPopupMessage('');

  return (
    <div className="form-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormInput label="Email" type="email" register={register} name="email" errors={errors} />
        <FormInput label="Password" type="password" register={register} name="password" errors={errors} />
        <button type="submit" className="btn btn-primary">Login</button>
      </form>
      <Popup message={popupMessage} onClose={closePopup} />
    </div>
  );
};

export default Login;
