import { databases } from './appwriteClient.js';
import { ID, Query } from 'appwrite';

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID_FUTURE_LETTERS = import.meta.env.VITE_APPWRITE_COLLECTION_ID_FUTURE_ME_LETTERS;

export const createFutureLetter = async (userId, letterData) => {
  if (!COLLECTION_ID_FUTURE_LETTERS) {
    console.error("VITE_APPWRITE_COLLECTION_ID_FUTURE_ME_LETTERS no está configurado.");
    throw new Error("La configuración para las cartas al futuro no está completa, mi amor.");
  }
  try {
    const dataToSave = {
      userId,
      letterTitle: letterData.title,
      letterContent: letterData.content,
      releaseDate: letterData.releaseDate,
      isNotified: false,
      createdAt: new Date().toISOString(),
    };
    const response = await databases.createDocument(
      DATABASE_ID,
      COLLECTION_ID_FUTURE_LETTERS,
      ID.unique(),
      dataToSave
    );
    return response;
  } catch (error) {
    console.error("Error al enviar tu carta al futuro:", error);
    if (error.message && error.message.includes("Missing required attribute")) {
        throw new Error(`Falta un atributo requerido al crear la carta: ${error.message}. Revisa la consola para más detalles.`);
    }
    throw new Error("Un pequeño contratiempo cósmico impidió enviar tu mensaje. Intentemos de nuevo.");
  }
};

export const getUndeliveredLetters = async (userId) => {
  if (!COLLECTION_ID_FUTURE_LETTERS) return [];
  try {
    const todayISO = new Date().toISOString();
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_ID_FUTURE_LETTERS,
      [
        Query.equal('userId', userId),
        Query.equal('isNotified', false),
        Query.lessThanEqual('releaseDate', todayISO),
        Query.orderAsc('releaseDate')
      ]
    );
    return response.documents;
  } catch (error) {
    console.error("Error al buscar cartas del futuro para entregar:", error);
    return [];
  }
};

export const markLetterAsNotified = async (documentId) => {
  if (!COLLECTION_ID_FUTURE_LETTERS) return;
  try {
    await databases.updateDocument(
      DATABASE_ID,
      COLLECTION_ID_FUTURE_LETTERS,
      documentId,
      { isNotified: true }
    );
  } catch (error) {
    console.error("Error al marcar la carta como entregada:", error);
  }
};

export const getAllFutureLetters = async (userId) => {
    if (!COLLECTION_ID_FUTURE_LETTERS) return [];
    try {
        const response = await databases.listDocuments(
            DATABASE_ID,
            COLLECTION_ID_FUTURE_LETTERS,
            [
                Query.equal('userId', userId),
                Query.orderDesc('$createdAt')
            ]
        );
        return response.documents;
    } catch (error) {
        console.error("Error al obtener todas las cartas al futuro:", error);
        throw new Error("No pudimos recuperar el historial de tus cartas al futuro en este momento.");
    }
};

export const deleteFutureLetter = async (documentId) => {
    if (!COLLECTION_ID_FUTURE_LETTERS) {
        throw new Error("Configuración de cartas no encontrada.");
    }
    try {
        await databases.deleteDocument(DATABASE_ID, COLLECTION_ID_FUTURE_LETTERS, documentId);
    } catch (error) {
        console.error("Error al eliminar la carta al futuro:", error);
        throw new Error("No se pudo eliminar esta carta al futuro. Inténtalo más tarde, con cariño.");
    }
};

export const updateFutureLetter = async (documentId, letterData) => {
    if (!COLLECTION_ID_FUTURE_LETTERS) {
        throw new Error("Configuración de cartas no encontrada.");
    }
    try {
        const dataToUpdate = {
            letterTitle: letterData.title,
            letterContent: letterData.content,
            releaseDate: letterData.releaseDate,
        };
        const response = await databases.updateDocument(
            DATABASE_ID,
            COLLECTION_ID_FUTURE_LETTERS,
            documentId,
            dataToUpdate
        );
        return response;
    } catch (error) {
        console.error("Error al actualizar la carta al futuro:", error);
        throw new Error("No se pudo actualizar esta carta al futuro. Inténtalo más tarde, con amor.");
    }
};