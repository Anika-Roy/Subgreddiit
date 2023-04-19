import React from 'react';

export const Button = ({ text, type , disabled, onClick}) => {
  return (
    <button type={type} disabled={disabled} onClick={onClick}>
      {text}
    </button>
  );
};
