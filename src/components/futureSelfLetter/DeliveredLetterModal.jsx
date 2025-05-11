import React from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';

const DeliveredLetterModal = ({ isOpen, onClose, letter }) => {
  if (!letter) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Un Mensaje del Pasado Ha Llegado Para Ti 💌"
    >
      <div className="delivered-letter-modal-content">
        <h3>{letter.letterTitle || "Un Susurro del Pasado"}</h3>
        <p className="letter-date-info">
          Escrito con amor el: {new Date(letter.$createdAt).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })}
          <br/>
          Destinado para ti el: {new Date(letter.releaseDate).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })}
        </p>
        <div className="letter-text-display">
          {letter.letterContent}
        </div>
        <Button onClick={onClose} variant="primary">
          Gracias por este recuerdo ✨
        </Button>
      </div>
    </Modal>
  );
};

export default DeliveredLetterModal;