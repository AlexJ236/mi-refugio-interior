import { databases } from './appwriteClient';
import { ID, Query } from 'appwrite';

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID_DAILY_CARDS = import.meta.env.VITE_APPWRITE_COLLECTION_ID_DAILY_CARDS;

export const createDailyCard = async (userId, date, cardData) => {
  try {
    const response = await databases.createDocument(
      DATABASE_ID,
      COLLECTION_ID_DAILY_CARDS,
      ID.unique(),
      {
        userId,
        date,
        cardData: JSON.stringify(cardData)
      }
    );
    return response;
  } catch (error) {
    console.error("Error creando la tarjeta diaria en el corazón de Appwrite:", error);
    throw new Error("Un pequeño tropiezo al guardar tus sentimientos. Intentemos de nuevo.");
  }
};

export const getDailyCardsByUserId = async (userId) => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_ID_DAILY_CARDS,
      [
        Query.equal('userId', userId),
        Query.orderDesc('date')
      ]
    );
    return response.documents.map(doc => ({
      ...doc,
      cardData: JSON.parse(doc.cardData)
    }));
  } catch (error) {
    console.error("Error al traer tus recuerdos diarios desde Appwrite:", error);
    throw new Error("Parece que tus recuerdos se esconden. Démosles un momento.");
  }
};

export const getDailyCardById = async (documentId) => {
  try {
    const response = await databases.getDocument(
      DATABASE_ID,
      COLLECTION_ID_DAILY_CARDS,
      documentId
    );
    return {
        ...response,
        cardData: JSON.parse(response.cardData)
    };
  } catch (error) {
    console.error("Error obteniendo la tarjeta diaria específica:", error);
    throw new Error("No pudimos encontrar esa tarjeta en específico. ¿Estará jugando a las escondidas?");
  }
};

export const updateDailyCard = async (documentId, date, cardData) => {
    try {
      const response = await databases.updateDocument(
        DATABASE_ID,
        COLLECTION_ID_DAILY_CARDS,
        documentId,
        {
          date,
          cardData: JSON.stringify(cardData)
        }
      );
      return response;
    } catch (error) {
      console.error("Error actualizando la tarjeta diaria:", error);
      throw new Error("Hubo un inconveniente al actualizar tus reflexiones. ¿Lo intentamos con más cariño?");
    }
  };

export const deleteDailyCard = async (documentId) => {
  try {
    await databases.deleteDocument(
      DATABASE_ID,
      COLLECTION_ID_DAILY_CARDS,
      documentId
    );
  } catch (error) {
    console.error("Error eliminando la tarjeta diaria:", error);
    throw new Error("No se pudo liberar ese recuerdo en este momento. Quizás más tarde.");
  }
};