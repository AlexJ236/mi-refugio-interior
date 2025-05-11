import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getSkillModuleById, getSkillById, getInteractiveGuideData } from '../lib/skillsService';
import Button from '../components/common/Button';
import InputField from '../components/common/InputField';
import { InlineSpinner } from '../components/common/LoadingSpinner';
import '../styles/pages/InteractiveGuidePage.css';

const InteractiveGuidePage = () => {
  const { moduleId, skillId, guideId } = useParams();
  const navigate = useNavigate();
  const [moduleInfo, setModuleInfo] = useState(null);
  const [skill, setSkill] = useState(null);
  const [guideData, setGuideData] = useState(null);
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const currentModule = getSkillModuleById(moduleId);
    const currentSkill = getSkillById(moduleId, skillId);
    const currentGuideData = getInteractiveGuideData(guideId);

    if (!currentModule || !currentSkill || !currentGuideData || currentSkill.guide !== guideId) {
      console.warn("Datos de guía inválidos o no coincidentes, redirigiendo.", { moduleId, skillId, guideId, currentSkillGuide: currentSkill?.guide });
      navigate('/skills', { replace: true });
      return;
    }

    setModuleInfo(currentModule);
    setSkill(currentSkill);
    setGuideData(currentGuideData);
    
    const initialData = {};
    const itemsToInitialize = currentGuideData.steps || currentGuideData.sections || [];
    itemsToInitialize.forEach(item => {
        if (item.id) { // Solo inicializar si el item tiene un ID para el estado
            if (item.type === 'checkbox') initialData[item.id] = false;
            else if (item.type === 'pros-cons-list') initialData[item.id] = [{pro: '', con: ''}];
            else if (item.type === 'rating' && item.options) initialData[item.id] = item.options[Math.floor(item.options.length / 2)] || '';
            else if (item.type !== 'divider') initialData[item.id] = '';
        }
    });
    setFormData(initialData);
    setIsLoading(false);
  }, [moduleId, skillId, guideId, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };
  
  const handleProsConsChange = (listId, index, type, value) => {
    setFormData(prev => {
        const newList = [...(prev[listId] || [])];
        if (!newList[index]) newList[index] = { pro: '', con: '' };
        newList[index][type] = value;
        return { ...prev, [listId]: newList };
    });
  };

  const addProsConsRow = (listId) => {
    setFormData(prev => ({ ...prev, [listId]: [...(prev[listId] || []), {pro: '', con: ''}] }));
  };

  const handleSubmitGuide = (e) => {
    e.preventDefault();
    console.log("Datos de la guía interactiva (simulación de envío):", formData);
  };

  if (isLoading) {
    return (
      <div className="loading-full-page">
        <InlineSpinner />
        <p>Preparando tu guía con cariño y sabiduría...</p>
      </div>
    );
  }

  if (!guideData || !skill || !moduleInfo) {
    return (
        <div className="interactive-guide-page container text-center">
             <p>No se pudo cargar la guía. Por favor, <Link to="/skills" className="highlight-link">vuelve al jardín de habilidades</Link> e inténtalo de nuevo.</p>
        </div>
    );
  }
  
  const renderStepOrSectionInput = (item, itemIndex) => {
    const id = item.id || `guide-item-${itemIndex}-${item.type}`; // ID más único
    const value = formData[id] === undefined ? (item.type === 'checkbox' ? false : '') : formData[id];


    switch (item.type) {
      case 'text':
      case 'textarea':
        return (
          <InputField
            key={id} id={id} name={id}
            label={item.question || item.instruction}
            type={item.type === 'textarea' ? 'textarea' : 'text'}
            value={value} onChange={handleChange}
            placeholder={item.example || 'Escribe aquí con el corazón...'}
            textarea={item.type === 'textarea'}
            rows={item.type === 'textarea' ? (item.rows || 4) : undefined}
          />
        );
      case 'radio':
        return (
          <div key={id} className="form-group radio-group-vertical">
            <label className="input-label">{item.question}</label>
            {item.options && item.options.map((opt, optIndex) => (
              <label key={`${id}-${optIndex}`} className="radio-option-label">
                <input type="radio" name={id} value={typeof opt === 'object' ? opt.value : opt} checked={value === (typeof opt === 'object' ? opt.value : opt)} onChange={handleChange} />
                {typeof opt === 'object' ? opt.label : opt}
              </label>
            ))}
          </div>
        );
      case 'rating':
        return (
          <div key={id} className="form-group">
            <label htmlFor={id} className="input-label">{item.question}</label>
            <select id={id} name={id} value={value} onChange={handleChange} className="input-element">
              <option value="" disabled>Elige una intensidad...</option>
              {item.options && item.options.map((opt, optIndex) => <option key={`${id}-opt-${optIndex}`} value={opt}>{opt}</option>)}
            </select>
          </div>
        );
       case 'pros-cons-list':
        return (
            <div key={id} className="pros-cons-section form-group">
                <label className="input-label">{item.question || item.instruction}</label>
                {item.note && <p className="pros-cons-note">{item.note}</p>}
                {(formData[id] || [{pro:'', con:''}]).map((pair, index) => (
                    <div key={index} className="pros-cons-row">
                        <InputField id={`pro-${id}-${index}`} name={`pro-${id}-${index}`} label={`Ventaja / Pro ${index + 1}`} value={pair.pro || ''} onChange={(e) => handleProsConsChange(id, index, 'pro', e.target.value)} placeholder="Aspecto positivo..." textarea rows={2}/>
                        <InputField id={`con-${id}-${index}`} name={`con-${id}-${index}`} label={`Desventaja / Contra ${index + 1}`} value={pair.con || ''} onChange={(e) => handleProsConsChange(id, index, 'con', e.target.value)} placeholder="Aspecto negativo..." textarea rows={2}/>
                    </div>
                ))}
                <Button type="button" onClick={() => addProsConsRow(id)} variant="secondary" className="btn-sm add-pros-cons-btn">
                    + Añadir Fila de Pros/Contras
                </Button>
            </div>
        );
      case 'checkbox':
        return (
             <div key={id} className="form-group input-field-group checkbox-group">
                <input type="checkbox" id={id} name={id} checked={!!value} onChange={handleChange} className="input-checkbox"/>
                <label htmlFor={id} className="input-label-checkbox">{item.label || item.instruction}</label>
            </div>
        );
      case 'divider':
        return (
          <div key={id} className="guide-divider">
            {item.label && <h4>{item.label}</h4>}
          </div>
        );
      default: 
        return (
            <div key={id} className="guide-section-display">
                {item.instruction && <p className="instruction-text">{item.instruction}</p>}
                {item.example && <p className="guide-example"><em>Por ejemplo: {item.example}</em></p>}
            </div>
        );
    }
  };

  return (
    <div className="interactive-guide-page container">
      <Link to={`/skills/${moduleId}/${skillId}`} className="back-to-skill-link">
        &larr; Volver a la habilidad "{skill.name}"
      </Link>
      <h1 className="page-title">{guideData.title}</h1>
      
      {guideData.introduction && (
          <p className="page-subtitle guide-introduction">{guideData.introduction}</p>
      )}

      <form onSubmit={handleSubmitGuide} className="guide-form">
        {guideData.steps && guideData.steps.map((step, index) => (
            <div key={step.id || `step-${index}`} className="guide-step">
                {renderStepOrSectionInput(step, index)}
            </div>
        ))}

        {guideData.sections && guideData.sections.map((section, index) => {
            // CORRECCIÓN: Asegurar que section.title exista antes de usar .replace()
            const sectionKey = (section.title ? section.title.replace(/\s+/g, '-') : `section-title-${index}`) || `section-key-${index}`;
            return (
                <details key={sectionKey} className="guide-section-details" open={index < 2}>
                    <summary>{section.title || `Sección ${index + 1}`}</summary>
                    <div className="guide-section-content">
                    {renderStepOrSectionInput(section, index)}
                    </div>
                </details>
            );
        })}
        
        <Button type="submit" variant="primary" className="submit-guide-button">
          He Reflexionado Sobre Esta Guía
        </Button>
      </form>

      {guideData.conclusion && (
        <p className="guide-conclusion">{guideData.conclusion}</p>
      )}
    </div>
  );
};

export default InteractiveGuidePage;