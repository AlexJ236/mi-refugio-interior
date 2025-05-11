import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { getSkillModuleById } from '../lib/skillsService';
import { SkillModuleDisplay } from '../components/skills/SkillModuleDisplay';
import { InlineSpinner } from '../components/common/LoadingSpinner';
import '../styles/pages/SkillPage.css';

const SkillDetailPage = () => {
  const { moduleId } = useParams(); // skillId es manejado dentro de SkillModuleDisplay
  const module = getSkillModuleById(moduleId);

  if (!module) {
    // Podríamos tener un estado de carga aquí si los módulos vinieran de una API
    return (
        <div className="skills-page-container container loading-skills-message">
            <p>Buscando el mapa de esta sabiduría...</p>
            <InlineSpinner />
        </div>
    );
  }

  return (
    <div className="skills-page-container container">
      <h1 className="skill-detail-page-title">Explorando: {module.name}</h1>
      <Link to="/skills" className="back-to-module-link" style={{display: 'block', textAlign: 'center', marginBottom: 'var(--spacing-lg)'}}>
        &larr; Volver al Jardín de Habilidades
      </Link>
      <SkillModuleDisplay /> {/* Este componente maneja si mostrar el módulo o una habilidad específica */}
    </div>
  );
};

export default SkillDetailPage;