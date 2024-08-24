import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import Popup from '../Popup';
import FormInput from '../FormInput';
import FormSelect from '../FormSelect';
import { signupValidationSchema } from '../utils/validationSchema';
import CryptoJS from 'crypto-js';

const Signup = ({ onSignup }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(signupValidationSchema),
  });
  const [popupMessage, setPopupMessage] = React.useState('');

  const onSubmit = async (data) => {
    try {
      const encryptedPassword = btoa(data.password);
      const requestData = { ...data, password: encryptedPassword };
      const response = await axios.post('http://localhost:8081/user/register', requestData);
      onSignup(response.data);
      setPopupMessage('Signup successful!');
    } catch (error) {
      if (error.response && error.response.data) {
        setPopupMessage(error.response.data || 'Signup failed! Please try again.');
      } else {
        setPopupMessage('Signup failed! Please check your connection.');
      }
    }
  };

  const closePopup = () => setPopupMessage('');

  return (
    <div className="form-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormInput label="Name" type="text" register={register} name="name" errors={errors} />
        <FormInput label="Email" type="email" register={register} name="email" errors={errors} />
        <FormInput label="Password" type="password" register={register} name="password" errors={errors} />
        <FormInput label="Confirm Password" type="password" register={register} name="confirmPassword" errors={errors} />
        <FormSelect
          label="Role"
          options={[
            { value: 'USER', label: 'User' },
            { value: 'OWNER', label: 'Owner' },
          ]}
          register={register}
          name="role"
          errors={errors}
        />
        <FormInput label="Phone" type="text" register={register} name="phone" errors={errors} />
        <FormInput label="Address" type="text" register={register} name="address" errors={errors} />
        <button type="submit" className="btn btn-primary">Sign Up</button>
      </form>
      <Popup message={popupMessage} onClose={closePopup} />
    </div>
  );
};

export default Signup;
