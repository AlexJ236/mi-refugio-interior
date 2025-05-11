import React from 'react';
import '../../styles/components/Button.css';

const Button = ({ children, onClick, type = 'button', variant = 'primary', disabled = false, className = '' }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`btn btn-${variant} ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;