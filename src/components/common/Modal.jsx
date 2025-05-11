import React from 'react';
import ReactDOM from 'react-dom';
import '../../styles/components/Modal.css';
import Button from './Button';

const Modal = ({ isOpen, onClose, title, children, primaryAction, primaryActionText = "Aceptar con cariño", secondaryAction, secondaryActionText = "Quizás luego" }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="modal-overlay-beautiful" onClick={onClose}>
      <div className="modal-content-beautiful" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-beautiful">
          {title && <h2 className="modal-title-beautiful">{title}</h2>}
          <button onClick={onClose} className="modal-close-button-beautiful">&times;</button>
        </div>
        <div className="modal-body-beautiful">
          {children}
        </div>
        {(primaryAction || secondaryAction) && (
          <div className="modal-actions-beautiful">
            {secondaryAction && (
              <Button onClick={secondaryAction} variant="secondary">
                {secondaryActionText}
              </Button>
            )}
            {primaryAction && (
              <Button onClick={primaryAction} variant="primary">
                {primaryActionText}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>,
    document.getElementById('root')
  );
};

export default Modal;