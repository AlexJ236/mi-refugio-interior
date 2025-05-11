import React from 'react';
import Button from '../common/Button';
import '../../styles/components/Gratitude.css';

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' };
  return new Date(dateString + 'T00:00:00Z').toLocaleDateString('es-ES', options);
};

const GratitudeItem = ({ entry, onDelete, onEdit }) => {
  return (
    <li className="gratitude-item">
      <div className="gratitude-item-header">
        <p className="gratitude-item-date">Sembrado el {formatDate(entry.date)}</p>
      </div>
      <p className="gratitude-item-text">{entry.entryText}</p>
      {(onDelete || onEdit) && (
         <div className="gratitude-item-actions">
            {onDelete && <Button onClick={() => onDelete(entry.$id)} variant="danger" className="btn-sm">Liberar Pétalo</Button>}
        </div>
      )}
    </li>
  );
};

export default GratitudeItem;