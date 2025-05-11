import React, { useState, useEffect, useCallback } from 'react';
import useAuth from '../hooks/useAuth';
import { databases } from '../lib/appwriteClient';
import { ID, Query } from 'appwrite';
import InputField from '../components/common/InputField';
import Button from '../components/common/Button';
import { InlineSpinner } from '../components/common/LoadingSpinner';
import '../styles/pages/SupportPlanPage.css';

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID_SUPPORT_PLANS = import.meta.env.VITE_APPWRITE_COLLECTION_ID_SUPPORT_PLANS;

const SupportPlanPage = () => {
  const { currentUser } = useAuth();
  const [plan, setPlan] = useState({
    crisisContacts: '',
    copingStrategies: '',
    warningSigns: '',
    selfCareActivities: '',
    goals: '',
    notes: '',
  });
  const [planDocumentId, setPlanDocumentId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const fetchPlan = useCallback(async () => {
    if (!currentUser || !COLLECTION_ID_SUPPORT_PLANS) {
        setError("La configuración para tu plan de apoyo no está completa. Contacta con cariño al administrador.");
        setIsLoading(false);
        return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID_SUPPORT_PLANS,
        [Query.equal('userId', currentUser.$id), Query.limit(1)]
      );
      if (response.documents.length > 0) {
        const existingPlan = response.documents[0];
        setPlan({
          crisisContacts: existingPlan.crisisContacts || '',
          copingStrategies: existingPlan.copingStrategies || '',
          warningSigns: existingPlan.warningSigns || '',
          selfCareActivities: existingPlan.selfCareActivities || '',
          goals: existingPlan.goals || '',
          notes: existingPlan.notes || '',
        });
        setPlanDocumentId(existingPlan.$id);
      } else {
        setPlanDocumentId(null);
      }
    } catch (err) {
      console.error("Error al cargar tu faro de apoyo:", err);
      setError("Un pequeño desvío impidió cargar tu plan. ¿Lo intentamos de nuevo en un suspiro?");
    } finally {
      setIsLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchPlan();
  }, [fetchPlan]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPlan(prevPlan => ({ ...prevPlan, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser || !COLLECTION_ID_SUPPORT_PLANS) {
        setError("No podemos guardar tu plan ahora mismo debido a un detalle de configuración. Mil disculpas.");
        return;
    }
    setIsSaving(true);
    setError(null);
    setSuccessMessage('');

    const dataToSave = {
      userId: currentUser.$id,
      ...plan,
    };

    try {
      if (planDocumentId) {
        await databases.updateDocument(DATABASE_ID, COLLECTION_ID_SUPPORT_PLANS, planDocumentId, dataToSave);
      } else {
        const newDoc = await databases.createDocument(DATABASE_ID, COLLECTION_ID_SUPPORT_PLANS, ID.unique(), dataToSave); // Usar ID de 'appwrite'
        setPlanDocumentId(newDoc.$id);
      }
      setSuccessMessage('¡Tu faro de apoyo ha sido actualizado con amor y luz! ✨');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error("Error al guardar tu faro:", err);
      setError(err.message || "Una nubecilla impidió guardar los cambios en tu plan. ¿Lo intentamos con más sol?");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="support-plan-loading container">
        <p>Tejiendo con hilos de amor tu plan de apoyo...</p>
        <InlineSpinner />
      </div>
    );
  }

  return (
    <div className="support-plan-page container">
      <h1 className="page-title">Tu Faro Interior: Plan de Apoyo Personal</h1>
      <p className="page-subtitle">
        Este es tu espacio sagrado para construir un refugio de estrategias y recordatorios amorosos.
        Cuando las olas de la vida se sientan intensas, este plan será tu ancla y tu guía. Llénalo con lo que resuene en tu corazón.
      </p>
      
      {error && <p className="error-message" style={{maxWidth: '800px', margin: 'auto', marginBottom: 'var(--spacing-md)'}}>{error}</p>}
      {successMessage && <p className="success-message" style={{maxWidth: '800px', margin: 'auto', marginBottom: 'var(--spacing-md)'}}>{successMessage}</p>}

      <form onSubmit={handleSubmit} className="support-plan-form">
        <h3>Contactos que me abrazan en la crisis:</h3>
        <InputField
          id="crisisContacts"
          name="crisisContacts"
          label="Personas o recursos a quienes puedo llamar (nombre, teléfono, relación):"
          textarea
          value={plan.crisisContacts}
          onChange={handleChange}
          placeholder="Ej: Mi mejor amiga Ana (555-1234), Línea de apoyo emocional (número)..."
        />

        <h3>Mis Estrategias de Afrontamiento Amigas:</h3>
        <InputField
          id="copingStrategies"
          name="copingStrategies"
          label="Habilidades TDC o acciones que me ayudan a navegar el malestar:"
          textarea
          value={plan.copingStrategies}
          onChange={handleChange}
          placeholder="Ej: Distraerme con música, usar la habilidad TIP, hablar con alguien de confianza, respiración diafragmática..."
        />

        <h3>Señales de Alerta que mi Corazón me Envía:</h3>
        <InputField
          id="warningSigns"
          name="warningSigns"
          label="Pensamientos, sentimientos o comportamientos que indican que necesito cuidarme más:"
          textarea
          value={plan.warningSigns}
          onChange={handleChange}
          placeholder="Ej: Aislarme, pensamientos negativos recurrentes, dificultad para dormir, irritabilidad..."
        />
        
        <h3>Actividades de Autocuidado que Me Nutren:</h3>
        <InputField
          id="selfCareActivities"
          name="selfCareActivities"
          label="Pequeños y grandes gestos de amor propio que recargan mi energía:"
          textarea
          value={plan.selfCareActivities}
          onChange={handleChange}
          placeholder="Ej: Un baño caliente, leer un libro, caminar en la naturaleza, meditar, cocinar algo rico..."
        />

        <h3>Metas que Iluminan Mi Camino:</h3>
        <InputField
          id="goals"
          name="goals"
          label="Pequeños o grandes sueños que me motivan (personales, de bienestar):"
          textarea
          value={plan.goals}
          onChange={handleChange}
          placeholder="Ej: Practicar mindfulness 10 min al día, aprender una nueva habilidad, conectar más con mis seres queridos..."
        />

        <h3>Susurros Adicionales para Mi Alma:</h3>
        <InputField
          id="notes"
          name="notes"
          label="Cualquier otra nota, recordatorio o frase inspiradora que desees guardar:"
          textarea
          value={plan.notes}
          onChange={handleChange}
          placeholder="Ej: 'Soy fuerte, soy capaz, merezco amor y paz', recordatorio de logros pasados..."
        />

        <Button type="submit" variant="primary" disabled={isSaving}>
          {isSaving ? <>Guardando con Amor... <InlineSpinner /></> : 'Sellar mi Plan con Esperanza'}
        </Button>
      </form>
    </div>
  );
};

export default SupportPlanPage;