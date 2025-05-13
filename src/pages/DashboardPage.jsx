import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import UserProfileSummary from '../components/user/UserProfileSummary';
import { getDailyCardsByUserId } from '../lib/dailyCardService';
import { getGratitudeEntriesByUserId } from '../lib/gratitudeService'; 
import { getSkillModules } from '../lib/skillsService';
import { InlineSpinner } from '../components/common/LoadingSpinner';
import DeliveredLetterModal from '../components/futureSelfLetter/DeliveredLetterModal';
import { getUndeliveredLetters, markLetterAsNotified } from '../lib/futureLetterService';
import { getCurrentStreak } from '../lib/chartUtils';

import '../styles/pages/DashboardPage.css';
import '../styles/components/StreakIndicator.css';
import '../styles/components/FeaturedSkill.css';

const StarIcon = ({ filled, glowing }) => (
  <svg className={`streak-star ${filled ? 'filled' : ''} ${glowing ? 'glowing' : ''}`} viewBox="0 0 24 24" width="28" height="28" fill="currentColor" aria-hidden="true">
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2zM12 5.09l1.63 4.94L19 10.29l-4.28 3.11L15.82 18 12 15.45 8.18 18l1.1-4.6L5 10.29l5.37-.26L12 5.09z"/>
  </svg>
);

const DashboardPage = () => {
  const { currentUser, userPreferences, saveUserPreferences, fetchUserPreferences: refreshUserPreferences } = useAuth();
  const [dailyCardStreak, setDailyCardStreak] = useState(0);
  const [gratitudeStreak, setGratitudeStreak] = useState(0);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [featuredSkill, setFeaturedSkill] = useState(null);
  const [lettersToNotify, setLettersToNotify] = useState([]);
  const [currentLetterModal, setCurrentLetterModal] = useState(null);
  const [gamificationLevel, setGamificationLevel] = useState(0);
  const [dynamicMessage, setDynamicMessage] = useState('');
  const dailyCardStreakRef = useRef(0); 
  const gratitudeStreakRef = useRef(0);

  const unlockAchievement = useCallback(async (achievementId) => {
    if (currentUser && userPreferences) {
      const currentAchievements = userPreferences.achievements || [];
      if (!currentAchievements.includes(achievementId)) {
        try {
          await saveUserPreferences({
            ...userPreferences,
            achievements: [...currentAchievements, achievementId]
          });
          if (refreshUserPreferences) await refreshUserPreferences();
        } catch (error) {
          console.error(`Error al guardar el logro ${achievementId}:`, error);
        }
      }
    }
  }, [currentUser, userPreferences, saveUserPreferences, refreshUserPreferences]);

  const fetchDashboardData = useCallback(async () => {
    if (!currentUser?.$id) {
      setIsLoadingData(false);
      return;
    }
    setIsLoadingData(true);
    try {
      const [dailyCardsResult, gratitudeEntriesResult, modulesResult] = await Promise.all([
        getDailyCardsByUserId(currentUser.$id),
        getGratitudeEntriesByUserId(currentUser.$id),
        getSkillModules()
      ]);

      const dailyCards = dailyCardsResult || [];
      const gratitudeEntries = gratitudeEntriesResult || [];

      const calculatedDailyStreak = getCurrentStreak(dailyCards);
      dailyCardStreakRef.current = calculatedDailyStreak;
      setDailyCardStreak(calculatedDailyStreak);

      const calculatedGratitudeStreak = getCurrentStreak(gratitudeEntries);
      gratitudeStreakRef.current = calculatedGratitudeStreak;
      setGratitudeStreak(calculatedGratitudeStreak);

      const totalEntries = dailyCards.length + gratitudeEntries.length;
      const combinedStreak = calculatedDailyStreak + calculatedGratitudeStreak;

      if (combinedStreak >= 14 && totalEntries >= 20) setGamificationLevel(2);
      else if (combinedStreak >= 7 || totalEntries >= 10) setGamificationLevel(1);
      else setGamificationLevel(0);

      if (calculatedDailyStreak > 0 && calculatedGratitudeStreak > 0) {
        setDynamicMessage(`¡Qué maravilla, ${currentUser.name}! Mantienes vivas tanto tu conexión diaria (${calculatedDailyStreak}d) como tu gratitud (${calculatedGratitudeStreak}d). ¡Sigue brillando! ✨`);
      } else if (calculatedDailyStreak > 3) {
        setDynamicMessage(`¡Tu diario es un reflejo constante de tu hermoso ser interior, ${calculatedDailyStreak} días y contando! 💖`);
      } else if (calculatedGratitudeStreak > 3) {
        setDynamicMessage(`Tu jardín de gratitud florece día a día, ¡ya son ${calculatedGratitudeStreak} pétalos de agradecimiento! 🌸`);
      } else if (totalEntries > 5) {
        setDynamicMessage("Has estado cultivando tu refugio con cariño. ¡Cada entrada es un paso valioso!");
      } else {
        setDynamicMessage("Cada pequeño paso en tu refugio es un acto de amor propio. ¡Estoy aquí para ti, mi vida!");
      }

      if (calculatedDailyStreak >= 7) unlockAchievement('dailyStreak7');
      if (calculatedDailyStreak >= 30) unlockAchievement('dailyStreak30');
      if (calculatedGratitudeStreak >= 7) unlockAchievement('gratitudeStreak7');
      if (calculatedGratitudeStreak >= 30) unlockAchievement('gratitudeStreak30');
      if (dailyCards.length >= 20) unlockAchievement('journalExplorer20');
      if (gratitudeEntries.length >= 20) unlockAchievement('gratitudeExplorer20');
      
      if (modulesResult && modulesResult.length > 0 && dailyCards.length > 0) {
        const allModuleIdsCovered = modulesResult.every(module => 
           dailyCards.some(card => 
               card.cardData?.skillsUsed?.toLowerCase().includes(module.id.toLowerCase().split('-')[0])
           )
       );
     }

      if (modulesResult && modulesResult.length > 0) {
        const allSkills = modulesResult.reduce((acc, module) => [...acc, ...module.skills.map(s => ({ ...s, moduleName: module.name, moduleId: module.id }) )], []);
        if (allSkills.length > 0) {
          setFeaturedSkill(allSkills[Math.floor(Math.random() * allSkills.length)]);
        }
      }

    } catch (error) {
      console.error("Error cargando datos del dashboard:", error);
      setDynamicMessage("Hubo un pequeño tropiezo al cargar tus datos, pero tu refugio sigue aquí para ti.");
      setDailyCardStreak(0);
      setGratitudeStreak(0);
    } finally {
      setIsLoadingData(false);
    }
  }, [currentUser, unlockAchievement]);

  useEffect(() => {
    if (currentUser?.$id) {
        fetchDashboardData();
    } else {
        setIsLoadingData(false); 
    }
  }, [currentUser, fetchDashboardData]);

  useEffect(() => {
    const checkFutureLetters = async () => {
      if (currentUser?.$id) {
        try {
            const undelivered = await getUndeliveredLetters(currentUser.$id);
            if (undelivered.length > 0) {
              setLettersToNotify(undelivered);
              setCurrentLetterModal(undelivered[0]);
            }
        } catch (error) {
            console.error("Error al verificar cartas futuras:", error);
        }
      }
    };
    if (currentUser?.$id) {
        checkFutureLetters();
    }
  }, [currentUser]);

  const handleCloseLetterModal = async () => {
    if (currentLetterModal) {
      try {
          await markLetterAsNotified(currentLetterModal.$id);
          const remainingLetters = lettersToNotify.filter(l => l.$id !== currentLetterModal.$id);
          setLettersToNotify(remainingLetters);
          setCurrentLetterModal(remainingLetters.length > 0 ? remainingLetters[0] : null);
      } catch (error) {
          console.error("Error al marcar la carta como notificada:", error);
      }
    }
  };

  const getEncouragement = (streak, type) => {
    const name = type === 'daily' ? "conexión diaria" : "gratitud";
    if (streak === 0) return `¡Hoy es un lienzo nuevo para tu ${name}!`;
    if (streak === 1) return `¡Primer día cultivando tu ${name}! Qué emoción. 😊`;
    if (streak >= 2 && streak <= 4) return `¡${streak} días nutriendo tu ${name}! Sigue así. 🌷`;
    if (streak >= 5 && streak <= 9) return `¡Increíble, ${streak} días de ${name}! Eres constante. ✨`;
    if (streak >= 10 && streak <= 29) return `¡Wow, ${streak} días de ${name}! Tu compromiso es inspirador. 🌟`;
    if (streak >= 30) return `¡${streak} o más días cultivando tu ${name}! Eres una estrella radiante. 💖🌟`;
    return `¡${streak} días! Sigue adelante con amor.`;
  };

  if (!currentUser && isLoadingData) { 
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', backgroundColor: 'var(--background-soft)' }}>
        <InlineSpinner />
        <p style={{ fontFamily: 'var(--text-body-font)', color: 'var(--text-comfort)', marginTop: 'var(--spacing-md)' }}>
          Abriendo las puertas de tu espacio seguro...
        </p>
      </div>
    );
  }
  
  if (!currentUser) {
      return (
          <div className="dashboard-container text-center" style={{paddingTop: 'var(--spacing-xl)'}}>
              <h1 className="page-title">Bienvenida a Tu Refugio</h1>
              <p className="page-subtitle" style={{marginBottom: 'var(--spacing-lg)'}}>
                  Para personalizar tu experiencia y guardar tu progreso, por favor <Link to="/login" className="highlight-link">inicia sesión</Link> o <Link to="/register" className="highlight-link">crea una cuenta</Link>.
              </p>
          </div>
      );
  }

  return (
    <div className={`dashboard-container dashboard-gamification-level-${gamificationLevel}`}>
      <h1 className="page-title">Tu Lienzo de Bienestar, {currentUser.name || 'Alma Valiente'}</h1>
      <p className="page-subtitle">
        {isLoadingData && !dynamicMessage ? "Cargando tus susurros y colores..." : dynamicMessage}
      </p>

      <UserProfileSummary gamificationLevel={gamificationLevel} currentUser={currentUser} />

      {isLoadingData ? (
        <div className="text-center" style={{ margin: 'var(--spacing-lg) 0' }}>
          <InlineSpinner /> <p>Calculando tus brillos y colores...</p>
        </div>
      ) : (
        <>
          <div className="streaks-container">
            <div className="streak-item">
              <p className="streak-title">
                <StarIcon filled={dailyCardStreak > 0} glowing={dailyCardStreak >= 5} />
                Diario de Días
              </p>
              {dailyCardStreak > 0 && <span className="streak-count">{dailyCardStreak}</span>}
              <span className="streak-encouragement">{getEncouragement(dailyCardStreak, 'daily')}</span>
            </div>
            <div className="streak-item">
              <p className="streak-title">
                <StarIcon filled={gratitudeStreak > 0} glowing={gratitudeStreak >= 5} />
                Jardín de Gratitud
              </p>
              {gratitudeStreak > 0 && <span className="streak-count">{gratitudeStreak}</span>}
              <span className="streak-encouragement">{getEncouragement(gratitudeStreak, 'gratitude')}</span>
            </div>
          </div>

          {featuredSkill && (
            <section className="featured-skill-container">
              <h4 className="featured-skill-title">✨ Susurro de Sabiduría para Hoy ✨</h4>
              <div className="featured-skill-card">
                <h5>{featuredSkill.name}</h5>
                <p className="featured-skill-module">Del módulo: <em>{featuredSkill.moduleName}</em></p>
                <p>{featuredSkill.description?.substring(0, 120)}...</p>
                <Link to={`/skills/${featuredSkill.moduleId}/${featuredSkill.id}`} className="btn btn-secondary btn-sm">
                  Explorar esta habilidad
                </Link>
              </div>
            </section>
          )}
        </>
      )}

      <section className="dashboard-quick-links">
        <Link to="/daily-card/new" className="quick-link-card">
          <h4>Plasmar Mi Día</h4>
          <p>Un espacio para tus reflexiones, emociones y los colores de tu jornada.</p>
        </Link>
        <Link to="/daily-card/history" className="quick-link-card">
          <h4>Mis Capítulos Anteriores</h4>
          <p>Revisa tus tarjetas diarias, un sendero de autoconocimiento y crecimiento.</p>
        </Link>
        <Link to="/gratitude-journal" className="quick-link-card">
          <h4>Jardín de Gratitud</h4>
          <p>Cultiva la alegría apreciando los pequeños y grandes regalos de la vida.</p>
        </Link>
        <Link to="/skills" className="quick-link-card">
          <h4>Florecer con TDC</h4>
          <p>Explora y practica habilidades que nutren tu equilibrio emocional.</p>
        </Link>
        <Link to="/mindfulness" className="quick-link-card">
          <h4>Mi Oasis de Calma</h4>
          <p>Encuentra ejercicios de mindfulness para anclarte en el presente.</p>
        </Link>
        <Link to="/support-plan" className="quick-link-card">
          <h4>Mi Faro de Apoyo</h4>
          <p>Diseña y consulta tu plan personalizado para momentos de necesidad.</p>
        </Link>
      </section>

      {currentLetterModal && (
        <DeliveredLetterModal
          isOpen={!!currentLetterModal}
          onClose={handleCloseLetterModal}
          letter={currentLetterModal}
        />
      )}
    </div>
  );
};

export default DashboardPage;