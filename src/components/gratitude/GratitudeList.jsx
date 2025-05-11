import React from 'react';
import GratitudeItem from './GratitudeItem';
import '../../styles/components/Gratitude.css';

const GratitudeList = ({ entries, onDeleteEntry, onEditEntry }) => {
  if (!entries || entries.length === 0) {
    return <p className="gratitude-list-empty">Tu jardín de gratitud espera tus primeras flores. ¿Qué pequeño tesoro agradeces hoy?</p>;
  }

  return (
    <ul className="gratitude-list">
      {entries.map(entry => (
        <GratitudeItem 
            key={entry.$id} 
            entry={entry} 
            onDelete={onDeleteEntry}
            // onEdit={onEditEntry} // Habilitar cuando la edición esté lista
        />
      ))}
    </ul>
  );
};

export default GratitudeList;