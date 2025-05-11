import React, { useState } from 'react';
import Button from '../common/Button';
import '../../styles/components/Mindfulness.css';

const MindfulnessExerciseItem = ({ exercise }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="mindfulness-item-card">
      <h3>{exercise.title}</h3>
      <div className="mindfulness-item-meta">
        <span>Duración: {exercise.duration}</span> | <span>Tipo: {exercise.type}</span>
      </div>
      <p className="mindfulness-item-description">{exercise.description}</p>
      
      {isExpanded && (
        <div className="mindfulness-item-details">
          {exercise.steps && exercise.steps.length > 0 && (
            <>
              <h4>Pasos para sumergirte:</h4>
              <ul>
                {exercise.steps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ul>
            </>
          )}
          {exercise.affirmation && (
            <p className="mindfulness-item-affirmation">"{exercise.affirmation}"</p>
          )}
        </div>
      )}
      
      <Button onClick={() => setIsExpanded(!isExpanded)} variant="secondary" style={{ marginTop: 'auto' }}>
        {isExpanded ? 'Cerrar con gratitud' : 'Explorar este oasis'}
      </Button>
    </div>
  );
};

export default MindfulnessExerciseItem;