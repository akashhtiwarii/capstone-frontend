import React from 'react';

const FormSelect = ({ label, options, register, name, errors }) => (
  <div className="form-group">
    <label>{label}</label>
    <select
      {...register(name)}
      className={`form-control ${errors[name] ? 'is-invalid' : ''}`}
    >
      {options.map(option => (
        <option key={option.value} value={option.value}>{option.label}</option>
      ))}
    </select>
    {errors[name] && <div className="invalid-feedback">{errors[name].message}</div>}
  </div>
);

export default FormSelect;
