import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import Popup from '../Popup';
import FormInput from '../FormInput';
import { loginValidationSchema } from '../utils/validationSchema';
import bcrypt from 'bcryptjs';

const Login = ({ onLogin }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(loginValidationSchema),
  });
  const [popupMessage, setPopupMessage] = React.useState('');

  const onSubmit = async (data) => {
    try {
      const encryptedPassword = btoa(data.password);
      const requestData = { ...data, password: encryptedPassword };
      const response = await axios.post('http://localhost:8081/user/login', requestData);
      const { message } = response.data;
      onLogin(response.data);
      setPopupMessage(message || 'Login successful!');
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
