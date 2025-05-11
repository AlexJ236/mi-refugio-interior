import React, { useState, useEffect, useContext } from 'react';
import useAuth from '../hooks/useAuth';
import { THEME_OPTIONS } from '../lib/constants';
import InputField from '../components/common/InputField';
import Button from '../components/common/Button';
import { InlineSpinner } from '../components/common/LoadingSpinner';
import ColorPicker from '../components/settings/ColorPicker';
import ThemePreview from '../components/settings/ThemePreview';
import { ThemeContext } from '../App';

import '../styles/pages/SettingsPage.css';
import '../styles/components/ThemeSelector.css';
import '../styles/components/ColorPicker.css';

const INITIAL_CUSTOM_COLORS = Object.freeze({
  '--primary-pink': '#FF85A1', '--secondary-purple': '#A16AE8', '--accent-lavender': '#D9B8FF',
  '--background-soft': '#FFF0F5', '--card-bg': '#FFFFFF', '--text-main': '#4A0D66',
  '--text-comfort': '#732D91', '--text-light': '#F5E6FF',
});

const SettingsPage = () => {
  const { 
    currentUser, 
    updateUserName, 
    updateUserPassword, 
    authError: globalAuthError,
    setAuthError: setGlobalAuthError,
    userPreferences,
    saveUserPreferences,
    isLoadingPreferences,
    fetchUserPreferences 
  } = useAuth();
  
  const { themeOptions } = useContext(ThemeContext); 
  
  const [name, setName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  
  const [isUpdatingName, setIsUpdatingName] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isSavingPrefsUI, setIsSavingPrefsUI] = useState(false);

  const [nameSuccess, setNameSuccess] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [prefsSuccess, setPrefsSuccess] = useState('');
  const [localError, setLocalError] = useState('');

  const [uiActiveThemeId, setUiActiveThemeId] = useState(THEME_OPTIONS[0].id);
  const [uiShowGraphs, setUiShowGraphs] = useState(true); // Estado local para el checkbox
  const [uiCustomColors, setUiCustomColors] = useState({...INITIAL_CUSTOM_COLORS});
  const [uiIsCustomizing, setUiIsCustomizing] = useState(false);

  useEffect(() => {
    if (currentUser && !userPreferences && !isLoadingPreferences) {
        fetchUserPreferences(currentUser.$id);
    }

    if (userPreferences) {
      setName(currentUser?.name || '');
      
      const themeFromPrefs = userPreferences.theme;
      const customColorsFromPrefsJSON = userPreferences.customThemeColors;

      if (themeFromPrefs === 'custom') {
        setUiActiveThemeId('custom');
        setUiIsCustomizing(true);
        if (customColorsFromPrefsJSON) {
          try {
            const parsedColors = JSON.parse(customColorsFromPrefsJSON);
            setUiCustomColors(prev => ({...INITIAL_CUSTOM_COLORS, ...parsedColors}));
          } catch(e) {
            setUiCustomColors({...INITIAL_CUSTOM_COLORS});
          }
        } else {
          setUiCustomColors({...INITIAL_CUSTOM_COLORS});
        }
      } else {
        const foundTheme = THEME_OPTIONS.find(opt => opt.class === themeFromPrefs);
        setUiActiveThemeId(foundTheme ? foundTheme.id : THEME_OPTIONS[0].id);
        setUiIsCustomizing(false);
        setUiCustomColors({...INITIAL_CUSTOM_COLORS}); 
      }
      // Sincronizar el estado local del checkbox con las preferencias cargadas
      setUiShowGraphs(typeof userPreferences.showProgressGraphs === 'boolean' ? userPreferences.showProgressGraphs : true);
    
    } else if (!isLoadingPreferences && !currentUser) {
      setName('');
      setUiActiveThemeId(THEME_OPTIONS[0].id);
      setUiShowGraphs(true); // Default para UI si no hay userPreferences
      setUiCustomColors({...INITIAL_CUSTOM_COLORS});
      setUiIsCustomizing(false);
    }
  }, [userPreferences, currentUser, isLoadingPreferences, fetchUserPreferences]);


  const handleNameUpdate = async (e) => {
    e.preventDefault();
    setGlobalAuthError(null); setLocalError(''); setNameSuccess('');
    if (!name.trim()) { setLocalError("Por favor, elige un nombre que te represente con cariño."); return; }
    setIsUpdatingName(true);
    try {
      await updateUserName(name);
      setNameSuccess('¡Tu nombre ha sido actualizado con un toque de magia! ✨');
      setTimeout(() => setNameSuccess(''), 3000);
    } catch (error) { setLocalError(error.message || "Error al actualizar el nombre.");
    } finally { setIsUpdatingName(false); }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setGlobalAuthError(null); setLocalError(''); setPasswordSuccess('');
    if (!currentPassword || !newPassword || !confirmNewPassword) { setLocalError("Por favor, completa todos los campos para cambiar tu secreto."); return; }
    if (newPassword !== confirmNewPassword) { setLocalError("El nuevo secreto y su confirmación no coinciden."); return; }
    if (newPassword.length < 8) { setLocalError("Tu nuevo secreto debe tener al menos 8 caracteres."); return; }
    setIsUpdatingPassword(true);
    try {
      await updateUserPassword(newPassword, currentPassword);
      setPasswordSuccess('¡Tu secreto ha sido renovado y está a salvo! 🤫');
      setCurrentPassword(''); setNewPassword(''); setConfirmNewPassword('');
      setTimeout(() => setPasswordSuccess(''), 3000);
    } catch (error) { setLocalError(error.message || "Error al renovar el secreto.");
    } finally { setIsUpdatingPassword(false); }
  };
  
  const applyCustomColorsToBodyDOM = (colors) => {
      THEME_OPTIONS.forEach(opt => document.body.classList.remove(opt.class));
      document.body.classList.add('custom-theme-active');
      for (const [variable, value] of Object.entries(colors)) {
        document.documentElement.style.setProperty(variable, value);
      }
  };
  
  const applyPredefinedThemeToBodyDOM = (themeClass) => {
      Object.keys(INITIAL_CUSTOM_COLORS).forEach(variable => document.documentElement.style.removeProperty(variable));
      document.body.classList.remove('custom-theme-active');
      THEME_OPTIONS.forEach(opt => document.body.classList.remove(opt.class));
      document.body.classList.add(themeClass);
  };

  const handleThemeOptionChange = (themeOptionId) => {
    setUiActiveThemeId(themeOptionId);
    if (themeOptionId === 'custom') {
        setUiIsCustomizing(true);
        applyCustomColorsToBodyDOM(uiCustomColors); 
    } else {
        setUiIsCustomizing(false);
        const selectedOpt = THEME_OPTIONS.find(opt => opt.id === themeOptionId);
        if (selectedOpt) {
            applyPredefinedThemeToBodyDOM(selectedOpt.class);
        }
    }
  };

  const handleCustomColorChange = (variableName, colorValue) => {
    const newColors = { ...uiCustomColors, [variableName]: colorValue };
    setUiCustomColors(newColors);
    if (uiActiveThemeId === 'custom' && uiIsCustomizing) {
        applyCustomColorsToBodyDOM(newColors);
    }
  };
  
  const resetCustomThemeUI = () => {
      const resetColors = {...INITIAL_CUSTOM_COLORS};
      setUiCustomColors(resetColors);
      if (uiActiveThemeId === 'custom' && uiIsCustomizing) {
          applyCustomColorsToBodyDOM(resetColors);
      }
  };

  const handlePreferencesSave = async (e) => {
    e.preventDefault();
    if (!currentUser) {
        setLocalError("Necesitas iniciar sesión para guardar tus preferencias, cariño.");
        return;
    }
    setIsSavingPrefsUI(true); setPrefsSuccess(''); setLocalError(''); setGlobalAuthError(null);
    
    let themeToPersist;
    let customColorsJSONToPersist = null;

    if (uiActiveThemeId === 'custom') {
        themeToPersist = 'custom';
        customColorsJSONToPersist = JSON.stringify(uiCustomColors);
    } else {
        const selectedOpt = THEME_OPTIONS.find(opt => opt.id === uiActiveThemeId);
        themeToPersist = selectedOpt ? selectedOpt.class : THEME_OPTIONS[0].class;
    }

    try {
        await saveUserPreferences({
            theme: themeToPersist,
            showProgressGraphs: uiShowGraphs, // Usar el estado local de la UI
            customThemeColors: customColorsJSONToPersist,
            achievements: userPreferences?.achievements || []
        });
        
        // Aplicar el tema visualmente DESPUÉS de guardar con éxito.
        // App.jsx también reaccionará al cambio de userPreferences.
        if (themeToPersist === 'custom') {
            applyCustomColorsToBodyDOM(uiCustomColors); // uiCustomColors son los que se guardaron
        } else {
            applyPredefinedThemeToBodyDOM(themeToPersist);
        }

        setPrefsSuccess("Tus preferencias han sido guardadas con un toque personal. 💖");
        setTimeout(() => setPrefsSuccess(''), 3000);
    } catch (error) {
        console.error("Error al guardar preferencias en SettingsPage:", error)
        setLocalError(error.message || "No se pudieron guardar tus preferencias.");
    } finally {
        setIsSavingPrefsUI(false);
    }
  };

  if (isLoadingPreferences && !userPreferences && currentUser) {
      return (
          <div className="settings-page container text-center" style={{paddingTop: 'var(--spacing-xxl)'}}>
              <InlineSpinner />
              <p style={{marginTop: 'var(--spacing-md)', color: 'var(--text-comfort)'}}>Cargando tus ajustes personales con cariño...</p>
          </div>
      );
  }
  
  return (
    <div className="settings-page container">
      <h1 className="page-title">Ajustes de Tu Nido Personal</h1>
      <p className="page-subtitle">
        Refina los detalles de tu cuenta y personaliza tu refugio para que sea un reflejo de tu ser.
      </p>

      {(localError || globalAuthError) && <p className="error-message">{localError || globalAuthError}</p>}

      <section className="settings-form-section">
        <h3>Personaliza Tu Refugio Encantado</h3>
        {prefsSuccess && <p className="success-message">{prefsSuccess}</p>}
        <form onSubmit={handlePreferencesSave}>
            <div className="form-group">
                <label className="input-label">Elige los colores de tu santuario:</label>
                <div className="theme-options-container">
                    {(themeOptions || THEME_OPTIONS).map(themeOpt => ( // Usar themeOptions de contexto o el importado
                        <label key={themeOpt.id} className={`theme-option-label ${uiActiveThemeId === themeOpt.id ? 'active' : ''}`}>
                            <input
                                type="radio"
                                name="themeOption"
                                value={themeOpt.id}
                                checked={uiActiveThemeId === themeOpt.id}
                                onChange={() => handleThemeOptionChange(themeOpt.id)}
                            />
                            <div className="theme-option-card">
                                <span className="theme-name">{themeOpt.name}</span>
                                <div className="theme-preview" data-theme-class={themeOpt.class}>
                                    <span className="preview-color main"></span>
                                    <span className="preview-color accent1"></span>
                                    <span className="preview-color accent2"></span>
                                </div>
                            </div>
                        </label>
                    ))}
                     <label key="custom" className={`theme-option-label ${uiActiveThemeId === 'custom' ? 'active' : ''}`}>
                        <input
                            type="radio"
                            name="themeOption"
                            value="custom"
                            checked={uiActiveThemeId === 'custom'}
                            onChange={() => handleThemeOptionChange('custom')}
                        />
                        <div className="theme-option-card">
                            <span className="theme-name">✨ Crea Tu Magia ✨</span>
                             <div className="theme-preview custom-preview">🎨</div>
                        </div>
                    </label>
                </div>
            </div>

            {uiIsCustomizing && (
                <div className="custom-theme-creator">
                    <h4>Define Tus Colores Mágicos:</h4>
                    <p className="page-subtitle" style={{fontSize: '0.9em', marginBottom: 'var(--spacing-md)'}}>
                        Elige los colores que más te transmitan paz y alegría. La vista previa te ayudará.
                    </p>
                    <div className="color-pickers-grid">
                        {Object.entries(INITIAL_CUSTOM_COLORS).map(([variableName, defaultColor]) => (
                            <ColorPicker
                                key={variableName}
                                label={variableName.replace('--','').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) + ":"}
                                color={uiCustomColors[variableName] || defaultColor}
                                onChange={(newColor) => handleCustomColorChange(variableName, newColor)}
                                variableName={variableName}
                            />
                        ))}
                    </div>
                    <Button type="button" variant="link" onClick={resetCustomThemeUI} style={{margin: 'var(--spacing-md) auto var(--spacing-lg) auto', display:'block'}}>
                        Restaurar Colores del Personalizador
                    </Button>
                    <ThemePreview customColors={uiCustomColors} />
                </div>
            )}

            <div className="form-group input-field-group checkbox-group">
                <input
                    type="checkbox"
                    id="showProgressGraphs"
                    name="showProgressGraphs"
                    checked={uiShowGraphs}
                    onChange={(e) => setUiShowGraphs(e.target.checked)}
                    className="input-checkbox"
                />
                <label htmlFor="showProgressGraphs" className="input-label-checkbox">
                    Mostrar gráficos de progreso en "Mis de Avances"
                </label>
            </div>
            <Button type="submit" variant="primary" disabled={isSavingPrefsUI || isLoadingPreferences}>
                {isSavingPrefsUI || isLoadingPreferences ? <>Guardando... <InlineSpinner /></> : 'Guardar Mis Preferencias'}
            </Button>
        </form>
      </section>

      <section className="settings-form-section">
        <h3>Tu Nombre, Tu Esencia</h3>
        {nameSuccess && <p className="success-message">{nameSuccess}</p>}
        <form onSubmit={handleNameUpdate}>
          <InputField id="name" label="Nombre para este espacio:" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          <Button type="submit" variant="primary" disabled={isUpdatingName}>
            {isUpdatingName ? <>Renovando... <InlineSpinner /></> : 'Actualizar Mi Nombre'}
          </Button>
        </form>
      </section>

      <section className="settings-form-section">
        <h3>Tu Secreto Guardado (Contraseña)</h3>
        {passwordSuccess && <p className="success-message">{passwordSuccess}</p>}
        <form onSubmit={handlePasswordUpdate}>
          <InputField id="currentPassword" label="Tu secreto actual:" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
          <InputField id="newPassword" label="Tu nuevo secreto mágico:" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Mínimo 8 caracteres" required />
          <InputField id="confirmNewPassword" label="Confirma tu nuevo secreto:" type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} required />
          <Button type="submit" variant="primary" disabled={isUpdatingPassword}>
            {isUpdatingPassword ? <>Cambiando... <InlineSpinner /></> : 'Renovar Mi Secreto'}
          </Button>
        </form>
      </section>
    </div>
  );
};
export default SettingsPage;