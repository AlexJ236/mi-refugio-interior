import React, { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import { createGratitudeEntry } from '../../lib/gratitudeService';
import { INSPIRING_GRATITUDE_PLACEHOLDERS } from '../../lib/constants';
import InputField from '../common/InputField';
import Button from '../common/Button';
import { InlineSpinner } from '../common/LoadingSpinner';
import Modal from '../common/Modal';
import '../../styles/components/Gratitude.css';

const getCurrentDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

const GratitudeForm = ({ onEntryAdded }) => {
  const { currentUser } = useAuth();
  const [entryText, setEntryText] = useState('');
  const [date, setDate] = useState(getCurrentDate());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPlaceholder, setCurrentPlaceholder] = useState('');

  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * INSPIRING_GRATITUDE_PLACEHOLDERS.length);
    setCurrentPlaceholder(INSPIRING_GRATITUDE_PLACEHOLDERS[randomIndex]);
  }, []);

  useEffect(() => { // Para el autocierre del toast
    if (showSuccessToast) {
      const timer = setTimeout(() => {
        setShowSuccessToast(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessToast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!entryText.trim()) {
      setError("Por favor, escribe un pequeño agradecimiento para guardar este momento.");
      return;
    }
    setError(null);
    setIsLoading(true);

    try {
      const newEntry = await createGratitudeEntry(currentUser.$id, date, entryText);
      setToastMessage('¡Tu corazón agradecido ha dejado una nueva huella luminosa! 🌟');
      setShowSuccessToast(true);
      setEntryText(''); // Limpiar para la próxima
      // setDate(getCurrentDate()); // Opcional: resetear fecha también
      if (onEntryAdded) {
        onEntryAdded(newEntry);
      }
    } catch (err) {
      console.error("Error guardando la entrada de gratitud:", err);
      setError(err.message || "Un destello de gratitud no pudo ser guardado.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="gratitude-form-container">
        <h3>Siembra Semillas de Gratitud</h3>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit} className="gratitude-form">
          <InputField
            id="gratitudeDate"
            label="Fecha de este agradecimiento:"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
          <InputField
            id="gratitudeText"
            label="¿Por qué sientes gratitud hoy, corazón?"
            textarea
            value={entryText}
            onChange={(e) => setEntryText(e.target.value)}
            placeholder={currentPlaceholder}
            required
          />
          <Button type="submit" variant="primary" disabled={isLoading} style={{width: '100%'}}>
            {isLoading ? <>Guardando Tesoro... <InlineSpinner /></> : 'Atesorar este Momento'}
          </Button>
        </form>
      </div>

      {showSuccessToast && (
        <Modal
          isOpen={showSuccessToast}
          onClose={() => setShowSuccessToast(false)}
          title="¡Con Amor!"
        >
          <p style={{textAlign: 'center', fontSize: '1.2rem', color: 'var(--text-comfort)'}}>{toastMessage}</p>
        </Modal>
      )}
    </>
  );
};

export default GratitudeForm;