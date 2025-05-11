import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../common/Button';
import '../../styles/components/DailyCard.css';

const formatDate = (isoDateString) => {
  if (!isoDateString || typeof isoDateString !== 'string' || isoDateString.trim() === '') {
    return "Fecha no disponible";
  }
  try {
    const dateObj = new Date(isoDateString); // Asume que la fecha ya viene bien o es parseable
    if (isNaN(dateObj.getTime())) {
      // Intenta parsear asumiendo que podría ser YYYY-MM-DD y necesita ser interpretada como UTC
      const parts = isoDateString.split('-');
      if (parts.length === 3) {
          const utcDate = new Date(Date.UTC(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2])));
          if (!isNaN(utcDate.getTime())) {
            const options = { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' };
            return utcDate.toLocaleDateString('es-ES', options);
          }
      }
      return "Fecha inválida";
    }
    const options = { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }; // Siempre UTC para consistencia
    return dateObj.toLocaleDateString('es-ES', options);
  } catch (error) {
    return "Error al formatear";
  }
};


const DailyCardItem = ({ card, onDelete }) => {
  if (!card || typeof card !== 'object') {
    return (
      <li className="daily-card-item error-state">
        <p>Error al cargar esta reflexión.</p>
      </li>
    );
  }

  const { $id, date, cardData } = card;
  const safeCardData = cardData && typeof cardData === 'object' ? cardData : {};
  const notCompletedText = <em style={{ color: 'var(--text-placeholder)', fontSize: '0.95em' }}>Esta zona espera a que te expreses.</em>;

  const displayEmotions = () => {
    const emotionsData = safeCardData.emotions;
    if (emotionsData && Array.isArray(emotionsData) && emotionsData.length > 0) {
      return emotionsData.map(e => `${e.name} (Int: ${e.intensity})`).join(', ');
    }
    if (typeof emotionsData === 'string' && emotionsData.trim() !== '') { // Compatibilidad con datos antiguos
      return emotionsData;
    }
    return notCompletedText;
  };

  return (
    <li className="daily-card-item">
      <div className="daily-card-item-header">
        <h3>Reflexión del Día</h3>
        <p className="daily-card-item-date">{formatDate(date)}</p>
      </div>
      <div className="daily-card-item-content">
        <p><strong>Emociones sentidas:</strong> {displayEmotions()}</p>
        <p><strong>Impulsos y manejo:</strong> {safeCardData.impulses && safeCardData.impulses.trim() !== '' ? safeCardData.impulses : notCompletedText}</p>
        <p><strong>Habilidades usadas:</strong> {safeCardData.skillsUsed && safeCardData.skillsUsed.trim() !== '' ? safeCardData.skillsUsed : notCompletedText}</p>
        <p><strong>Notas adicionales:</strong> {safeCardData.notes && safeCardData.notes.trim() !== '' ? safeCardData.notes : notCompletedText}</p>
      </div>
      <div className="daily-card-item-actions">
        <Link to={`/daily-card/edit/${$id}`}>
          <Button variant="secondary" className="btn-sm">Editar Tesoro</Button>
        </Link>
        {onDelete && typeof onDelete === 'function' && (
          <Button onClick={() => onDelete($id)} variant="danger" className="btn-sm">
            Soltar Recuerdo
          </Button>
        )}
      </div>
    </li>
  );
};

export default DailyCardItem;