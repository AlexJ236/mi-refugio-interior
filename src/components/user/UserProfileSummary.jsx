import React from 'react';
import useAuth from '../../hooks/useAuth';
import '../../styles/components/UserProfile.css'; 

const UserProfileSummary = ({ gamificationLevel = 0 }) => {
  const { currentUser, userPreferences } = useAuth();

  if (!currentUser) {
    return <p className="text-center" style={{color: 'var(--text-comfort)'}}>Buscando los ecos de tu alma...</p>;
  }

  let gradientClass = 'profile-gradient-base';
  if (gamificationLevel === 1) {
    gradientClass = 'profile-gradient-level1';
  } else if (gamificationLevel >= 2) {
    gradientClass = 'profile-gradient-level2';
  }

  const achievements = userPreferences?.achievements || [];

  return (
    <div className={`user-profile-summary ${gradientClass}`}> 
      <h3>Tu Rincón Sagrado</h3>
      <p className="welcome-message">
        ¡Bienvenida de nuevo, {currentUser.name || 'alma valiente'}!
        {gamificationLevel > 0 && " ✨"}
      </p>
      <p>Este es un espacio creado con amor, solo para ti. Que encuentres aquí la paz y la claridad que mereces.</p>
      <p><strong>Tu faro (email):</strong> {currentUser.email}</p>
      
      {gamificationLevel === 1 && !achievements.includes('dailyStreak7') && !achievements.includes('gratitudeStreak7') && (
        <p className="gamification-perk">¡Tu constancia ilumina este espacio!</p>
      )}
      {gamificationLevel >= 2 && (
        <p className="gamification-perk">¡Tu refugio brilla con la fuerza de tu compromiso! 🌟</p>
      )}

      {/* Mostrar Logros */}
      {achievements.length > 0 && (
        <div className="achievements-preview">
          <p className="achievements-title">Tus Pequeños Grandes Logros:</p>
          <div className="achievements-icons">
            {achievements.includes('dailyStreak7') && <span title="Corazón Constante (7 días de diario)">💖</span>}
            {achievements.includes('gratitudeStreak7') && <span title="Alma Agradecida (7 días de gratitud)">🌸</span>}
            {achievements.includes('dailyStreak30') && <span title="Diario Radiante (30 días)">🗓️✨</span>}
            {achievements.includes('gratitudeStreak30') && <span title="Jardín Floreciente (30 días de gratitud)">🌳💖</span>}
            {achievements.includes('journalExplorer20') && <span title="Exploradora de Diarios (20+ tarjetas)">🗺️</span>}
            {achievements.includes('gratitudeExplorer20') && <span title="Exploradora de Gratitud (20+ entradas)">🌻</span>}
            {/* Añadir más iconos/tooltips para otros logros */}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileSummary;