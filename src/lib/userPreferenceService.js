import { databases } from './appwriteClient.js';
import { ID, Query } from 'appwrite';

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID_USER_PREFERENCES = import.meta.env.VITE_APPWRITE_COLLECTION_ID_USER_PREFERENCES;

export const getUserPreferences = async (userId) => {
  if (!COLLECTION_ID_USER_PREFERENCES || !userId) {
    console.warn("getUserPreferences: Falta ID de colección o userId");
    return null;
  }
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_ID_USER_PREFERENCES,
      [Query.equal('userId', userId), Query.limit(1)]
    );
    if (response.documents.length > 0) {
      const prefs = response.documents[0];
      prefs.achievements = Array.isArray(prefs.achievements) ? prefs.achievements : [];
      prefs.showProgressGraphs = typeof prefs.showProgressGraphs === 'boolean' ? prefs.showProgressGraphs : true;
      prefs.customThemeColors = prefs.customThemeColors || null; // Asegurar que sea null si no está definido
      prefs.theme = prefs.theme || THEME_OPTIONS[0].class; // Default si no está definido
      return prefs;
    }
    return null;
  } catch (error) {
    console.error("Error al obtener las preferencias del usuario desde Appwrite:", error);
    return null;
  }
};

export const updateUserPreferences = async (userId, preferencesToSave, documentId = null) => {
  if (!COLLECTION_ID_USER_PREFERENCES || !userId) {
    throw new Error("Configuración o ID de usuario faltante para guardar preferencias.");
  }

  // Asegurar que solo enviamos los campos definidos en la colección de Appwrite.
  // Appwrite no permitirá campos extraños.
  const dataForAppwrite = {
    userId: userId, // Siempre requerido para la consulta o creación
    theme: preferencesToSave.theme,
    showProgressGraphs: preferencesToSave.showProgressGraphs,
    achievements: preferencesToSave.achievements || [], // Asegurar que sea un array
    customThemeColors: preferencesToSave.customThemeColors || null, // Enviar null si no hay
  };

  try {
    let existingDocumentId = documentId;
    if (!existingDocumentId) { // Si no se pasó un ID, intentar buscar uno
        const existingPrefs = await getUserPreferences(userId);
        if (existingPrefs && existingPrefs.$id) {
            existingDocumentId = existingPrefs.$id;
        }
    }

    if (existingDocumentId) {
      // Actualizar documento existente
      return await databases.updateDocument(
        DATABASE_ID,
        COLLECTION_ID_USER_PREFERENCES,
        existingDocumentId,
        dataForAppwrite // Solo enviar campos que se pueden actualizar (userId no se actualiza)
      );
    } else {
      // Crear nuevo documento de preferencias
      return await databases.createDocument(
        DATABASE_ID,
        COLLECTION_ID_USER_PREFERENCES,
        ID.unique(),
        dataForAppwrite // userId ya está incluido
      );
    }
  } catch (error) {
    console.error("Error al actualizar/crear las preferencias del usuario en Appwrite:", error);
    if (error.message && error.message.includes("Invalid document structure")) {
        console.error("Detalle del error de estructura:", error.response?.message || error.message);
        throw new Error(`Error de estructura del documento: ${error.response?.message || error.message}. Revisa la definición de la colección en Appwrite.`);
    }
    throw new Error("Un pequeño detalle impidió guardar tus preferencias. Intenta con más cariño.");
  }
};

// addAchievement no se modifica, ya usa getUserPreferences y updateUserPreferences
export const addAchievement = async (userId, achievementId) => {
    if (!userId || !COLLECTION_ID_USER_PREFERENCES) {
        console.warn("addAchievement: userId o ID de colección faltante.");
        return null;
    }
    try {
        let prefs = await getUserPreferences(userId);
        let currentAchievements = prefs?.achievements || [];
        let docId = prefs?.$id || null;

        if (!currentAchievements.includes(achievementId)) {
            const newAchievements = [...currentAchievements, achievementId];
            const prefsToUpdate = { // Construir objeto completo para updateUserPreferences
                theme: prefs?.theme || THEME_OPTIONS[0].class,
                showProgressGraphs: typeof prefs?.showProgressGraphs === 'boolean' ? prefs.showProgressGraphs : true,
                achievements: newAchievements,
                customThemeColors: prefs?.customThemeColors || null
            };
            const updatedPrefsDoc = await updateUserPreferences(userId, prefsToUpdate, docId);
            return updatedPrefsDoc;
        }
        return prefs; 
    } catch (error) {
        console.error(`Error añadiendo el logro ${achievementId} para el usuario ${userId}:`, error);
        return null;
    }
};