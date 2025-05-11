import React, { useState, useEffect, useCallback } from 'react';
import useAuth from '../../hooks/useAuth';
import { createDailyCard, updateDailyCard, getDailyCardById } from '../../lib/dailyCardService';
import { COMMON_EMOTIONS, DEFAULT_INTENSITY, INSPIRING_NOTES_PLACEHOLDERS, EMOTION_SKILL_SUGGESTIONS, PLUTCHIK_EMOTIONS_PRIMARY } from '../../lib/constants';
import InputField from '../common/InputField';
import Button from '../common/Button';
import { InlineSpinner } from '../common/LoadingSpinner';
import Modal from '../common/Modal';
import EmotionWheel from './EmotionWheel';
import { useNavigate, useParams, Link } from 'react-router-dom';
import '../../styles/components/DailyCard.css';
import '../../styles/components/EmotionChips.css';

const getCurrentDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

const DailyCardForm = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { cardId } = useParams();
  const isEditing = Boolean(cardId);

  const [date, setDate] = useState(getCurrentDate());
  const [selectedEmotions, setSelectedEmotions] = useState([]);
  const [customEmotion, setCustomEmotion] = useState('');
  const [impulses, setImpulses] = useState('');
  const [skillsUsed, setSkillsUsed] = useState('');
  const [notes, setNotes] = useState('');
  const [notesPlaceholder, setNotesPlaceholder] = useState('');

  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const [showSkillHelpModal, setShowSkillHelpModal] = useState(false);
  const [suggestedSkills, setSuggestedSkills] = useState([]);
  const [showEmotionWheel, setShowEmotionWheel] = useState(false); // NUEVO

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * INSPIRING_NOTES_PLACEHOLDERS.length);
    setNotesPlaceholder(INSPIRING_NOTES_PLACEHOLDERS[randomIndex]);
  }, []);

  const fetchCardData = useCallback(async () => {
    if (isEditing && cardId && currentUser) {
      setIsLoadingData(true);
      setError(null);
      try {
        const card = await getDailyCardById(cardId);
        if (card.userId !== currentUser.$id) {
          setError("No tienes permiso para editar este tesoro. Serás redirigida con amor.");
          setTimeout(() => navigate('/daily-card/history'), 3000);
          return;
        }
        setDate(card.date ? card.date.substring(0, 10) : getCurrentDate());
        
        // Manejo robusto de emociones desde la BD
        let emotionsFromDb = [];
        if (card.cardData && card.cardData.emotions) {
            if (Array.isArray(card.cardData.emotions)) {
                emotionsFromDb = card.cardData.emotions.map(e => ({
                    name: e.name || e,
                    intensity: e.intensity || DEFAULT_INTENSITY 
                }));
            } else if (typeof card.cardData.emotions === 'string') {
                try {
                    const parsed = JSON.parse(card.cardData.emotions);
                    if (Array.isArray(parsed)) {
                         emotionsFromDb = parsed.map(e => ({
                            name: e.name || e,
                            intensity: e.intensity || DEFAULT_INTENSITY
                        }));
                    }
                } catch (e) {
                    emotionsFromDb = card.cardData.emotions.split(',')
                                        .map(name => name.trim())
                                        .filter(name => name)
                                        .map(name => ({ name, intensity: DEFAULT_INTENSITY }));
                }
            }
        }
        setSelectedEmotions(emotionsFromDb);

        setImpulses(card.cardData.impulses || '');
        setSkillsUsed(card.cardData.skillsUsed || '');
        setNotes(card.cardData.notes || '');
      } catch (err) {
        console.error("Error al cargar la tarjeta para editar:", err);
        setError("No pudimos encontrar los detalles de esta tarjeta. Quizás necesite un momento para aparecer.");
      } finally {
        setIsLoadingData(false);
      }
    }
  }, [cardId, isEditing, currentUser, navigate]);

  useEffect(() => {
    fetchCardData();
  }, [fetchCardData]);

  useEffect(() => {
    if (showSuccessToast) {
      const timer = setTimeout(() => {
        setShowSuccessToast(false);
        if (!isEditing || toastMessage.includes("guardada")) { 
            navigate('/daily-card/history');
        }
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [showSuccessToast, navigate, isEditing, toastMessage]);

  const handleEmotionSelect = (emotionObject) => {
    setSelectedEmotions(prev => {
      const existingEmotion = prev.find(e => e.name.toLowerCase() === emotionObject.name.toLowerCase());
      if (existingEmotion) {
        return prev.filter(e => e.name.toLowerCase() !== emotionObject.name.toLowerCase());
      } else {
        return [...prev, { name: emotionObject.name, intensity: emotionObject.intensity || DEFAULT_INTENSITY }];
      }
    });
  };

  const handleIntensityChange = (emotionName, newIntensity) => {
    setSelectedEmotions(prev =>
      prev.map(e => (e.name === emotionName ? { ...e, intensity: parseInt(newIntensity, 10) } : e))
    );
  };
  
  const removeEmotion = (emotionName) => {
    setSelectedEmotions(prev => prev.filter(e => e.name !== emotionName));
  };

  const handleAddCustomEmotion = () => {
    const trimmedEmotion = customEmotion.trim();
    if (trimmedEmotion && !selectedEmotions.find(e => e.name.toLowerCase() === trimmedEmotion.toLowerCase())) {
      handleEmotionSelect({ name: trimmedEmotion, intensity: DEFAULT_INTENSITY });
      setCustomEmotion('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const cardDataPayload = { 
        emotions: selectedEmotions,
        impulses, 
        skillsUsed, 
        notes 
    };

    try {
      if (isEditing) {
        await updateDailyCard(cardId, date, cardDataPayload);
        setToastMessage('Tu reflexión ha sido actualizada con cariño. ✨');
      } else {
        await createDailyCard(currentUser.$id, date, cardDataPayload);
        setToastMessage('¡Tu tarjeta diaria ha sido guardada con amor! 💖');
        setDate(getCurrentDate());
        setSelectedEmotions([]);
        setImpulses('');
        setSkillsUsed('');
        setNotes('');
      }
      setShowSuccessToast(true);
    } catch (err) {
      console.error("Error guardando la tarjeta diaria:", err);
      setError(err.message || "Un pequeño nubarrón impidió guardar tu tarjeta. ¿Lo intentamos de nuevo?");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenSkillHelp = () => {
    const currentEmotionNames = selectedEmotions.map(e => e.name);
    let suggestions = [];
    currentEmotionNames.forEach(emotionName => {
      const emotionKey = Object.keys(EMOTION_SKILL_SUGGESTIONS).find(key => emotionName.toLowerCase().includes(key.toLowerCase()));
      if (emotionKey && EMOTION_SKILL_SUGGESTIONS[emotionKey]) {
        suggestions = [...suggestions, ...EMOTION_SKILL_SUGGESTIONS[emotionKey]];
      }
    });
    
    if (suggestions.length === 0 && selectedEmotions.length > 0) {
         suggestions.push({ name: "Intenta 'Observar' (Mindfulness) tus emociones sin juicio.", id: "observar", moduleId: "mindfulness" });
         suggestions.push({ name: "O 'Autocalmarte con los 5 sentidos' (Tolerancia al Malestar).", id: "autocalmarse", moduleId: "tolerancia-malestar" });
    }

    const uniqueSuggestions = Array.from(new Set(suggestions.map(s => s.id)))
                                 .map(id => suggestions.find(s => s.id === id))
                                 .filter(s => s && s.id && s.moduleId)
                                 .slice(0, 5);
    setSuggestedSkills(uniqueSuggestions.length > 0 ? uniqueSuggestions : [{name: "Explora tus módulos de habilidades para encontrar la más adecuada.", id:null, moduleId: null}]);
    setShowSkillHelpModal(true);
  };

  if (isLoadingData) {
    return (
      <div className="daily-card-form-container text-center">
        <h2 style={{color: 'var(--primary-pink)', fontFamily: 'var(--text-romantic-heading)'}}>Cargando tu recuerdo...</h2>
        <InlineSpinner />
      </div>
    );
  }

  return (
    <>
      <div className="daily-card-form-container">
        <h2>{isEditing ? "Renueva Tu Reflexión Diaria" : "Plasma Tus Sentimientos de Hoy"}</h2>
        <p className="page-subtitle" style={{color: 'var(--text-comfort)', textAlign: 'center', marginBottom: 'var(--spacing-lg)'}}>
          {isEditing ? "Con cada ajuste, te comprendes y te abrazas un poco más." : "Un espacio seguro para tu corazón y tu mente."}
        </p>
        
        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit} className="daily-card-form">
          <InputField
            id="date"
            label="Fecha de esta reflexión:"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />

          <div className="form-group">
            <label className="input-label">¿Qué emociones te visitan hoy, querida alma?</label>
            <div className="emotion-chips-container">
              {COMMON_EMOTIONS.map(emotion => (
                <button
                  type="button"
                  key={emotion}
                  className={`emotion-chip ${selectedEmotions.find(e => e.name === emotion) ? 'selected' : ''}`}
                  onClick={() => handleEmotionSelect({ name: emotion, intensity: DEFAULT_INTENSITY })}
                >
                  {emotion}
                </button>
              ))}
            </div>
            <div className="custom-emotion-input">
              <InputField
                id="customEmotion"
                type="text"
                value={customEmotion}
                onChange={(e) => setCustomEmotion(e.target.value)}
                placeholder="Otra emoción..."
              />
              <Button type="button" onClick={handleAddCustomEmotion} variant="secondary" className="btn-sm">Añadir</Button>
            </div>
             <Button type="button" variant="link" onClick={() => setShowEmotionWheel(!showEmotionWheel)} className="mt-sm">
                {showEmotionWheel ? 'Ocultar Rueda de Emociones' : 'Explorar con Rueda de Emociones 🎨'}
            </Button>
            {showEmotionWheel && (
                <EmotionWheel 
                    selectedEmotions={selectedEmotions} 
                    onEmotionSelect={handleEmotionSelect} 
                />
            )}
          </div>

          {selectedEmotions.length > 0 && (
            <div className="selected-emotions-list form-group">
              <label className="input-label">Ajusta la intensidad (1-5):</label>
              {selectedEmotions.map(emotion => (
                <div key={emotion.name} className="selected-emotion-item">
                  <span>{emotion.name}:</span>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={emotion.intensity}
                    onChange={(e) => handleIntensityChange(emotion.name, e.target.value)}
                    className="emotion-intensity-slider"
                    aria-label={`Intensidad de ${emotion.name}`}
                  />
                  <span className="intensity-value">{emotion.intensity}</span>
                  <button
                      type="button"
                      onClick={() => removeEmotion(emotion.name)} // Usar removeEmotion
                      className="emotion-remove-btn"
                      title={`Quitar ${emotion.name}`}
                      aria-label={`Quitar ${emotion.name}`}
                  >
                      &times;
                  </button>
                </div>
              ))}
            </div>
          )}

          <InputField
            id="impulses"
            label="¿Sentiste algún impulso? ¿Cómo lo manejaste con sabiduría?"
            textarea
            value={impulses}
            onChange={(e) => setImpulses(e.target.value)}
            placeholder="Ej: Ganas de aislarme, pero llamé a un amigo."
          />
          
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', marginBottom: 'var(--spacing-xs)' }}>
              <label htmlFor="skillsUsed" className="input-label" style={{marginBottom: 0}}>¿Qué habilidades TDC iluminaron tu camino hoy?</label>
              <Button type="button" variant="link" onClick={handleOpenSkillHelp} className="btn-sm" style={{ padding: 'var(--spacing-xs)'}}>
                Ayuda: ¿Qué habilidad usar? 💡
              </Button>
            </div>
            <InputField
              id="skillsUsed" // El label ya está arriba
              textarea
              value={skillsUsed}
              onChange={(e) => setSkillsUsed(e.target.value)}
              placeholder="Ej: Usé 'Observar' para notar mis pensamientos sin juzgar."
            />
          </div>

          <InputField
            id="notes"
            label="Notas adicionales, susurros del corazón o pensamientos:"
            textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={notesPlaceholder}
          />
          <Button type="submit" variant="primary" disabled={isSubmitting || isLoadingData} style={{width: '100%'}}>
            {isSubmitting ? (isEditing ? <>Actualizando... <InlineSpinner /></> : <>Guardando... <InlineSpinner /></>) : (isEditing ? 'Sellar Cambios con Amor' : 'Guardar Mi Día con Cariño')}
          </Button>
          {isEditing && (
            <Button 
              type="button" 
              variant="link" 
              onClick={() => navigate('/daily-card/history')} 
              style={{marginTop: 'var(--spacing-md)', display: 'block', textAlign: 'center'}}
              disabled={isSubmitting}
            >
              Cancelar y volver al historial
            </Button>
          )}
        </form>
      </div>

      {showSuccessToast && (
        <Modal
          isOpen={showSuccessToast}
          onClose={() => {
              setShowSuccessToast(false);
              if (!isEditing || toastMessage.includes("guardada")) {
                  navigate('/daily-card/history');
              }
          }}
          title="¡Con Amor!"
        >
          <p style={{textAlign: 'center', fontSize: '1.2rem', color: 'var(--text-comfort)'}}>{toastMessage}</p>
        </Modal>
      )}

      <Modal
        isOpen={showSkillHelpModal}
        onClose={() => setShowSkillHelpModal(false)}
        title="Sugerencias de Habilidades con Amor"
        primaryAction={() => setShowSkillHelpModal(false)}
        primaryActionText="Entendido, gracias ✨"
      >
        <p>Basado en cómo te sientes, aquí hay algunas ideas (puedes hacer clic si llevan a algún sitio):</p>
        {suggestedSkills.length > 0 && suggestedSkills[0].id !== null ? (
          <ul className="suggested-skills-list" style={{listStyle:'none', paddingLeft: 0}}>
            {suggestedSkills.map(skill => (
              skill.id && skill.moduleId ? ( // Asegurarse de que hay id y moduleId
                <li key={skill.id} style={{marginBottom: 'var(--spacing-sm)'}}>
                    <Link to={`/skills/${skill.moduleId}/${skill.id}`} onClick={() => setShowSkillHelpModal(false)} className="btn btn-secondary btn-sm" style={{textDecoration:'none', display:'block'}}>
                        {skill.name} <span style={{fontSize: '0.8em', opacity:0.8}}>({skill.moduleId})</span>
                    </Link>
                </li>
              ) : (
                <li key={skill.name || 'sugerencia'}>{skill.name}</li>
              )
            ))}
          </ul>
        ) : (
          <p>{suggestedSkills[0]?.name || "Considera explorar tus módulos de habilidades."}</p>
        )}
        <p className="mt-md" style={{fontSize: '0.9em', color: 'var(--text-comfort)'}}>
            Recuerda, estas son solo sugerencias. La habilidad más efectiva es la que resuena con tu sentir y se ajusta a la situación.
        </p>
      </Modal>
    </>
  );
};

export default DailyCardForm;