import React, { useState, useEffect, useCallback } from 'react';
import useAuth from '../hooks/useAuth';
import GratitudeForm from '../components/gratitude/GratitudeForm';
import GratitudeList from '../components/gratitude/GratitudeList';
import { getGratitudeEntriesByUserId, deleteGratitudeEntry } from '../lib/gratitudeService';
import LoadingSpinner, { InlineSpinner } from '../components/common/LoadingSpinner';
import Modal from '../components/common/Modal';
import '../styles/pages/GratitudeJournalPage.css';

const GratitudeJournalPage = () => {
  const { currentUser } = useAuth();
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchEntries = useCallback(async () => {
    if (currentUser) {
      setIsLoading(true);
      try {
        const fetchedEntries = await getGratitudeEntriesByUserId(currentUser.$id);
        setEntries(fetchedEntries);
        setError(null);
      } catch (err) {
        console.error("Error cargando el diario de gratitud:", err);
        setError("Un pequeño pétalo se desprendió al cargar tus agradecimientos. ¿Reintentamos?");
      } finally {
        setIsLoading(false);
      }
    }
  }, [currentUser]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const handleEntryAdded = (newEntry) => {
    setEntries(prevEntries => [newEntry, ...prevEntries].sort((a, b) => new Date(b.date) - new Date(a.date))); // Añade y reordena
  };

  const handleDeleteRequest = (entryId) => {
    setEntryToDelete(entryId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!entryToDelete) return;
    setIsDeleting(true);
    try {
      await deleteGratitudeEntry(entryToDelete);
      setEntries(prevEntries => prevEntries.filter(entry => entry.$id !== entryToDelete));
      setShowDeleteModal(false);
      setEntryToDelete(null);
    } catch (err) {
      console.error("Error eliminando la entrada de gratitud:", err);
      setError(err.message || "No pudimos liberar este agradecimiento ahora. Inténtalo con más cariño luego.");
    } finally {
      setIsDeleting(false);
    }
  };


  if (isLoading && entries.length === 0) { // Muestra spinner grande solo en carga inicial
     return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 150px)', flexDirection: 'column' }}>
            <h2 className="page-title" style={{marginBottom: 'var(--spacing-md)'}}>Cultivando tu jardín de gracias...</h2>
            <InlineSpinner />
        </div>
    );
  }


  return (
    <div className="gratitude-journal-page container">
      <h1 className="page-title">Mi Jardín Secreto de Gratitud</h1>
      <p className="page-subtitle">
        Cada día, una flor de agradecimiento ilumina tu alma.
        Siembra aquí los pequeños y grandes regalos que la vida te ofrece con amor.
      </p>
      {error && <p className="error-message">{error}</p>}
      <div className="gratitude-content-layout">
        <section className="gratitude-form-section">
          <GratitudeForm onEntryAdded={handleEntryAdded} />
        </section>
        <section className="gratitude-list-section">
          <h2>Tus Flores de Gratitud Recolectadas</h2>
           {isLoading && entries.length > 0 && <div className='text-center mb-md'><InlineSpinner/> Cargando más flores...</div>}
          <GratitudeList entries={entries} onDeleteEntry={handleDeleteRequest} />
        </section>
      </div>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="¿Dejar ir esta flor?"
        primaryActionText={isDeleting ? "Liberando..." : "Sí, con amor"}
        primaryAction={confirmDelete}
        secondaryAction={() => setShowDeleteModal(false)}
        secondaryActionText="Conservar su aroma"
      >
        <p>Estás por soltar este agradecimiento. ¿Estás lista para dejar espacio a nuevas flores?</p>
        {isDeleting && <div style={{textAlign: 'center', marginTop: '10px'}}><InlineSpinner/></div>}
      </Modal>
    </div>
  );
};

export default GratitudeJournalPage;