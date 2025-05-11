import { THEME_OPTIONS } from './constants';

/**
 * Valida si un string es una fecha en formato YYYY-MM-DD.
 * @param {string} dateString - El string de fecha a validar.
 * @returns {boolean} - True si es válido, false si no.
 */
const isValidDateString = (dateString) => {
  if (!dateString || typeof dateString !== 'string') return false;
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;
  const date = new Date(dateString + "T00:00:00Z"); // Probar si se puede parsear
  return !isNaN(date.getTime());
};

/**
 * Genera un array de objetos representando la actividad diaria.
 * @param {Array} entries - Array de entradas con un campo 'date' (YYYY-MM-DD).
 * @param {Date} startDate - Fecha de inicio para el período a analizar.
 * @param {Date} endDate - Fecha de fin para el período a analizar.
 * @returns {Array} - Array de objetos { date: string (YYYY-MM-DD), count: 0 o 1 }.
 */
export const generateDailyActivityData = (entries, startDate, endDate) => {
  if (!entries || !Array.isArray(entries)) return [];

  const activityData = [];
  const entryDates = new Set(
    entries
      .filter(e => e && isValidDateString(e.date)) // Filtrar entradas con fechas inválidas o nulas
      .map(e => {
        // e.date ya debería ser YYYY-MM-DD. No es necesario añadir T00:00:00Z aquí
        // porque el Set solo necesita el string YYYY-MM-DD para la comparación.
        return e.date;
      })
  );

  let currentDate = new Date(startDate);
  currentDate.setUTCHours(0, 0, 0, 0);

  let normalizedEndDate = new Date(endDate);
  normalizedEndDate.setUTCHours(0, 0, 0, 0);

  while (currentDate <= normalizedEndDate) {
    const dateString = currentDate.toISOString().split('T')[0]; // YYYY-MM-DD
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
      currentStreakValue = 0; 
    }
    // Formatear la fecha para el eje X del gráfico, asegurando que day.date sea válido
    const dateObj = new Date(day.date + "T00:00:00Z");
    const displayDate = !isNaN(dateObj.getTime()) ? 
                        dateObj.toLocaleDateString('es-ES', { month: 'short', day: 'numeric', timeZone: 'UTC' }) : 
                        day.date; // Fallback a la fecha string si es inválida

    streakChartData.push({
      date: displayDate,
      [dataKeyName]: currentStreakValue,
    });
  }
  return streakChartData;
};

/**
 * Calcula la racha actual.
 * @param {Array} entries - Array de entradas con campo 'date' (YYYY-MM-DD).
 * @returns {number} - La racha actual.
 */
export const getCurrentStreak = (entries) => {
    if (!entries || !Array.isArray(entries) || entries.length === 0) return 0;
    
    let today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const entryDates = entries
        .filter(entry => entry && isValidDateString(entry.date)) // Usar la función de validación
        .map(entry => {
            // Crear objeto Date en UTC para evitar problemas de zona horaria en cálculos
            const parts = entry.date.split('-');
            return new Date(Date.UTC(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2])));
        })
        .sort((a, b) => b.getTime() - a.getTime());

    if (entryDates.length === 0) return 0;
    
    let mostRecentEntryDate = entryDates[0];
    let isMostRecentToday = mostRecentEntryDate.getTime() === today.getTime();
    let isMostRecentYesterday = false;

    if (!isMostRecentToday) {
        let yesterday = new Date(today);
        yesterday.setUTCDate(today.getUTCDate() - 1);
        isMostRecentYesterday = mostRecentEntryDate.getTime() === yesterday.getTime();
    }

    if (!isMostRecentToday && !isMostRecentYesterday) {
        return 0; 
    }

    let streak = 1;
    let lastDateForStreak = new Date(mostRecentEntryDate);

    for (let i = 1; i < entryDates.length; i++) {
        let expectedPreviousDate = new Date(lastDateForStreak);
        expectedPreviousDate.setUTCDate(lastDateForStreak.getUTCDate() - 1);
        
        if (entryDates[i].getTime() === expectedPreviousDate.getTime()) {
            streak++;
            lastDateForStreak = new Date(entryDates[i]);
        } else if (entryDates[i].getTime() < expectedPreviousDate.getTime()) {
            break; 
        }
    }
    return streak;
};