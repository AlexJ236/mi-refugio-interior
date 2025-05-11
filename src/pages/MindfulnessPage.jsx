import React, { useState, useEffect } from 'react';
import MindfulnessExerciseList from '../components/mindfulness/MindfulnessExerciseList';
import { getMindfulnessExercises } from '../lib/mindfulnessService';
import { InlineSpinner } from '../components/common/LoadingSpinner';
import '../styles/pages/MindfulnessPage.css';

const MindfulnessPage = () => {
  const [exercises, setExercises] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const fetchedExercises = getMindfulnessExercises();
    setExercises(fetchedExercises);
    setIsLoading(false);
  }, []);

  return (
    <div className="mindfulness-page-container container">
      <h1 className="page-title">Tu Oasis de Mindfulness</h1>
      <p className="page-subtitle">
        Encuentra aquí un respiro, un momento de calma y conexión contigo.
        Estos ejercicios son susurros de serenidad para tu alma.
      </p>
      {isLoading ? (
        <div className="text-center" style={{ margin: 'var(--spacing-xl) 0'}}>
            <p style={{color: 'var(--text-comfort)', marginBottom: 'var(--spacing-md)'}}>Buscando senderos de paz para ti...</p>
            <InlineSpinner />
        </div>
      ) : (
        <MindfulnessExerciseList exercises={exercises} />
      )}
    </div>
  );
};

export default MindfulnessPage;