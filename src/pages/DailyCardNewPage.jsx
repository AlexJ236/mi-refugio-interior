import React from 'react';
import DailyCardForm from '../components/dailyCard/DailyCardForm';
import '../styles/pages/DailyCardPage.css';

const DailyCardNewPage = () => {
  return (
    <div className="daily-card-page-container container"> {/* Añadido .container para centrar y dar fondo */}
      <h1 className="page-title">Un Nuevo Amanecer en Tu Diario</h1>
      <p className="page-subtitle">
        Cada día es una oportunidad para conocerte un poco más.
        Vierte aquí tus pensamientos y sentimientos con la ternura que mereces.
      </p>
      <DailyCardForm />
    </div>
  );
};

export default DailyCardNewPage;