import React from 'react';
import { PLUTCHIK_EMOTIONS_PRIMARY, PLUTCHIK_EMOTIONS_SECONDARY } from '../../lib/constants';
import '../../styles/components/EmotionWheel.css';

const EmotionWheel = ({ selectedEmotions, onEmotionSelect }) => {

  const handleSelect = (emotionName, isPrimary = true) => {
    const emotionObject = { name: emotionName, intensity: 3 }; // Default intensity
    onEmotionSelect(emotionObject);
  };

  return (
    <div className="emotion-wheel-container">
      <h4>Explora tus emociones (inspirado en Plutchik)</h4>
      <p className="emotion-wheel-instructions">
        Toca una emoción para seleccionarla o deseleccionarla. Puedes ajustar la intensidad luego.
      </p>
      
      <div className="emotion-section">
        <h5>Emociones Primarias</h5>
        <div className="emotion-chips-display">
          {PLUTCHIK_EMOTIONS_PRIMARY.map(emotion => (
            <button
              type="button"
              key={emotion.name}
              className={`emotion-chip-wheel ${selectedEmotions.some(se => se.name === emotion.name) ? 'selected' : ''}`}
              style={{ '--emotion-color': emotion.color }}
              onClick={() => handleSelect(emotion.name, true)}
            >
              {emotion.name}
            </button>
          ))}
        </div>
      </div>

      <div className="emotion-section">
        <h5>Emociones Secundarias (combinaciones)</h5>
        <div className="emotion-chips-display">
          {PLUTCHIK_EMOTIONS_SECONDARY.map(emotion => (
            <button
              type="button"
              key={emotion.name}
              className={`emotion-chip-wheel ${selectedEmotions.some(se => se.name === emotion.name) ? 'selected' : ''}`}
              style={{ '--emotion-color': emotion.color }}
              onClick={() => handleSelect(emotion.name, false)}
            >
              {emotion.name}
            </button>
          ))}
        </div>
      </div>
       <p className="emotion-wheel-note">
        Esta es una representación simplificada. La intensidad y los matices son únicos para ti.
      </p>
    </div>
  );
};

export default EmotionWheel;