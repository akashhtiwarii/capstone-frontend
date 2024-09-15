import React from 'react';
import { useForm } from 'react-hook-form';
import Popup from '../Popup';
import FormInput from '../FormInput';
import FormSelect from '../FormSelect';
import { useNavigate } from 'react-router-dom';
import { validateSignup } from '../utils/validationSchema';
import { registerUser } from '../../services/apiService';

const Signup = ({ onSignup }) => {
  const { register, handleSubmit, setError, formState: { errors } } = useForm();
  const [popupMessage, setPopupMessage] = React.useState('');
  const navigate = useNavigate();
  const onSubmit = async (data) => {
    const validationErrors = validateSignup(data);
    if (Object.keys(validationErrors).length > 0) {
      Object.entries(validationErrors).forEach(([field, message]) => {
        setError(field, { type: 'manual', message });
      });
      return;
    }
    try {
      const encryptedPassword = btoa(data.password);
      const { confirmPassword, ...restData } = data;
      const requestData = { ...restData, password: encryptedPassword };
      const response = await registerUser(requestData);
      onSignup(response);
      setPopupMessage(response.message);
      setTimeout(() => {
        navigate('/login');
      }, 500);
    } catch (error) {
      if (error.response.data && error.response.data) {
        setPopupMessage( error.response.data.message);
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
        <button type="submit" className="btn btn-primary">Sign Up</button>
      </form>
      <Popup message={popupMessage} onClose={closePopup} />
    </div>
  );
};

export default Signup;
