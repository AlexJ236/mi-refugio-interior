import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import Button from '../common/Button';
import Modal from '../common/Modal';
import { InlineSpinner } from '../common/LoadingSpinner';
import { databases } from '../../lib/appwriteClient';
import { Query } from 'appwrite';
import { MY_EMERGENCY_CONTACT } from '../../lib/constants';
import '../../styles/components/Sidebar.css';
import '../../styles/components/SOSModal.css';

// Iconos
const HomeIcon = () => <span role="img" aria-label="Inicio" className="nav-icon">✨</span>;
const DailyCardIcon = () => <span role="img" aria-label="Tarjeta Diaria" className="nav-icon">✏️</span>;
const HistoryIcon = () => <span role="img" aria-label="Historial" className="nav-icon">📖</span>;
const GratitudeIcon = () => <span role="img" aria-label="Gratitud" className="nav-icon">🌸</span>;
const SkillsIcon = () => <span role="img" aria-label="Habilidades" className="nav-icon">💪</span>;
const EmotionsIcon = () => <span role="img" aria-label="Emociones" className="nav-icon">💖</span>;
const MindfulnessIcon = () => <span role="img" aria-label="Mindfulness" className="nav-icon">🧘‍♀️</span>;
const SupportPlanIcon = () => <span role="img" aria-label="Plan de Apoyo" className="nav-icon">🆘</span>;
const FutureLetterIcon = () => <span role="img" aria-label="Carta al Futuro" className="nav-icon">💌</span>;
const ProgressIcon = () => <span role="img" aria-label="Progreso" className="nav-icon">📊</span>;
const SettingsIcon = () => <span role="img" aria-label="Ajustes" className="nav-icon">⚙️</span>;


const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID_SUPPORT_PLANS = import.meta.env.VITE_APPWRITE_COLLECTION_ID_SUPPORT_PLANS;

const Sidebar = () => {
  const { currentUser, logout, isLoadingAuth, userPreferences } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpenMobile, setIsSidebarOpenMobile] = useState(false);
  const [showSOSModal, setShowSOSModal] = useState(false);
  const [supportPlanData, setSupportPlanData] = useState(null);
  const [isLoadingSOS, setIsLoadingSOS] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      setIsSidebarOpenMobile(false);
      navigate('/login');
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const handleOpenSOSModal = async () => {
    setIsSidebarOpenMobile(false); // Cerrar sidebar principal si está abierta en móvil
    setShowSOSModal(true);
    if (!currentUser || !COLLECTION_ID_SUPPORT_PLANS) return;
    setIsLoadingSOS(true);
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID_SUPPORT_PLANS,
        [Query.equal('userId', currentUser.$id), Query.limit(1)]
      );
      setSupportPlanData(response.documents.length > 0 ? response.documents[0] : null);
    } catch (error) {
      console.error("Error cargando plan de apoyo para SOS:", error);
      setSupportPlanData(null);
    } finally {
      setIsLoadingSOS(false);
    }
  };

  const closeSidebar = () => {
    setIsSidebarOpenMobile(false);
  };
  
  const toggleMobileSidebar = () => {
    setIsSidebarOpenMobile(prev => !prev);
  }

  if (isLoadingAuth && !currentUser) { 
    return null; 
  }

  const navLinkClass = ({ isActive }) => `sidebar-nav-link ${isActive ? "active" : ""}`;

  return (
    <>
      {/* Sidebar para escritorio */}
      {!isSidebarOpenMobile && (
          <button
            className="sidebar-mobile-toggle"
            onClick={toggleMobileSidebar}
            aria-label="Abrir menú de navegación"
            aria-expanded={isSidebarOpenMobile}
            aria-controls="main-sidebar"
          >
            <span aria-hidden="true">☰</span>
          </button>
        )}

      <aside 
        id="main-sidebar" 
        className={`sidebar-beautiful ${isSidebarOpenMobile ? 'open' : ''}`}
      >
        <button 
          className="sidebar-internal-close-toggle" 
          onClick={closeSidebar}
          aria-label="Cerrar menú de navegación"
        >
           <span aria-hidden="true">✕</span>
        </button>
      
      {isSidebarOpenMobile && <div className="sidebar-overlay" onClick={closeSidebar}></div>}

        <div className="sidebar-sticky-content">
          <Link to={currentUser ? "/dashboard" : "/login"} className="sidebar-brand-beautiful" onClick={closeSidebar}>
            Mi Refugio Interior
          </Link>

          {currentUser && (
            <nav className="sidebar-nav">
              <ul>
                <li><NavLink to="/dashboard" className={navLinkClass} onClick={closeSidebar}><HomeIcon /> Mi Inicio Luminoso</NavLink></li>
                <li><NavLink to="/daily-card/new" className={navLinkClass} onClick={closeSidebar}><DailyCardIcon /> Escribir Hoy</NavLink></li>
                <li><NavLink to="/daily-card/history" className={navLinkClass} onClick={closeSidebar}><HistoryIcon /> Recuerdos Diarios</NavLink></li>
                <li><NavLink to="/gratitude-journal" className={navLinkClass} onClick={closeSidebar}><GratitudeIcon /> Diario de Gratitud</NavLink></li>
                <li><NavLink to="/skills" className={navLinkClass} onClick={closeSidebar}><SkillsIcon /> Habilidades TDC</NavLink></li>
                <li><NavLink to="/learn/emotions" className={navLinkClass} onClick={closeSidebar}><EmotionsIcon /> Viaje de Emociones</NavLink></li>
                <li><NavLink to="/mindfulness" className={navLinkClass} onClick={closeSidebar}><MindfulnessIcon /> Oasis Mindfulness</NavLink></li>
                <li><NavLink to="/support-plan" className={navLinkClass} onClick={closeSidebar}><SupportPlanIcon /> Plan de Apoyo</NavLink></li>
                <li><NavLink to="/future-letter" className={navLinkClass} onClick={closeSidebar}><FutureLetterIcon /> Cartas al Futuro</NavLink></li>
                {userPreferences?.showProgressGraphs && (
                    <li><NavLink to="/my-progress" className={navLinkClass} onClick={closeSidebar}><ProgressIcon /> Mis Avances</NavLink></li>
                )}
                <li><NavLink to="/settings" className={navLinkClass} onClick={closeSidebar}><SettingsIcon /> Ajustes Personales</NavLink></li>
              </ul>
            </nav>
          )}
          {!currentUser && (
             <nav className="sidebar-nav">
                 <ul>
                    <li><NavLink to="/login" className={navLinkClass} onClick={closeSidebar}>Acceder a Tu Refugio</NavLink></li>
                 </ul>
             </nav>
          )}
        </div>

        {currentUser && (
          <div className="sidebar-footer">
             <div className="sidebar-user-info">
                 <span>Bienvenida,</span>
                 <span className="user-name">{currentUser.name || 'alma valiente'}</span>
             </div>
            <Button onClick={handleOpenSOSModal} variant="danger" className="btn-sos-sidebar">
              ❤️ SOS Refugio
            </Button>
            <Button onClick={handleLogout} variant="link" className="btn-logout-sidebar">
              Despedirme con Paz
            </Button>
          </div>
        )}
      </aside>
      {/* Overlay para cerrar sidebar en móvil al hacer clic fuera */}
      {isSidebarOpenMobile && <div className="sidebar-overlay" onClick={closeSidebar}></div>}

      {/* Modal SOS (sin cambios) */}
      <Modal
        isOpen={showSOSModal}
        onClose={() => setShowSOSModal(false)}
        title="Tu Ancla en la Tormenta ⚓"
      >
        {/* ... contenido del modal SOS ... */}
        {isLoadingSOS ? (
          <div className="text-center"><InlineSpinner /> <p>Buscando tu brújula...</p></div>
        ) : (
          <div className="sos-modal-content">
            <p className="sos-message">
              Chiquita, si estás aquí, recuerda que no estás sola. Respira profundo.
              Mira tu plan de apoyo. Escríbeme o llámame. Love you so much ❤️.
            </p>
            <div className="sos-section">
              <h4>Contactos de Emergencia:</h4>
              <ul className="sos-contact-list">
                <li><strong>{MY_EMERGENCY_CONTACT.name}:</strong> <a href={`tel:${MY_EMERGENCY_CONTACT.phone}`}>{MY_EMERGENCY_CONTACT.phone}</a></li>
                {supportPlanData?.crisisContacts ? (
                   supportPlanData.crisisContacts.split('\n').map((contact, index) => contact.trim() && <li key={index}>{contact}</li>)
                ) : (
                  <li>No has añadido otros contactos en tu plan. ¡Estoy aquí para ti!</li>
                )}
              </ul>
            </div>
            <div className="sos-section">
              <h4>Tus Estrategias de Afrontamiento Favoritas:</h4>
              {supportPlanData?.copingStrategies ? (
                <p style={{whiteSpace: 'pre-wrap'}}>{supportPlanData.copingStrategies}</p>
              ) : (
                <p>Recuerda las habilidades que te dan calma. Puedes consultarlas en tu <Link to="/support-plan" onClick={()=>{setShowSOSModal(false); closeSidebar();}}>Plan de Apoyo completo</Link>.</p>
              )}
            </div>
            <Button onClick={() => { navigate('/support-plan'); setShowSOSModal(false); closeSidebar();}} variant="primary">
                Ir a mi Plan de Apoyo Completo
            </Button>
          </div>
        )}
      </Modal>
    </>
  );
};

export default Sidebar;