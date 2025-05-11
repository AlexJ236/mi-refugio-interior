// src/components/common/PauseButtonFeature.jsx
import React, { useState, useEffect, useRef } from 'react';
import Button from './Button';
import Modal from './Modal';
import { getMindfulnessExercises } from '../../lib/mindfulnessService';
import { getSkillModules } from '../../lib/skillsService';
import '../../styles/components/PauseButton.css';

const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

const PauseButtonFeature = ({ initialDuration = 5 }) => { // Duración en minutos
  const [showModal, setShowModal] = useState(false);
  const [timerActive, setTimerActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(initialDuration * 60); // en segundos
  const [pauseContent, setPauseContent] = useState(null);
  const intervalRef = useRef(null);

  const mindfulnessExercises = getMindfulnessExercises();
  const skillModules = getSkillModules();

  const selectPauseContent = () => {
    const contentTypes = ['mindfulness', 'skill_reminder', 'distraction_idea'];
    const selectedType = getRandomItem(contentTypes);
    let content = { title: "Un Momento de Calma Para Ti", text: "Respira profundamente. Estás a salvo. Esta intensidad pasará." };

    if (selectedType === 'mindfulness' && mindfulnessExercises.length > 0) {
      const exercise = getRandomItem(mindfulnessExercises);
      content = { 
        title: `Práctica Breve: ${exercise.title}`, 
        text: `${exercise.description.substring(0, 150)}... Concéntrate en tu respiración por unos momentos.`,
        link: `/mindfulness#${exercise.id}` // Idea para futuro anclaje
      };
    } else if (selectedType === 'skill_reminder') {
      const toleranceModule = skillModules.find(m => m.id === 'tolerancia-malestar');
      if (toleranceModule && toleranceModule.skills.length > 0) {
        const skill = getRandomItem(toleranceModule.skills.filter(s => ['tip', 'distraerse', 'autocalmarse'].includes(s.id)));
        if (skill) {
            content = { 
                title: `Recuerda la Habilidad: ${skill.name}`, 
                text: `Considera usar: ${skill.description.substring(0,150)}...`,
                link: `/skills/tolerancia-malestar/${skill.id}`
            };
        }
      }
    } else { // distraction_idea
        const distractions = [
            "Cuenta 5 cosas que ves a tu alrededor.",
            "Nombra 3 sonidos que escuchas.",
            "Piensa en tu lugar seguro y visualízalo con detalle.",
            "Recuerda una canción que te haga sentir bien.",
            "Estírate suavemente."
        ];
        content = {title: "Una Pequeña Distracción Consciente", text: getRandomItem(distractions)};
    }
    setPauseContent(content);
  };

  const startTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setTimerActive(true);
    setTimeLeft(initialDuration * 60);
    selectPauseContent();
    setShowModal(true);

    intervalRef.current = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(intervalRef.current);
          setTimerActive(false);
          // setShowModal(false); // Opcional: cerrar modal automáticamente
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  };

  const stopTimerAndClose = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setTimerActive(false);
    setShowModal(false);
    setTimeLeft(initialDuration * 60); // Reset para la próxima vez
  };
  
  useEffect(() => { // Limpieza
    return () => {
        if(intervalRef.current) clearInterval(intervalRef.current);
    }
  }, []);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <>
      <Button onClick={startTimer} variant="danger" className="btn-pause-feature">
        ⏸️ Pausa de Emergencia
      </Button>

      <Modal
        isOpen={showModal}
        onClose={stopTimerAndClose}
        title={timerActive ? `Tiempo de Pausa: ${formatTime(timeLeft)}` : "Tu Pausa Ha Terminado Con Amor"}
      >
        <div className="pause-modal-content">
          {pauseContent && (
            <>
              <h4>{pauseContent.title}</h4>
              <p>{pauseContent.text}</p>
              {pauseContent.link && <p><a href={pauseContent.link} onClick={stopTimerAndClose}>Explorar más...</a></p>}
            </>
          )}
          {!timerActive && timeLeft === 0 && (
            <p>¡Lo has hecho muy bien! Has tomado un momento para ti. Recuerda que eres fuerte.</p>
          )}
          <Button onClick={stopTimerAndClose} variant={timerActive ? "secondary" : "primary"} style={{marginTop: 'var(--spacing-lg)'}}>
            {timerActive ? "Terminar Pausa Ahora" : "Entendido, Gracias"}
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default PauseButtonFeature;