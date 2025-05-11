import React, { useState, useEffect, useCallback } from 'react';
import useAuth from '../hooks/useAuth';
import { createFutureLetter, getAllFutureLetters, deleteFutureLetter, updateFutureLetter } from '../lib/futureLetterService';
import InputField from '../components/common/InputField';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import { InlineSpinner } from '../components/common/LoadingSpinner';
import { FUTURE_SELF_LETTER_PLACEHOLDERS } from '../lib/constants';
import '../styles/pages/FutureSelfLetterPage.css';

const FutureSelfLetterPage = () => {
  const { currentUser } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [releaseDate, setReleaseDate] = useState(() => {
    const today = new Date();
    today.setDate(today.getDate() + 7); // Por defecto, 1 semana en el futuro
    return today.toISOString().split('T')[0];
  });
  const [placeholder, setPlaceholder] = useState('');
  const [letters, setLetters] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingLetters, setIsFetchingLetters] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const [editingLetter, setEditingLetter] = useState(null); // Para modo edición
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [letterToDelete, setLetterToDelete] = useState(null);

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1); // Mañana como mínimo
  const minDateString = minDate.toISOString().split('T')[0];

  const fetchLetters = useCallback(async () => {
    if (!currentUser) return;
    setIsFetchingLetters(true);
    try {
      const fetchedLetters = await getAllFutureLetters(currentUser.$id);
      setLetters(fetchedLetters);
    } catch (err) {
      setError(err.message || "No pudimos cargar tus cartas al futuro. Refresca la página con cariño.");
    } finally {
      setIsFetchingLetters(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchLetters();
    setPlaceholder(FUTURE_SELF_LETTER_PLACEHOLDERS[Math.floor(Math.random() * FUTURE_SELF_LETTER_PLACEHOLDERS.length)]);
  }, [fetchLetters]);

  const resetForm = () => {
    setTitle('');
    setContent('');
    setReleaseDate(() => {
        const today = new Date();
        today.setDate(today.getDate() + 7);
        return today.toISOString().split('T')[0];
    });
    setEditingLetter(null);
    setPlaceholder(FUTURE_SELF_LETTER_PLACEHOLDERS[Math.floor(Math.random() * FUTURE_SELF_LETTER_PLACEHOLDERS.length)]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() || !releaseDate) {
      setError("Por favor, escribe tu mensaje y elige una fecha para este susurro del tiempo.");
      return;
    }
    setError(null);
    setIsLoading(true);
    setSuccessMessage('');

    const letterData = {
      title: title.trim() || `Carta del ${new Date().toLocaleDateString('es-ES')}`,
      content: content.trim(),
      releaseDate,
    };

    try {
      if (editingLetter) {
        await updateFutureLetter(editingLetter.$id, letterData);
        setSuccessMessage("Tu carta ha sido actualizada con amor y enviada de nuevo al futuro. ✨");
      } else {
        await createFutureLetter(currentUser.$id, letterData);
        setSuccessMessage("¡Tu carta ha sido sellada y enviada al futuro con esperanza! 💌");
      }
      resetForm();
      fetchLetters(); // Recargar lista
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err) {
      setError(err.message || "Un pequeño desvío impidió enviar tu carta. ¿Intentamos de nuevo?");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleEdit = (letter) => {
    setEditingLetter(letter);
    setTitle(letter.letterTitle);
    setContent(letter.letterContent);
    setReleaseDate(new Date(letter.releaseDate).toISOString().split('T')[0]); // Formatear para input date
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll al formulario
  };

  const handleDeleteRequest = (letter) => {
    setLetterToDelete(letter);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!letterToDelete) return;
    setIsLoading(true); // Usar isLoading para el spinner del modal
    try {
      await deleteFutureLetter(letterToDelete.$id);
      setSuccessMessage("La carta ha sido desvanecida con suavidad.");
      fetchLetters();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.message || "No se pudo eliminar esta carta.");
    } finally {
      setIsLoading(false);
      setShowDeleteModal(false);
      setLetterToDelete(null);
    }
  };


  return (
    <div className="future-letter-page container">
      <h1 className="page-title">Susurros para Tu Yo del Mañana</h1>
      <p className="page-subtitle">
        Escribe un mensaje de amor, aliento o sabiduría para la persona valiente que serás en el futuro.
        Estas palabras te esperarán con cariño.
      </p>

      {error && <p className="error-message">{error}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}

      <form onSubmit={handleSubmit} className="future-letter-form form-container">
        <h3>{editingLetter ? "Editando tu Susurro al Futuro" : "Crear Nueva Carta"}</h3>
        <InputField
          id="letterTitle"
          label="Título para tu carta (opcional):"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Un recuerdo, una esperanza..."
        />
        <InputField
          id="letterContent"
          label="Tu mensaje para el futuro:"
          textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={placeholder}
          required
        />
        <InputField
          id="releaseDate"
          label="Fecha para abrir este tesoro:"
          type="date"
          value={releaseDate}
          onChange={(e) => setReleaseDate(e.target.value)}
          min={minDateString} // Mínimo mañana
          required
        />
        <Button type="submit" variant="primary" disabled={isLoading} style={{width: '100%'}}>
          {isLoading ? (editingLetter ? "Actualizando..." : "Enviando...") : (editingLetter ? "Guardar Cambios con Amor" : "Sellar y Enviar al Futuro")}
          {isLoading && <InlineSpinner />}
        </Button>
        {editingLetter && (
            <Button type="button" variant="link" onClick={resetForm} disabled={isLoading} style={{marginTop: 'var(--spacing-sm)', display: 'block', textAlign:'center'}}>
                Cancelar Edición
            </Button>
        )}
      </form>

      <section className="letters-history">
        <h2>Tus Mensajes Flotando en el Tiempo</h2>
        {isFetchingLetters ? (
          <div className="text-center"><InlineSpinner /><p>Buscando tus susurros...</p></div>
        ) : letters.length === 0 ? (
          <p className="text-center" style={{color: 'var(--text-comfort)'}}>Aún no has enviado cartas a tu yo del futuro. ¡Anímate a dejar un mensaje de amor!</p>
        ) : (
          <ul className="letter-list">
            {letters.map(letter => (
              <li key={letter.$id} className={`letter-item ${letter.isNotified ? 'delivered' : ''}`}>
                <h4>{letter.letterTitle || "Carta sin título"}</h4>
                <p className="letter-item-content-preview">
                    {letter.letterContent.substring(0, 100)}{letter.letterContent.length > 100 ? "..." : ""}
                </p>
                <p className="letter-item-date">
                  Para ser entregada el: {new Date(letter.releaseDate).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })}
                </p>
                <p className="letter-item-status">
                  Estado: {letter.isNotified ? "Ya te ha susurrado su mensaje" : (new Date(letter.releaseDate) <= new Date() ? "Lista para ser leída hoy" : "Esperando el momento justo")}
                </p>
                 <div className="letter-item-actions">
                  {!letter.isNotified && new Date(letter.releaseDate) > new Date() && /* Solo editar si no ha sido notificada Y la fecha es futura */ (
                    <Button onClick={() => handleEdit(letter)} variant="secondary" className="btn-sm">Editar Susurro</Button>
                  )}
                  <Button onClick={() => handleDeleteRequest(letter)} variant="danger" className="btn-sm">Desvanecer Carta</Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
      
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="¿Desvanecer este susurro?"
        primaryAction={confirmDelete}
        primaryActionText={isLoading ? "Desvaneciendo..." : "Sí, con desapego"}
        secondaryAction={() => setShowDeleteModal(false)}
        secondaryActionText="Conservar este mensaje"
        isPrimaryActionLoading={isLoading}
      >
        <p>Esta carta al futuro será eliminada. ¿Estás segura, chiquita?</p>
      </Modal>

    </div>
  );
};

export default FutureSelfLetterPage;