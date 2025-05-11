import React from 'react';
import '../../styles/components/ThemePreview.css';

const ThemePreview = ({ customColors }) => {
  // Aplicar los colores directamente como estilos en línea para la vista previa
  const previewStyle = {
    '--preview-primary-pink': customColors['--primary-pink'],
    '--preview-secondary-purple': customColors['--secondary-purple'],
    '--preview-accent-lavender': customColors['--accent-lavender'],
    '--preview-background-soft': customColors['--background-soft'],
    '--preview-text-main': customColors['--text-main'],
    '--preview-text-comfort': customColors['--text-comfort'],
  };

  return (
    <div className="theme-preview-area" style={previewStyle}>
      <h4>Vista Previa de Tu Tema Mágico</h4>
      <div className="preview-card">
        <h5 className="preview-card-title">Título de Ejemplo</h5>
        <p className="preview-card-text">
          Este es un texto de ejemplo para que veas cómo lucen tus colores con cariño y amor.
          Puedes ajustar cada detalle para que tu refugio sea perfecto para ti.
        </p>
        <div className="preview-buttons">
          <button className="preview-btn preview-btn-primary">Botón Primario</button>
          <button className="preview-btn preview-btn-secondary">Botón Secundario</button>
        </div>
      </div>
      <p className="preview-note">
        La aplicación completa usará estos colores de formas más complejas. ¡Experimenta con alegría!
      </p>
    </div>
  );
};

export default ThemePreview;