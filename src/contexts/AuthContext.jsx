import React, { createContext, useState, useCallback, useEffect } from 'react';
import { account } from '../lib/appwriteClient';
import { AppwriteException, ID } from 'appwrite';
import { getUserPreferences, updateUserPreferences } from '../lib/userPreferenceService';
import { THEME_OPTIONS } from '../lib/constants';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [userPreferences, setUserPreferences] = useState(null); // Contendrá el documento completo de Appwrite
  const [isLoadingPreferences, setIsLoadingPreferences] = useState(false);

  const fetchUserPreferences = useCallback(async (userId) => {
    if (!userId) { // Caso de logout o usuario no encontrado
      setUserPreferences(null); // Limpiar explícitamente
      // La lógica de aplicar tema default se centraliza en App.jsx
      return;
    }
    setIsLoadingPreferences(true);
    try {
      let prefsDoc = await getUserPreferences(userId);
      if (prefsDoc) {
        // Normalizar datos por si acaso (aunque userPreferenceService ya lo hace)
        prefsDoc.theme = prefsDoc.theme || THEME_OPTIONS[0].class;
        prefsDoc.showProgressGraphs = typeof prefsDoc.showProgressGraphs === 'boolean' ? prefsDoc.showProgressGraphs : true;
        prefsDoc.achievements = Array.isArray(prefsDoc.achievements) ? prefsDoc.achievements : [];
        prefsDoc.customThemeColors = prefsDoc.customThemeColors || null;
        setUserPreferences(prefsDoc);
      } else {
        // No hay preferencias en BD, establecer un objeto local inicial para la UI
        // No se guarda en BD hasta que el usuario interactúe en SettingsPage
        setUserPreferences({
            userId: userId, // Importante para la primera creación
            theme: THEME_OPTIONS[0].class,
            showProgressGraphs: true,
            achievements: [],
            customThemeColors: null,
            $id: null // Indicar que no viene de la BD aún
        });
      }
    } catch (error) {
      console.error("Error cargando preferencias en AuthContext:", error);
      // Fallback a un estado local si falla la carga desde BD
      setUserPreferences({
            theme: localStorage.getItem('appTheme') || THEME_OPTIONS[0].class,
            showProgressGraphs: true,
            achievements: [],
            customThemeColors: localStorage.getItem('customThemeColors') || null,
            $id: null
      });
    } finally {
      setIsLoadingPreferences(false);
    }
  }, []);

  const handleUserSession = useCallback(async (userAccount) => {
    setCurrentUser(userAccount);
    if (userAccount && userAccount.$id) {
      await fetchUserPreferences(userAccount.$id);
    } else {
      await fetchUserPreferences(null); // Limpiar/resetear userPreferences
    }
  }, [fetchUserPreferences]);

  const checkUserSession = useCallback(async () => {
    setIsLoadingAuth(true);
    setAuthError(null);
    try {
      const userAccount = await account.get();
      await handleUserSession(userAccount);
    } catch (error) { // No session
      await handleUserSession(null);
    } finally {
      setIsLoadingAuth(false);
    }
  }, [handleUserSession]);
  
  useEffect(() => {
    checkUserSession();
  }, [checkUserSession]); // Solo checkUserSession, que ya está memoizada

  const login = async (email, password) => {
    setIsLoadingAuth(true);
    // No setear isLoadingPreferences aquí, fetchUserPreferences lo hará
    setAuthError(null);
    try {
      await account.createEmailPasswordSession(email, password);
      const userAccount = await account.get();
      await handleUserSession(userAccount);
      return userAccount;
    } catch (error) {
      console.error("Error en el inicio de sesión:", error);
      setAuthError(error.message || "No pudimos validar tus credenciales. ¿Las revisamos juntos?");
      await handleUserSession(null); // Limpiar en caso de error de login
      throw error;
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const signup = async (email, password, name) => {
    setIsLoadingAuth(true);
    setAuthError(null);
    try {
      await account.create(ID.unique(), email, password, name);
      const loggedInUser = await login(email, password); // login se encarga de handleUserSession
      return loggedInUser;
    } catch (error) {
      console.error("Error en el registro:", error);
      let errorMessage = "Algo no salió como esperábamos al crear tu cuenta. ¿Intentamos de nuevo?";
      if (error instanceof AppwriteException) {
        if (error.code === 409) errorMessage = "Parece que ya existe una cuenta con este correo. ¿Intentas iniciar sesión?";
        else if (error.type === 'user_password_short' || error.message.toLowerCase().includes('password')) errorMessage = "Tu contraseña secreta debe tener al menos 8 caracteres llenos de magia.";
      }
      setAuthError(errorMessage);
      await handleUserSession(null);
      throw error;
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const logout = async () => {
    setIsLoadingAuth(true);
    setAuthError(null);
    try {
      await account.deleteSession('current');
    } catch (error) {
      console.error("Error al cerrar sesión en Appwrite:", error);
      // No es crítico si el backend falla, pero informar
      setAuthError(error.message || "Un pequeño contratiempo al despedirnos. Por favor, intenta otra vez.");
    } finally {
      await handleUserSession(null); // Siempre limpiar sesión local y preferencias
      setIsLoadingAuth(false);
    }
  };

  const updateUserName = async (name) => {
    if (!currentUser) throw new Error("No hay usuario para actualizar el nombre.");
    setAuthError(null);
    try {
      const updatedAccount = await account.updateName(name);
      setCurrentUser(updatedAccount); // Actualizar estado local
      return updatedAccount;
    } catch (error) {
      setAuthError(error.message || "Parece que hubo un detalle al actualizar tu nombre.");
      throw error;
    }
  };

  const updateUserPassword = async (newPassword, oldPassword) => {
    if (!currentUser) throw new Error("No hay usuario para actualizar la contraseña.");
    setAuthError(null);
    try {
      return await account.updatePassword(newPassword, oldPassword);
    } catch (error) {
      setAuthError(error.message || "Un pequeño desajuste al cambiar tu secreto.");
      throw error;
    }
  };

  // Guarda las preferencias del usuario en la BD y actualiza el estado local
  const saveUserPreferences = async (newPreferencesData) => {
    if (!currentUser || !currentUser.$id) {
        throw new Error("Debes iniciar sesión para guardar preferencias.");
    }
    setIsLoadingPreferences(true);
    try {
        const documentIdToUpdate = userPreferences?.$id || null; // Usar $id si ya existe el doc
        
        // Construir el payload asegurando que todos los campos esperados por Appwrite están
        const payload = {
            theme: newPreferencesData.theme || THEME_OPTIONS[0].class,
            showProgressGraphs: typeof newPreferencesData.showProgressGraphs === 'boolean' ? newPreferencesData.showProgressGraphs : true,
            achievements: Array.isArray(newPreferencesData.achievements) ? newPreferencesData.achievements : [],
            customThemeColors: newPreferencesData.customThemeColors || null, // Enviar null si no hay
        };

        const updatedPrefsDoc = await updateUserPreferences(currentUser.$id, payload, documentIdToUpdate);
        setUserPreferences(updatedPrefsDoc); // Actualizar estado global con la respuesta de la BD (que incluye $id, etc.)
        return updatedPrefsDoc;
    } catch (error) {
        console.error("Error guardando preferencias desde AuthContext:", error);
        // Podrías querer un estado de error específico para preferencias
        // setPreferencesError(error.message || "No pudimos guardar tus preferencias.");
        throw error; 
    } finally {
        setIsLoadingPreferences(false);
    }
  };

  const value = {
    currentUser, isLoadingAuth, authError, setAuthError,
    login, signup, logout, checkUserSession,
    updateUserName, updateUserPassword,
    userPreferences, isLoadingPreferences, saveUserPreferences, fetchUserPreferences,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};