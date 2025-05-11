import React from 'react';
import { Link, useParams } from 'react-router-dom';
import SkillItem from './SkillItem';
import { getSkillModuleById, getSkillById } from '../../lib/skillsService';
import Button from '../common/Button';
import '../../styles/components/Skill.css';

// Para la lista de tarjetas de módulos en SkillsOverviewPage
export const SkillModuleCard = ({ module }) => {
  const cardStyle = {
    borderColor: module.color || 'var(--secondary-purple)',
  };
  const headerStyle = {
    backgroundColor: module.color || 'var(--secondary-purple)',
  };
   const buttonStyle = {
    borderColor: module.color || 'var(--secondary-purple)',
    color: module.color || 'var(--secondary-purple)',
  };
  const buttonHoverStyle = {
    backgroundColor: module.color || 'var(--secondary-purple)',
  };


  return (
    <Link to={`/skills/${module.id}`} className="skill-module-card" style={cardStyle}>
      <div className="skill-module-card-header" style={headerStyle}>
        <h3 style={{ color: module.textColor || 'var(--text-light)' }}>{module.name}</h3>
      </div>
      <p>{module.description}</p>
      <Button 
        variant="custom"
        className="btn"
        style={buttonStyle}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = buttonHoverStyle.backgroundColor}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
      >
        Explorar este Jardín de Habilidades
      </Button>
    </Link>
  );
};


// Para mostrar un módulo de habilidad y sus habilidades
export const SkillModuleDisplay = () => {
  const { moduleId, skillId } = useParams();
  const module = getSkillModuleById(moduleId);

  if (!module) {
    return <p className="text-center" style={{color: 'var(--text-comfort)'}}>Este sendero de sabiduría no fue encontrado. Quizás necesites un mapa diferente.</p>;
  }

  // Si también hay un skillId, mostramos esa habilidad específica
  if (skillId) {
    const skill = getSkillById(moduleId, skillId);
    return <SkillItem skill={skill} moduleId={moduleId} moduleName={module.name} />;
  }

  // Si no, mostramos la descripción del módulo y la lista de sus habilidades
  return (
    <div className="skill-module-detail-container">
      <p className="module-description">{module.description}</p>
      <h4>Habilidades que florecen en este módulo:</h4>
      <ul className="skill-list-in-module">
        {module.skills.map(skill => (
          <li key={skill.id}>
            <Link to={`/skills/${moduleId}/${skill.id}`}>
              <strong>{skill.name}</strong>
              <span>{skill.description.substring(0,100)}... un camino por descubrir.</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};