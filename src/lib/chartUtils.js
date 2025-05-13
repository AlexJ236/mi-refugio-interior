/**
 * Valida si un string es una fecha en formato YYYY-MM-DD.
 * @param {string} dateString - El string de fecha a validar.
 * @returns {boolean} - True si es válido, false si no.
 */
const isValidDateString = (dateString) => {
  if (!dateString || typeof dateString !== 'string') return false;
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;
  // Probar si se puede parsear en UTC y si el día es válido (ej. no 2023-02-30)
  const date = new Date(dateString + "T00:00:00Z");
  if (isNaN(date.getTime())) return false;
  return date.toISOString().startsWith(dateString); // Confirma que el día parseado es el mismo
};

/**
 * Genera un array de objetos representando la actividad diaria para gráficos.
 * @param {Array} entries - Array de entradas con un campo 'date' (YYYY-MM-DD).
 * @param {Date} startDate - Fecha de inicio para el período a analizar.
 * @param {Date} endDate - Fecha de fin para el período a analizar.
 * @returns {Array} - Array de objetos { date: string (YYYY-MM-DD), count: 0 o 1 }.
 */
export const generateDailyActivityData = (entries, startDate, endDate) => {
  if (!entries || !Array.isArray(entries)) return [];
  if (!(startDate instanceof Date) || !(endDate instanceof Date) || isNaN(startDate) || isNaN(endDate)) return [];


  const activityData = [];
  // Normaliza las fechas de entrada para asegurar que solo se use la parte YYYY-MM-DD
  const entryDates = new Set(
    entries
      .map(e => {
        if (e && typeof e.date === 'string') {
          return e.date.split('T')[0]; // Tomar solo YYYY-MM-DD
        }
        return null;
      })
      .filter(dateString => dateString && isValidDateString(dateString))
  );

  let currentDate = new Date(Date.UTC(startDate.getUTCFullYear(), startDate.getUTCMonth(), startDate.getUTCDate()));
  const normalizedEndDate = new Date(Date.UTC(endDate.getUTCFullYear(), endDate.getUTCMonth(), endDate.getUTCDate()));

  while (currentDate <= normalizedEndDate) {
    const dateString = currentDate.toISOString().split('T')[0];
    activityData.push({
      date: dateString,
      count: entryDates.has(dateString) ? 1 : 0,
    });
    currentDate.setUTCDate(currentDate.getUTCDate() + 1);
  }
  return activityData;
};

/**
 * Calcula la racha a partir de datos de actividad diaria para un gráfico.
 * @param {Array} dailyActivityData - Array de objetos { date: string (YYYY-MM-DD), count: 0 o 1 }.
 * @param {string} dataKeyName - Nombre de la clave para el valor de la racha.
 * @returns {Array} - Array de objetos { date: string (formateada para display), [dataKeyName]: number }.
 */
export const calculateStreakForChart = (dailyActivityData, dataKeyName = 'streak') => {
  if (!dailyActivityData || dailyActivityData.length === 0) return [];

  const streakChartData = [];
  let currentStreakValue = 0;

  for (const day of dailyActivityData) {
    if (day.count > 0) {
      currentStreakValue++;
    } else {
      currentStreakValue = 0; // Racha se reinicia si hay un día sin actividad
    }
    
    const dateObj = new Date(day.date + "T00:00:00Z"); // Interpretar como UTC
    const displayDate = !isNaN(dateObj.getTime()) ?
      dateObj.toLocaleDateString('es-ES', { month: 'short', day: 'numeric', timeZone: 'UTC' }) :
      day.date; // Fallback

    streakChartData.push({
      date: displayDate,
      [dataKeyName]: currentStreakValue,
    });
  }
  return streakChartData;
};

/**
 * Calcula la racha actual de días consecutivos de entradas.
 * @param {Array} entries - Array de objetos de entrada, cada uno con una propiedad 'date' (string "YYYY-MM-DD" o "YYYY-MM-DDTHH:mm:ssZ").
 * @returns {number} - La racha actual.
 */
export const getCurrentStreak = (entries) => {
  if (!entries || !Array.isArray(entries) || entries.length === 0) {
    return 0;
  }

  const today = new Date();
  const todayUTC = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));

  const entryDatesUTC = entries
    .map(entry => { // Primero, normalizar todas las fechas de las entradas a "YYYY-MM-DD"
      if (entry && typeof entry.date === 'string') {
        const dateOnly = entry.date.split('T')[0];
        return { ...entry, date: dateOnly }; 
      }
      return entry; 
    })
    .filter(entry => entry && isValidDateString(entry.date)) // Validar el formato "YYYY-MM-DD"
    .map(entry => { // Convertir a objetos Date UTC
      const parts = entry.date.split('-').map(Number);
      return new Date(Date.UTC(parts[0], parts[1] - 1, parts[2])); // Mes es 0-indexado
    })
    .filter(date => !isNaN(date.getTime())) // Filtrar fechas inválidas resultantes del parseo
    .sort((a, b) => b.getTime() - a.getTime()); // Orden descendente (más reciente primero)

  if (entryDatesUTC.length === 0) {
    return 0;
  }

  const mostRecentEntryDateUTC = entryDatesUTC[0];

  const isMostRecentToday = mostRecentEntryDateUTC.getTime() === todayUTC.getTime();
  const yesterdayUTC = new Date(todayUTC);
  yesterdayUTC.setUTCDate(todayUTC.getUTCDate() - 1);
  const isMostRecentYesterday = mostRecentEntryDateUTC.getTime() === yesterdayUTC.getTime();

  if (!isMostRecentToday && !isMostRecentYesterday) {
    return 0; // La racha solo puede empezar hoy o ayer
  }

  let currentStreak = 1; // Si es de hoy o ayer, la racha es al menos 1.
  let lastDateInStreakUTC = new Date(mostRecentEntryDateUTC.getTime()); 

  for (let i = 1; i < entryDatesUTC.length; i++) {
    const currentDateBeingCheckedUTC = entryDatesUTC[i];
    const expectedPreviousDateUTC = new Date(lastDateInStreakUTC);
    expectedPreviousDateUTC.setUTCDate(lastDateInStreakUTC.getUTCDate() - 1);

    if (currentDateBeingCheckedUTC.getTime() === expectedPreviousDateUTC.getTime()) {
      currentStreak++;
      lastDateInStreakUTC = currentDateBeingCheckedUTC;
    } else {
      break; // La racha se rompe si no es consecutiva
    }
  }
  return currentStreak;
};