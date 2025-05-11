import React from 'react';
import MindfulnessExerciseItem from './MindfulnessExerciseItem';
import '../../styles/components/Mindfulness.css';

const MindfulnessExerciseList = ({ exercises }) => {
  if (!exercises || exercises.length === 0) {
    return <p className="mindfulness-empty-message">Aún no hemos plantado ejercicios aquí, pero pronto florecerán oasis de calma para ti.</p>;
  }

  return (
    <div className="mindfulness-list-container">
      {exercises.map(exercise => (
        <MindfulnessExerciseItem key={exercise.id} exercise={exercise} />
      ))}
    </div>
  );
};

export default MindfulnessExerciseList;