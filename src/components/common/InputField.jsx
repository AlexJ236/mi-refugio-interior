import React from 'react';
import '../../styles/components/InputField.css';

const InputField = ({ id, label, type = 'text', value, onChange, placeholder, error, required = false, readOnly = false, textarea = false }) => {
  const InputComponent = textarea ? 'textarea' : 'input';
  return (
    <div className="input-field-group">
      {label && <label htmlFor={id} className="input-label">{label}{required && <span className="required-asterisk">*</span>}</label>}
      <InputComponent
        type={type}
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder || `Con amor, escribe aquí tu ${label?.toLowerCase() || 'dato'}...`}
        className={`input-element ${error ? 'input-error' : ''} ${textarea ? 'input-textarea' : ''}`}
        required={required}
        readOnly={readOnly}
        rows={textarea ? 5 : undefined}
      />
      {error && <p className="error-text">{error}</p>}
    </div>
  );
};

export default InputField;