import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import UserProfileSummary from '../components/user/UserProfileSummary';
import { getDailyCardsByUserId } from '../lib/dailyCardService';
import { getGratitudeEntriesByUserId } from '../lib/gratitudeService';
import { getSkillModules } from '../lib/skillsService';
import { addAchievement as saveNewAchievement } from '../lib/userPreferenceService';
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
  const [isLoadingData, setIsLoadingData] = useState(true); // Unificado para toda la data del dashboard
  const [featuredSkill, setFeaturedSkill] = useState(null);
  const [lettersToNotify, setLettersToNotify] = useState([]);
  const [currentLetterModal, setCurrentLetterModal] = useState(null);
  const [gamificationLevel, setGamificationLevel] = useState(0);
  const [dynamicMessage, setDynamicMessage] = useState('');

  const unlockAchievement = useCallback(async (achievementId) => {
    if (currentUser && userPreferences) { // Asegurar que userPreferences esté cargado
      const currentAchievements = userPreferences.achievements || [];
      if (!currentAchievements.includes(achievementId)) {
        console.log(`Intentando desbloquear logro: ${achievementId} para ${currentUser.$id}`);
        try {
          // Directamente actualizamos las preferencias a través de saveUserPreferences del contexto
          // Esto asegura que el estado global de userPreferences se actualice también.
          await saveUserPreferences({
            ...userPreferences, // Pasar las preferencias actuales para no perder theme o showProgressGraphs
            achievements: [...currentAchievements, achievementId]
          });
          console.log(`Logro ${achievementId} desbloqueado y preferencias actualizadas.`);
        } catch (error) {
          console.error(`Error al guardar el logro ${achievementId}:`, error);
        }
      }
    }
  }, [currentUser, userPreferences, saveUserPreferences, refreshUserPreferences]);

  const fetchDashboardData = useCallback(async () => {
    if (!currentUser) {
      setIsLoadingData(false);
      return;
    }
    setIsLoadingData(true);
    try {
      const [dailyCards, gratitudeEntriesResult, modulesResult] = await Promise.all([
        getDailyCardsByUserId(currentUser.$id),
        getGratitudeEntriesByUserId(currentUser.$id),
        Promise.resolve(getSkillModules())
      ]);

      const dcStreak = getCurrentStreak(dailyCards || []);
      const grStreak = getCurrentStreak(gratitudeEntriesResult || []);
      setDailyCardStreak(dcStreak);
      setGratitudeStreak(grStreak);
      
      const totalEntries = (dailyCards?.length || 0) + (gratitudeEntriesResult?.length || 0);
      const combinedStreak = dcStreak + grStreak;

      if (combinedStreak >= 14 && totalEntries >= 20) setGamificationLevel(2); // Ejemplo: Nivel alto
      else if (combinedStreak >= 7 || totalEntries >= 10) setGamificationLevel(1); // Ejemplo: Nivel medio
      else setGamificationLevel(0);

      if (dcStreak > 0 && grStreak > 0) {
          setDynamicMessage(`¡Qué maravilla, ${currentUser.name}! Mantienes vivas tanto tu conexión diaria (${dcStreak}d) como tu gratitud (${grStreak}d). ¡Sigue brillando! ✨`);
      } else if (dcStreak > 3) {
          setDynamicMessage(`¡Tu diario es un reflejo constante de tu hermoso ser interior, ${dcStreak} días y contando! 💖`);
      } else if (grStreak > 3) {
          setDynamicMessage(`Tu jardín de gratitud florece día a día, ¡ya son ${grStreak} pétalos de agradecimiento! 🌸`);
      } else if (totalEntries > 5) {
          setDynamicMessage("Has estado cultivando tu refugio con cariño. ¡Cada entrada es un paso valioso!");
      } else {
          setDynamicMessage("Cada pequeño paso en tu refugio es un acto de amor propio. ¡Estoy aquí para ti, mi vida!");
      }

      // Lógica de Logros
      if (dcStreak >= 7) unlockAchievement('dailyStreak7');
      if (dcStreak >= 30) unlockAchievement('dailyStreak30');
      if (grStreak >= 7) unlockAchievement('gratitudeStreak7');
      if (grStreak >= 30) unlockAchievement('gratitudeStreak30');
      if ((dailyCards?.length || 0) >= 20) unlockAchievement('journalExplorer20');
      if ((gratitudeEntriesResult?.length || 0) >= 20) unlockAchievement('gratitudeExplorer20');
      if (modulesResult.every(module => dailyCards?.some(card => card.cardData?.skillsUsed?.toLowerCase().includes(module.id.toLowerCase().split('-')[0])))) {
      }


      if (modulesResult && modulesResult.length > 0) {
        const allSkills = modulesResult.reduce((acc, module) => [...acc, ...module.skills.map(s => ({...s, moduleName: module.name, moduleId: module.id }))], []);
        if (allSkills.length > 0) {
          setFeaturedSkill(allSkills[Math.floor(Math.random() * allSkills.length)]);
        }
      }
    } catch (error) {
      console.error("Error cargando datos del dashboard:", error);
      setDynamicMessage("Hubo un pequeño tropiezo al cargar tus datos, pero tu refugio sigue aquí para ti.");
    } finally {
      setIsLoadingData(false);
    }
  }, [currentUser, unlockAchievement]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  useEffect(() => {
    const checkFutureLetters = async () => {
      if (currentUser && currentUser.$id) { // Asegurar que currentUser y su $id existen
        const undelivered = await getUndeliveredLetters(currentUser.$id);
        if (undelivered.length > 0) {
          setLettersToNotify(undelivered);
          setCurrentLetterModal(undelivered[0]); 
        }
      }
    };
    if (currentUser) checkFutureLetters();
  }, [currentUser]); // Depender solo de currentUser

  const handleCloseLetterModal = async () => {
    if (currentLetterModal) {
      await markLetterAsNotified(currentLetterModal.$id);
      const remainingLetters = lettersToNotify.filter(l => l.$id !== currentLetterModal.$id);
      setLettersToNotify(remainingLetters);
      setCurrentLetterModal(remainingLetters.length > 0 ? remainingLetters[0] : null);
    }
  };

  const getEncouragement = (streak, type) => {
    const name = type === 'daily' ? "conexión diaria" : "gratitud";
    if (streak === 0) return `¡Hoy es un lienzo nuevo para tu ${name}!`;
    if (streak === 1) return `¡Primer día cultivando tu ${name}! Qué emoción. 😊`;
    if (streak >= 2 && streak <= 4) return `¡${streak} días nutriendo tu ${name}! Sigue así. 🌷`;
    if (streak >= 5 && streak <= 9) return `¡Increíble, ${streak} días de ${name}! Eres constante. ✨`;
    if (streak >= 10 && streak <= 29) return `¡Wow, ${streak} días de ${name}! Tu compromiso es inspirador. 🌟`;
    if (streak >=30) return `¡Más de ${streak} días cultivando tu ${name}! Eres una estrella radiante. 💖🌟`
    return `¡${streak} días! Sigue adelante con amor.`;
  };

  if (isLoadingData && !currentUser) { // Si no hay usuario y está cargando auth, mostrar spinner global
      return (
         <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', backgroundColor: 'var(--background-soft)' }}>
            <InlineSpinner />
            <p style={{ fontFamily: 'var(--text-body-font)', color: 'var(--text-comfort)', marginTop: 'var(--spacing-md)' }}>
            Abriendo las puertas de tu espacio seguro...
            </p>
        </div>
      )
  }


  return (
    <div className={`dashboard-container dashboard-gamification-level-${gamificationLevel}`}>
      <h1 className="page-title">Tu Lienzo de Bienestar, {currentUser?.name || 'Alma Valiente'}</h1>
      <p className="page-subtitle">
        {isLoadingData ? "Cargando tus susurros y colores..." : dynamicMessage}
      </p>
      
      <UserProfileSummary gamificationLevel={gamificationLevel} />

      {isLoadingData ? (
        <div className="text-center" style={{margin: 'var(--spacing-lg) 0'}}><InlineSpinner /> <p>Calculando tus brillos y colores...</p></div>
      ) : (
        <>
        <div className="streaks-container">
          <div className="streak-item">
            <p className="streak-title">
              <StarIcon filled={dailyCardStreak > 0} glowing={dailyCardStreak >= 5} /> {/* Brillo a los 5 días */}
              Diario de Días
            </p>
            {dailyCardStreak > 0 && <span className="streak-count">{dailyCardStreak}</span>}
            <span className="streak-encouragement">{getEncouragement(dailyCardStreak, 'daily')}</span>
          </div>
          <div className="streak-item">
            <p className="streak-title">
              <StarIcon filled={gratitudeStreak > 0} glowing={gratitudeStreak >= 5} /> {/* Brillo a los 5 días */}
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
                <p>{featuredSkill.description.substring(0, 120)}...</p>
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