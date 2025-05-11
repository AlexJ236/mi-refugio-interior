import { databases } from './appwriteClient';
import { ID, Query } from 'appwrite';

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID_GRATITUDE = import.meta.env.VITE_APPWRITE_COLLECTION_ID_GRATITUDE_ENTRIES;

/**
 * Crea una nueva entrada en el diario de gratitud.
 * @param {string} userId - El ID del usuario.
 * @param {string} date - La fecha de la entrada (YYYY-MM-DD).
 * @param {string} entryText - El texto de la entrada de gratitud.
 * @returns {Promise<object>} El documento de la entrada de gratitud creada.
 */
export const createGratitudeEntry = async (userId, date, entryText) => {
  if (!COLLECTION_ID_GRATITUDE) {
    console.error("VITE_APPWRITE_COLLECTION_ID_GRATITUDE_ENTRIES no está configurado en .env");
    throw new Error("La configuración para el diario de gratitud no está completa, mi amor.");
  }
  if (!userId || !date || !entryText) {
    throw new Error("Faltan datos para crear la entrada de gratitud. Se requiere userId, fecha y texto.");
  }

  try {
    const documentToCreate = {
      userId,
      date, // Formato YYYY-MM-DD, Appwrite lo manejará si el atributo es String o Datetime
      entryText,
      createdAt: new Date().toISOString(), // Asegurar que se envía si es requerido en Appwrite
    };
    const response = await databases.createDocument(
      DATABASE_ID,
      COLLECTION_ID_GRATITUDE,
      ID.unique(),
      documentToCreate
    );
    return response;
  } catch (error) {
    console.error("Error al sembrar una nueva semilla de gratitud en Appwrite:", error);
    if (error.message && error.message.toLowerCase().includes("missing required attribute \"createdat\"")) {
        throw new Error(`Parece que olvidamos registrar el momento exacto (createdAt). Por favor, revisa la configuración o inténtalo de nuevo, cariño.`);
    }
    throw new Error("Un pequeño pétalo cayó al intentar guardar tu gratitud. ¿Lo intentamos de nuevo con más sol?");
  }
};

/**
 * Obtiene todas las entradas del diario de gratitud para un usuario específico.
 * @param {string} userId - El ID del usuario.
 * @returns {Promise<Array<object>>} Un array de documentos de entradas de gratitud.
 */
export const getGratitudeEntriesByUserId = async (userId) => {
  if (!COLLECTION_ID_GRATITUDE) {
    console.error("VITE_APPWRITE_COLLECTION_ID_GRATITUDE_ENTRIES no está configurado.");
    return []; // Devolver array vacío para no romper la UI si la config falta
  }
  if (!userId) return []; // No buscar si no hay userId

  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_ID_GRATITUDE,
      [
        Query.equal('userId', userId),
        Query.orderDesc('date'), // Ordenar por la fecha de la entrada
        Query.orderDesc('$createdAt') // Como desempate, las más recientes creadas primero
      ]
    );
    return response.documents;
  } catch (error) {
    console.error("Error al cosechar tus momentos de gratitud desde Appwrite:", error);
    throw new Error("Tus agradecimientos parecen estar jugando a las escondidas. Démosles un respiro e intenta de nuevo.");
  }
};

/**
 * Actualiza una entrada existente del diario de gratitud.
 * @param {string} documentId - El ID del documento de la entrada a actualizar.
 * @param {string} entryText - El nuevo texto para la entrada.
 * @returns {Promise<object>} El documento de la entrada de gratitud actualizado.
 */
export const updateGratitudeEntry = async (documentId, entryText) => {
  if (!COLLECTION_ID_GRATITUDE) {
    console.error("VITE_APPWRITE_COLLECTION_ID_GRATITUDE_ENTRIES no está configurado.");
    throw new Error("La configuración para actualizar tu gratitud no está completa.");
  }
  if (!documentId || entryText === undefined) { // entryText puede ser string vacío
    throw new Error("Falta el ID del documento o el texto para actualizar la gratitud.");
  }

  try {
    // Solo se actualiza el entryText. Appwrite maneja $updatedAt.
    // userId y date no deberían cambiar al editar solo el texto.
    const response = await databases.updateDocument(
      DATABASE_ID,
      COLLECTION_ID_GRATITUDE,
      documentId,
      {
        entryText,
      }
    );
    return response;
  } catch (error) {
    console.error("Error actualizando esta joya de gratitud:", error);
    throw new Error("Un pequeño ajuste no pudo ser guardado en tu diario de gratitud. ¿Lo intentamos con más cuidado?");
  }
};

/**
 * Elimina una entrada del diario de gratitud.
 * @param {string} documentId - El ID del documento de la entrada a eliminar.
 * @returns {Promise<void>}
 */
export const deleteGratitudeEntry = async (documentId) => {
  if (!COLLECTION_ID_GRATITUDE) {
    console.error("VITE_APPWRITE_COLLECTION_ID_GRATITUDE_ENTRIES no está configurado.");
    throw new Error("La configuración para liberar este agradecimiento no está completa.");
  }
  if (!documentId) {
    throw new Error("Se necesita el ID del documento para eliminar la entrada de gratitud.");
  }

  try {
    await databases.deleteDocument(
      DATABASE_ID,
      COLLECTION_ID_GRATITUDE,
      documentId
    );
  } catch (error) {
    console.error("Error al dejar ir esta entrada de gratitud:", error);
    throw new Error("Parece que este agradecimiento quiere quedarse un poquito más. Intenta liberarlo luego.");
  }
};