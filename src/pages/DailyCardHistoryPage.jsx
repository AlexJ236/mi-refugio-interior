import React, { useEffect, useState } from 'react';
import useAuth from '../hooks/useAuth';
import { getDailyCardsByUserId, deleteDailyCard } from '../lib/dailyCardService';
import DailyCardList from '../components/dailyCard/DailyCardList';
import LoadingSpinner, { InlineSpinner } from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import { Link } from 'react-router-dom';
import '../styles/pages/DailyCardPage.css';

const DailyCardHistoryPage = () => {
  const { currentUser } = useAuth();
  const [cards, setCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [cardToDelete, setCardToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);


  useEffect(() => {
    if (currentUser) {
      setIsLoading(true);
      getDailyCardsByUserId(currentUser.$id)
        .then(fetchedCards => {
          setCards(fetchedCards);
          setError(null);
        })
        .catch(err => {
          console.error("Error al cargar el historial de tarjetas:", err);
          setError("Un pequeño nubarrón impidió cargar tus recuerdos. ¿Intentamos de nuevo en un momento?");
        })
        .finally(() => setIsLoading(false));
    }
  }, [currentUser]);

  const handleDeleteRequest = (cardId) => {
    setCardToDelete(cardId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!cardToDelete) return;
    setIsDeleting(true);
    try {
      await deleteDailyCard(cardToDelete);
      setCards(prevCards => prevCards.filter(card => card.$id !== cardToDelete));
      setShowDeleteModal(false);
      setCardToDelete(null);
    } catch (err) {
      console.error("Error eliminando la tarjeta:", err);
      setError(err.message || "No pudimos soltar este recuerdo en este momento. Intenta más tarde.");
    } finally {
      setIsDeleting(false);
    }
  };


  if (isLoading) {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 150px)', flexDirection: 'column' }}>
            <h2 className="page-title" style={{marginBottom: 'var(--spacing-md)'}}>Abriendo tu cofre de recuerdos...</h2>
            <InlineSpinner /> {/* Usa el spinner más grande o uno específico */}
        </div>
    );
  }

  if (error) {
    return <p className="error-message container">{error}</p>;
  }

  return (
    <div className="daily-card-page-container container">
      <h1 className="page-title">El Sendero de Tus Días Vividos</h1>
      <p className="page-subtitle">
        Aquí yacen tus reflexiones pasadas, un testimonio de tu viaje interior.
        Cada tarjeta es una joya de autoconocimiento.
      </p>
      <div className="action-buttons-container">
        <Link to="/daily-card/new">
            <Button variant="primary">Escribir una Nueva Página de Amor</Button>
        </Link>
      </div>
      <DailyCardList cards={cards} onDeleteCard={handleDeleteRequest} />

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="¿Soltar este recuerdo?"
        primaryActionText={isDeleting ? "Liberando..." : "Sí, soltar con gratitud"}
        primaryAction={confirmDelete}
        secondaryAction={() => setShowDeleteModal(false)}
        secondaryActionText="Conservar este tesoro"
      >
        <p>Estás a punto de dejar ir esta reflexión. Es un acto de desapego, ¿estás segura de querer continuar este viaje ligero?</p>
        {isDeleting && <div style={{textAlign: 'center', marginTop: '10px'}}><InlineSpinner/></div>}
      </Modal>
    </div>
  );
};

export default DailyCardHistoryPage;