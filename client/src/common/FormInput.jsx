import React from 'react';

export const FormInput = ({ value, label, id, placeholder,  type, name, onChange, error }) => {
  return (
    <div>
      <label>
        {label}
        <input
          type={type}
          value= {value}
          placeholder= {placeholder}
          onChange={onChange}
          id= {id}
          name={name}
        />
      </label>
      <p>{error}</p>
    </div>
  );
};
