import React from 'react';

const FormInput = ({ label, type, register, name, errors }) => (
  <div className="form-group">
    <label>{label}</label>
    <input
      type={type}
      {...register(name)}
      className={`form-control ${errors[name] ? 'is-invalid' : ''}`}
    />
    {errors[name] && <div className="invalid-feedback">{errors[name].message}</div>}
  </div>
);

export default FormInput;
