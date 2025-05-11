import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../common/Button';
import '../../styles/components/Skill.css';

const SkillItem = ({ skill, moduleId, moduleName }) => {
  if (!skill) {
    return <p className="text-center" style={{color: 'var(--text-comfort)'}}>Esta habilidad parece haberse desvanecido en la niebla del conocimiento. Intenta de nuevo.</p>;
  }

  return (
    <div className="skill-item-container">
      {moduleId && (
        <Link to={`/skills/${moduleId}`} className="back-to-module-link">
          &larr; Volver al módulo "{moduleName || 'anterior'}" con sabiduría
        </Link>
      )}
      <h3>{skill.name}</h3>
      <p className="skill-description"><strong>Un susurro sobre esta habilidad:</strong> {skill.description}</p>
      
      {skill.exercise && (
        <div className="skill-exercise">
          <strong>Un ejercicio para cultivarla en tu corazón:</strong>
          <p>{skill.exercise}</p>
        </div>
      )}

      {skill.guide && moduleId && (
        <div className="skill-guide-link-container">
          <p><strong>Profundiza con una guía interactiva:</strong></p>
          <Link to={`/skills/${moduleId}/${skill.id}/${skill.guide}`}>
            <Button variant="secondary">
              Iniciar Guía: {skill.name}
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default SkillItem;