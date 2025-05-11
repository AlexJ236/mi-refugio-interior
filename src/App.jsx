import React, { useContext, useEffect, createContext } from 'react';
import { Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom';
import { AuthContext } from './contexts/AuthContext';
import Sidebar from './components/layout/Sidebar';
import ProtectedRoute from './components/layout/ProtectedRoute';
import LoadingSpinner from './components/common/LoadingSpinner';
import PauseButtonFeature from './components/common/PauseButtonFeature';
import { THEME_OPTIONS } from './lib/constants';

// Pages
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import DailyCardNewPage from './pages/DailyCardNewPage';
import DailyCardHistoryPage from './pages/DailyCardHistoryPage';
import SkillsOverviewPage from './pages/SkillsOverviewPage';
import SkillDetailPage from './pages/SkillDetailPage';
import SupportPlanPage from './pages/SupportPlanPage';
import SettingsPage from './pages/SettingsPage';
import GratitudeJournalPage from './pages/GratitudeJournalPage';
import MindfulnessPage from './pages/MindfulnessPage';
import FutureSelfLetterPage from './pages/FutureSelfLetterPage';
import ProgressPage from './pages/ProgressPage';
import InteractiveGuidePage from './pages/InteractiveGuidePage';
import EmotionsExplainedPage from './pages/EmotionsExplainedPage';

import './styles/global.css';

export const ThemeContext = createContext({
  currentThemeClass: THEME_OPTIONS[0].class, // Clase CSS del tema
  currentCustomColors: null, // Objeto de colores si es custom
  toggleTheme: () => {}, // Función para cambiar el tema
  themeOptions: THEME_OPTIONS,
});

const applyCustomThemeToDOM = (colors) => {
  if (colors && typeof colors === 'object') {
    THEME_OPTIONS.forEach(opt => document.body.classList.remove(opt.class));
    document.body.classList.add('custom-theme-active');
    for (const [variable, value] of Object.entries(colors)) {
      document.documentElement.style.setProperty(variable, value);
    }
  }
};

const removeCustomThemeFromDOM = () => {
  const initialCustomColors = {
    '--primary-pink': '', '--secondary-purple': '', '--accent-lavender': '',
    '--background-soft': '', '--card-bg': '', '--text-main': '', 
    '--text-comfort': '', '--text-light': '',
  };
  for (const variable of Object.keys(initialCustomColors)) {
    document.documentElement.style.removeProperty(variable);
  }
  document.body.classList.remove('custom-theme-active');
};

function App() {
  const { 
    currentUser, 
    userPreferences,
    isLoadingAuth, 
    isLoadingPreferences,
    saveUserPreferences 
  } = useContext(AuthContext);
  const location = useLocation();

  useEffect(() => {
    const applyTheme = () => {
      let themeToApplyClass = localStorage.getItem('appTheme') || THEME_OPTIONS[0].class;
      let customColorsToApply = null;

      if (userPreferences) { // Si hay preferencias de la BD, estas tienen prioridad
        themeToApplyClass = userPreferences.theme || THEME_OPTIONS[0].class;
        if (themeToApplyClass === 'custom' && userPreferences.customThemeColors) {
          try {
            customColorsToApply = JSON.parse(userPreferences.customThemeColors);
          } catch (e) {
            console.error("Error parseando customThemeColors de userPreferences:", e);
            themeToApplyClass = THEME_OPTIONS[0].class; // Fallback
          }
        }
      } else if (themeToApplyClass === 'custom') { // Si no hay userPrefs pero localStorage dice 'custom'
        const storedCustomJSON = localStorage.getItem('customThemeColors');
        if (storedCustomJSON) {
          try {
            customColorsToApply = JSON.parse(storedCustomJSON);
          } catch (e) {
            themeToApplyClass = THEME_OPTIONS[0].class; // Fallback
          }
        } else {
          themeToApplyClass = THEME_OPTIONS[0].class; // Fallback
        }
      }
      
      // Aplicar el tema determinado
      if (themeToApplyClass === 'custom' && customColorsToApply) {
        applyCustomThemeToDOM(customColorsToApply);
      } else {
        removeCustomThemeFromDOM();
        THEME_OPTIONS.forEach(opt => document.body.classList.remove(opt.class)); // Limpiar por si acaso
        document.body.className = themeToApplyClass; // Aplicar clase del tema predefinido
      }
    };

    if (!isLoadingAuth && !isLoadingPreferences) { // Aplicar solo cuando las cargas hayan terminado
        applyTheme();
    } else if (!currentUser && !isLoadingAuth) { // Si no hay usuario y auth no carga (logout o primera visita)
        removeCustomThemeFromDOM();
        document.body.className = THEME_OPTIONS[0].class;
        localStorage.removeItem('appTheme');
        localStorage.removeItem('customThemeColors');
    }

  }, [userPreferences, currentUser, isLoadingAuth, isLoadingPreferences]);


  const handleToggleTheme = (themeIdOrClass, customColorsObject = null) => {
    if (!currentUser) { // Si no hay usuario, aplicar solo localmente
      if (themeIdOrClass === 'custom' && customColorsObject) {
        applyCustomThemeToDOM(customColorsObject);
      } else {
        const predefTheme = THEME_OPTIONS.find(opt => opt.id === themeIdOrClass || opt.class === themeIdOrClass);
        if (predefTheme) {
          removeCustomThemeFromDOM();
          document.body.className = predefTheme.class;
          localStorage.setItem('appTheme', predefTheme.class);
          localStorage.removeItem('customThemeColors');
        }
      }
      return;
    }

    // Lógica para guardar en la BD
    let themeToPersistInDB;
    let customColorsJSONToPersist = null;

    if (themeIdOrClass === 'custom' && customColorsObject) {
        themeToPersistInDB = 'custom';
        customColorsJSONToPersist = JSON.stringify(customColorsObject);
        // La aplicación visual ya la hizo applyCustomThemeToDOM desde SettingsPage o esta misma función
    } else {
        const predefTheme = THEME_OPTIONS.find(opt => opt.id === themeIdOrClass || opt.class === themeIdOrClass);
        if (predefTheme) {
            themeToPersistInDB = predefTheme.class;
            // La aplicación visual ya la hizo el cambio de className en SettingsPage o esta misma función
        } else {
            return; 
        }
    }

    saveUserPreferences({ 
        theme: themeToPersistInDB, 
        showProgressGraphs: userPreferences?.showProgressGraphs !== undefined ? userPreferences.showProgressGraphs : true,
        customThemeColors: customColorsJSONToPersist,
        achievements: userPreferences?.achievements || []
    }).catch(error => {
        console.error("Error al guardar el tema desde App.jsx handleToggleTheme:", error);
    });
  };


  if (isLoadingAuth || (currentUser && isLoadingPreferences && !userPreferences && !localStorage.getItem('appTheme'))) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', backgroundColor: 'var(--background-soft)' }}>
        <LoadingSpinner />
        <p style={{ fontFamily: 'var(--text-body-font)', color: 'var(--text-comfort)', marginTop: 'var(--spacing-md)' }}>
          {isLoadingAuth ? "Abriendo las puertas de tu espacio seguro..." : "Preparando tus colores con cariño..."}
        </p>
      </div>
    );
  }

  const showSidebar = currentUser && location.pathname !== '/login';
  const determinedThemeClass = userPreferences?.theme === 'custom' 
    ? 'custom' 
    : (userPreferences?.theme || localStorage.getItem('appTheme') || THEME_OPTIONS[0].class);
  
  const determinedCustomColors = userPreferences?.customThemeColors 
    ? JSON.parse(userPreferences.customThemeColors) 
    : (localStorage.getItem('customThemeColors') ? JSON.parse(localStorage.getItem('customThemeColors')) : null);

  return (
    <ThemeContext.Provider value={{ 
        currentThemeClass: determinedThemeClass, 
        currentCustomColors: determinedCustomColors,
        toggleTheme: handleToggleTheme, 
        themeOptions: THEME_OPTIONS 
    }}>
      <div className={`app-container-with-sidebar ${showSidebar ? 'has-sidebar' : 'no-sidebar'}`}>
        {showSidebar && <Sidebar />}
        {currentUser && <PauseButtonFeature initialDuration={5} />}
        <main className="main-content-area">
          <Routes>
            <Route path="/login" element={currentUser ? <Navigate to="/dashboard" /> : <LoginPage />} />
            <Route element={<ProtectedRoute><Outlet /></ProtectedRoute>}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/daily-card/new" element={<DailyCardNewPage />} />
              <Route path="/daily-card/edit/:cardId" element={<DailyCardNewPage />} />
              <Route path="/daily-card/history" element={<DailyCardHistoryPage />} />
              <Route path="/skills" element={<SkillsOverviewPage />} />
              <Route path="/skills/:moduleId" element={<SkillDetailPage />} />
              <Route path="/skills/:moduleId/:skillId" element={<SkillDetailPage />} />
              <Route path="/skills/:moduleId/:skillId/:guideId" element={<InteractiveGuidePage />} />
              <Route path="/learn/emotions" element={<EmotionsExplainedPage />} />
              <Route path="/gratitude-journal" element={<GratitudeJournalPage />} />
              <Route path="/mindfulness" element={<MindfulnessPage />} />
              <Route path="/support-plan" element={<SupportPlanPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/future-letter" element={<FutureSelfLetterPage />} />
              <Route path="/my-progress" element={<ProgressPage />} />
            </Route>
            <Route path="*" element={<Navigate to={currentUser ? "/dashboard" : "/login"} />} />
          </Routes>
        </main>
      </div>
    </ThemeContext.Provider>
  );
}
export default App;