import React from 'react';

const ColorPicker = ({ label, color, onChange, variableName }) => {
  return (
    <div className="color-picker-group">
      <label htmlFor={`color-${variableName}`} className="color-picker-label">
        {label}
      </label>
      <div className="color-picker-input-wrapper">
        <input
          type="color"
          id={`color-${variableName}`}
          value={color}
          onChange={(e) => onChange(e.target.value)}
          className="color-picker-input"
        />
        <span className="color-picker-value">{color}</span>
      </div>
    </div>
  );
};

export default ColorPicker;