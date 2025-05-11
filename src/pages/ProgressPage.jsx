import React, { useState, useEffect, useCallback } from 'react';
import useAuth from '../hooks/useAuth';
import { getDailyCardsByUserId } from '../lib/dailyCardService';
import { getGratitudeEntriesByUserId } from '../lib/gratitudeService';
import { generateDailyActivityData, calculateStreakForChart, getCurrentStreak } from '../lib/chartUtils';
import { InlineSpinner } from '../components/common/LoadingSpinner';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line } from 'recharts';
import '../styles/pages/ProgressPage.css';

const ProgressPage = () => {
  const { currentUser, userPreferences, isLoadingPreferences } = useAuth();
  const [allDailyCards, setAllDailyCards] = useState([]);
  const [allGratitudeEntries, setAllGratitudeEntries] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState(null);

  const endDateForStreaks = new Date(); // Hoy
  const startDateForStreaks = new Date();
  startDateForStreaks.setUTCDate(endDateForStreaks.getUTCDate() - 29); // Últimos 30 días

  const BASE_GRAPH_COLORS = [
    'var(--primary-pink)', 'var(--secondary-purple)', 'var(--accent-lavender)', 
    '#FFB300', '#8BC34A', '#26A69A', '#7E57C2', '#FF7043',
    '#E91E63', '#673AB7', '#00BCD4', '#CDDC39' 
  ];

  const fetchDataForGraphs = useCallback(async () => {
    if (!currentUser) {
      setIsLoadingData(false);
      return;
    }
    if (userPreferences && typeof userPreferences.showProgressGraphs === 'boolean' && !userPreferences.showProgressGraphs) {
        setIsLoadingData(false);
        return;
    }

    setIsLoadingData(true);
    setError(null);
    try {
      const [cards, gratitudes] = await Promise.all([
        getDailyCardsByUserId(currentUser.$id),
        getGratitudeEntriesByUserId(currentUser.$id)
      ]);
      setAllDailyCards(cards || []);
      setAllGratitudeEntries(gratitudes || []);
    } catch (err) {
      console.error("Error cargando datos para progreso:", err);
      setError("No pudimos cargar tus datos de progreso en este momento, mi amor. Intenta refrescar la página.");
    } finally {
      setIsLoadingData(false);
    }
  }, [currentUser, userPreferences]); // Depender de userPreferences para re-evaluar

  useEffect(() => {
    if (!isLoadingPreferences && currentUser) { 
      fetchDataForGraphs();
    } else if (!currentUser && !isLoadingPreferences) { // Si no hay usuario y las prefs no cargan (o no hay)
        setIsLoadingData(false); // Detener carga si no hay usuario
    }
  }, [fetchDataForGraphs, isLoadingPreferences, currentUser]);

  const getEmotionFrequency = () => {
    if (!allDailyCards || allDailyCards.length === 0) return [];
    const emotionCount = {};
    allDailyCards.forEach(card => {
      if (card.cardData && Array.isArray(card.cardData.emotions)) {
        card.cardData.emotions.forEach(emotionObj => {
          const name = (typeof emotionObj === 'string' ? emotionObj.trim() : (emotionObj.name || '').trim()) || "Sin nombre";
          if (name) {
            emotionCount[name] = (emotionCount[name] || 0) + 1;
          }
        });
      }
    });
    return Object.entries(emotionCount)
                 .map(([name, value], index) => ({ name, value, fill: BASE_GRAPH_COLORS[index % BASE_GRAPH_COLORS.length] }))
                 .sort((a, b) => b.value - a.value)
                 .slice(0, 8);
  };

  const getSkillUsageFrequency = () => {
    if (!allDailyCards || allDailyCards.length === 0) return [];
    const skillCount = {};
    allDailyCards.forEach(card => {
        if (card.cardData && card.cardData.skillsUsed && typeof card.cardData.skillsUsed === 'string') {
            const skills = card.cardData.skillsUsed.split(/[\n,;]+/) // Separar por más delimitadores
                                .map(s => s.trim().toLowerCase())
                                .filter(s => s && s.length > 1); // Filtrar vacíos y muy cortos
            
            skills.forEach(skillName => {
                let normalizedSkill = skillName.replace(/\b(habilidad|habilidades|de|con|el|la|los|las|un|una|unos|unas|mi|mis|para)\b/gi, '').trim();
                normalizedSkill = normalizedSkill.replace(/[^a-záéíóúñü\s0-9-]/gi, '');
                normalizedSkill = normalizedSkill.split('(')[0].trim();
                if (normalizedSkill.length > 25) normalizedSkill = normalizedSkill.substring(0,25) + "...";
                
                if (normalizedSkill) {
                    const capitalizedSkill = normalizedSkill.charAt(0).toUpperCase() + normalizedSkill.slice(1);
                    skillCount[capitalizedSkill] = (skillCount[capitalizedSkill] || 0) + 1;
                }
            });
        }
    });
     return Object.entries(skillCount)
                 .map(([name, value], index) => ({ name, value, fill: BASE_GRAPH_COLORS[index % BASE_GRAPH_COLORS.length] }))
                 .sort((a, b) => b.value - a.value)
                 .slice(0, 8);
  };
  
  const dailyActivity = generateDailyActivityData(allDailyCards, startDateForStreaks, endDateForStreaks);
  const dailyStreakChartData = calculateStreakForChart(dailyActivity, 'dailyStreak');

  const gratitudeActivity = generateDailyActivityData(allGratitudeEntries, startDateForStreaks, endDateForStreaks);
  const gratitudeStreakChartData = calculateStreakForChart(gratitudeActivity, 'gratitudeStreak');

  const currentDailyStreakNum = getCurrentStreak(allDailyCards);
  const currentGratitudeStreakNum = getCurrentStreak(allGratitudeEntries);

  // Renderizado condicional principal
  if (isLoadingPreferences || (!currentUser && isLoadingData)) {
    return (
        <div className="progress-page container text-center" style={{ minHeight: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <InlineSpinner />
            <p>Cargando tus preferencias y datos con cariño...</p>
        </div>
    );
  }
  
  if (!currentUser) {
      return (
        <div className="progress-page container text-center">
            <h1 className="page-title">Tu Jardín de Crecimiento</h1>
            <p className="page-subtitle">
                Para ver tu progreso, necesitas <Link to="/login" className="highlight-link">iniciar sesión</Link> en tu refugio, mi amor.
            </p>
        </div>
      );
  }
  
  // userPreferences debería estar definido si currentUser existe y isLoadingPreferences es false
  if (!userPreferences || typeof userPreferences.showProgressGraphs !== 'boolean' || !userPreferences.showProgressGraphs) {
    return (
      <div className="progress-page container text-center">
        <h1 className="page-title">Tu Jardín de Crecimiento</h1>
        <p className="page-subtitle">
          La visualización de progreso está desactivada en tus preferencias, cariño.
          Puedes activarla en <Link to="/settings" className="highlight-link">Ajustes</Link> si deseas ver tu camino reflejado aquí.
        </p>
      </div>
    );
  }
  
  if (isLoadingData) {
    return (
        <div className="progress-page container text-center" style={{ minHeight: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <InlineSpinner />
            <p>Calculando tus hermosos avances...</p>
        </div>
    );
  }

  if (error) {
    return <p className="error-message container" style={{textAlign: 'center'}}>{error}</p>;
  }

  const emotionChartData = getEmotionFrequency();
  const skillUsageChartData = getSkillUsageFrequency();

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-recharts-tooltip">
          <p className="tooltip-label">{`${label}`}</p>
          {payload.map((pld, index) => (
            <p key={index} style={{ color: pld.color || pld.fill }}>
              {`${pld.name} : ${pld.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="progress-page container">
      <h1 className="page-title">Tu Jardín de Crecimiento Interior</h1>
      <p className="page-subtitle">
        Observa con cariño cómo has cultivado tu bienestar. Cada pequeño paso es una flor en tu camino.
      </p>

        <div className="current-streaks-summary">
            <p>Racha Actual Diario: <strong>{currentDailyStreakNum} día{currentDailyStreakNum !== 1 ? 's' : ''}</strong> 💖</p>
            <p>Racha Actual Gratitud: <strong>{currentGratitudeStreakNum} día{currentGratitudeStreakNum !== 1 ? 's' : ''}</strong> 🌸</p>
        </div>

      <div className="charts-grid">
        <section className="chart-container">
          <h3>Tus Emociones Más Presentes (Últimas entradas)</h3>
          {(allDailyCards.length > 0 && emotionChartData.length > 0) ? (
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie 
                  data={emotionChartData} 
                  dataKey="value" 
                  nameKey="name" 
                  cx="50%" 
                  cy="50%" 
                  outerRadius={100}
                  labelLine={{ stroke: 'var(--text-comfort)', strokeWidth: 1 }}
                  label={({ name, percent, x, y, textAnchor, fill }) => (
                    percent * 100 < 4 ? null : // No mostrar etiquetas muy pequeñas
                    <text x={x} y={y} fill={fill} textAnchor={textAnchor} dominantBaseline="central" fontSize="13px" fontWeight="500">
                      {`${name} (${(percent * 100).toFixed(0)}%)`}
                    </text>
                  )}
                >
                  {emotionChartData.map((entry) => (
                    <Cell key={`cell-emotion-${entry.name}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />}/>
                <Legend iconSize={12} wrapperStyle={{fontSize: "13px", paddingTop: "15px"}}/>
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p>Aún no hay suficientes datos de emociones para mostrar un gráfico. ¡Sigue registrando tus tarjetas diarias con amor!</p>
          )}
        </section>

        <section className="chart-container">
          <h3>Habilidades Más Utilizadas</h3>
          {(allDailyCards.length > 0 && skillUsageChartData.length > 0) ? (
            <ResponsiveContainer width="100%" height={350}>
               <BarChart data={skillUsageChartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)"/>
                <XAxis type="number" allowDecimals={false} tick={{fontSize: 11, fill: 'var(--text-comfort)'}} />
                <YAxis dataKey="name" type="category" width={130} tick={{fontSize: 12, fill: 'var(--text-main)'}}/>
                <Tooltip content={<CustomTooltip />} cursor={{fill: 'var(--background-alt)'}}/>
                <Legend wrapperStyle={{fontSize: "13px", paddingTop: "15px"}}/>
                <Bar dataKey="value" name="Usos" barSize={20}>
                    {skillUsageChartData.map((entry) => (
                        <Cell key={`cell-skill-${entry.name}`} fill={entry.fill} />
                    ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p>Registra las habilidades que usas en tus tarjetas diarias para ver aquí tus herramientas más queridas.</p>
          )}
        </section>
        
        <section className="chart-container full-width-chart">
          <h3>Evolución de tu Racha de Tarjetas Diarias (Últimos 30 días)</h3>
          {dailyStreakChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyStreakChartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)"/>
                <XAxis dataKey="date" tick={{fontSize: 11, fill: 'var(--text-comfort)'}} />
                <YAxis allowDecimals={false} tick={{fill: 'var(--text-comfort)'}} domain={[0, 'dataMax + 1']}/>
                <Tooltip content={<CustomTooltip />}/>
                <Legend wrapperStyle={{fontSize: "13px"}}/>
                <Line type="monotone" dataKey="dailyStreak" stroke="var(--primary-pink)" name="Racha Diario" activeDot={{ r: 7 }} strokeWidth={2.5} dot={{r: 3}} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p>¡Sigue escribiendo tus tarjetas diarias para ver crecer tu racha de autoconexión!</p>
          )}
        </section>
        
        <section className="chart-container full-width-chart">
          <h3>Evolución de tu Racha de Diario de Gratitud (Últimos 30 días)</h3>
           {gratitudeStreakChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={gratitudeStreakChartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)"/>
                <XAxis dataKey="date" tick={{fontSize: 11, fill: 'var(--text-comfort)'}}/>
                <YAxis allowDecimals={false} tick={{fill: 'var(--text-comfort)'}} domain={[0, 'dataMax + 1']}/>
                <Tooltip content={<CustomTooltip />}/>
                <Legend wrapperStyle={{fontSize: "13px"}}/>
                <Line type="monotone" dataKey="gratitudeStreak" stroke="var(--secondary-purple)" name="Racha Gratitud" activeDot={{ r: 7 }} strokeWidth={2.5} dot={{r: 3}}/>
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p>¡Cultiva tu jardín de gratitud día a día y observa cómo florece tu racha!</p>
          )}
        </section>
      </div>
      <p className="text-center note-sensitive">
          Recuerda, estos gráficos son solo una forma de observar patrones con curiosidad y amor, no una medida de "éxito". Tu camino es único y valioso, chiquita.
      </p>
    </div>
  );
};

export default ProgressPage;