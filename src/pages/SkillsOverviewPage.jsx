import React from 'react';
import { getSkillModules } from '../lib/skillsService';
import { SkillModuleCard } from '../components/skills/SkillModuleDisplay';
import '../styles/pages/SkillPage.css';

const SkillsOverviewPage = () => {
  const modules = getSkillModules();

  return (
    <div className="skills-page-container container">
      <h1 className="page-title">Tu Jardín de Habilidades TDC</h1>
      <p className="page-subtitle">
        Explora estos módulos como quien pasea por un jardín lleno de sabiduría y herramientas para tu bienestar.
        Cada habilidad es una flor que puedes cultivar con amor y práctica.
      </p>
      {modules && modules.length > 0 ? (
        <div className="skill-module-list">
          {modules.map(module => (
            <SkillModuleCard key={module.id} module={module} />
          ))}
        </div>
      ) : (
        <p className="text-center" style={{ color: 'var(--text-comfort)'}}>
            Parece que las semillas de sabiduría aún no han brotado. ¡Pronto florecerán!
        </p>
      )}
    </div>
  );
};

export default SkillsOverviewPage;