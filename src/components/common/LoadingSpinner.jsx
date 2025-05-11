import React from 'react';
import '../../styles/components/LoadingSpinner.css';

const LoadingSpinner = () => {
  return (
    <div className="spinner-overlay">
      <div className="spinner-container">
        <div className="spinner"></div>
        <p className="spinner-text">Un momento de calma mientras preparamos todo para ti...</p>
      </div>
    </div>
  );
};

export const InlineSpinner = () => {
  return <div className="inline-spinner"></div>;
}

export default LoadingSpinner;