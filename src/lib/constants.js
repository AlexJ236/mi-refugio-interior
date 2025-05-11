export const COMMON_EMOTIONS = ['Tristeza', 'Ansiedad', 'Alegría', 'Ira', 'Vacío', 'Esperanza', 'Calma', 'Gratitud', 'Miedo', 'Culpa', 'Vergüenza', 'Frustración', 'Confusión', 'Soledad', 'Amor', 'Interés', 'Sorpresa', 'Orgullo', 'Diversión', 'Serenidad'];
export const DEFAULT_INTENSITY = 3;

// Rueda de Emociones de Plutchik (simplificada para UI)
// Cada emoción primaria tiene opuestos y puede tener intensidades (no implementado aquí para simplificar el ejemplo inicial de la rueda)

export const PLUTCHIK_EMOTIONS_PRIMARY = [
  { name: 'Alegría', color: '#FFEB3B', opposite: 'Tristeza', related: ['Serenidad', 'Éxtasis'] },
  { name: 'Confianza', color: '#4CAF50', opposite: 'Aversión', related: ['Aceptación', 'Admiración'] },
  { name: 'Miedo', color: '#9C27B0', opposite: 'Ira', related: ['Aprensión', 'Terror'] },
  { name: 'Sorpresa', color: '#03A9F4', opposite: 'Anticipación', related: ['Distracción', 'Asombro'] },
  { name: 'Tristeza', color: '#607D8B', opposite: 'Alegría', related: ['Melancolía', 'Pena'] },
  { name: 'Aversión', color: '#FF5722', opposite: 'Confianza', related: ['Aburrimiento', 'Odio'] },
  { name: 'Ira', color: '#F44336', opposite: 'Miedo', related: ['Enfado', 'Furia'] },
  { name: 'Anticipación', color: '#FF9800', opposite: 'Sorpresa', related: ['Interés', 'Vigilancia'] },
];

// Emociones secundarias (combinaciones de primarias adyacentes)
export const PLUTCHIK_EMOTIONS_SECONDARY = [
    { name: 'Amor', combination: ['Alegría', 'Confianza'], color: '#FFC107' },
    { name: 'Sumisión', combination: ['Confianza', 'Miedo'], color: '#795548' },
    { name: 'Susto', combination: ['Miedo', 'Sorpresa'], color: '#4A148C' },
    { name: 'Decepción', combination: ['Sorpresa', 'Tristeza'], color: '#00BCD4' },
    { name: 'Remordimiento', combination: ['Tristeza', 'Aversión'], color: '#B0BEC5' },
    { name: 'Desprecio', combination: ['Aversión', 'Ira'], color: '#E53935' },
    { name: 'Agresividad', combination: ['Ira', 'Anticipación'], color: '#D84315' },
    { name: 'Optimismo', combination: ['Anticipación', 'Alegría'], color: '#FFEE58' },
];


export const INSPIRING_GRATITUDE_PLACEHOLDERS = [
  "¿Qué pequeño milagro te sonrió hoy? ✨",
  "Un detalle que calentó tu corazón...",
  "¿Qué te hizo sentir agradecida y conectada?",
  "Una bendición disfrazada que descubriste hoy...",
  "Describe un momento de paz o alegría que atesoras...",
  "¿Por quién o qué sientes una inmensa gratitud en este instante?",
  "Algo simple, pero profundamente valioso hoy fue...",
  "Un aroma, un sonido, una vista que te llenó de gratitud...",
  "¿Qué acto de bondad (propio o ajeno) presenciaste o realizaste hoy?",
  "Un aprendizaje que te hizo sentir agradecida..."
];

export const INSPIRING_NOTES_PLACEHOLDERS = [
  "Susurros del corazón, pensamientos libres...",
  "¿Alguna reflexión especial que quieras recordar?",
  "Un espacio para tus ideas, sueños o desahogos...",
  "¿Qué aprendiste de ti hoy?",
  "Si tu día fuera una canción, ¿cuál sería y por qué?",
  "Un mensaje de amor para tu yo del futuro...",
  "Cualquier tesoro que desees guardar en este refugio...",
  "¿Qué te nutrió o te dio energía hoy?",
  "Un pensamiento que te gustaría explorar más a fondo...",
  "Si pudieras decirle algo a tu yo de ayer, ¿qué sería?"
];

export const EMOTION_SKILL_SUGGESTIONS = {
  'Ansiedad': [
    { id: 'distraerse', name: 'Distraerse Sabiamente (ACCEPTS)', moduleId: 'tolerancia-malestar' },
    { id: 'autocalmarse', name: 'Autocalmarse con los 5 Sentidos', moduleId: 'tolerancia-malestar' },
    { id: 'observar', name: 'Observar (Mindfulness)', moduleId: 'mindfulness' },
    { id: 'tip', name: 'Habilidad TIPP (Tolerancia Malestar)', moduleId: 'tolerancia-malestar'},
  ],
  'Tristeza': [
    { id: 'accion-opuesta', name: 'Acción Opuesta', moduleId: 'regulacion-emocional' },
    { id: 'acumular-positivas', name: 'Acumular Emociones Positivas', moduleId: 'regulacion-emocional' },
    { id: 'participar', name: 'Participar Plenamente (Mindfulness)', moduleId: 'mindfulness' }
  ],
  'Ira': [
    { id: 'distraerse', name: 'Distraerse Sabiamente (ACCEPTS)', moduleId: 'tolerancia-malestar' },
    { id: 'pros-contras', name: 'Pros y Contras', moduleId: 'tolerancia-malestar' },
    { id: 'resolver-problemas', name: 'Resolver Problemas', moduleId: 'regulacion-emocional'},
    { id: 'tip', name: 'Habilidad TIPP', moduleId: 'tolerancia-malestar'},
    { id: 'fact-checking', name: 'Comprobación de los Hechos', moduleId: 'regulacion-emocional-avanzado' },

  ],
  'Vacío': [
    { id: 'acumular-positivas', name: 'Acumular Emociones Positivas', moduleId: 'regulacion-emocional' },
    { id: 'participar', name: 'Participar Plenamente (Mindfulness)', moduleId: 'mindfulness'},
    { id: 'autocalmarse', name: 'Autocalmarse con los 5 Sentidos', moduleId: 'tolerancia-malestar' }
  ],
  'Miedo': [
      { id: 'accion-opuesta', name: 'Acción Opuesta (si el miedo no se ajusta a los hechos)', moduleId: 'regulacion-emocional' },
      { id: 'autocalmarse', name: 'Autocalmarse con los 5 Sentidos', moduleId: 'tolerancia-malestar' },
      { id: 'describir', name: 'Describir (Mindfulness)', moduleId: 'mindfulness' },
      { id: 'fact-checking', name: 'Comprobación de los Hechos', moduleId: 'regulacion-emocional-avanzado' },
  ],
  'Culpa': [
    { id: 'fact-checking', name: 'Comprobación de los Hechos', moduleId: 'regulacion-emocional-avanzado' },
    { id: 'accion-opuesta', name: 'Acción Opuesta (si la culpa no se ajusta)', moduleId: 'regulacion-emocional' },
    { id: 'resolver-problemas', name: 'Resolver Problemas (si la culpa es justificada y hay algo que reparar)', moduleId: 'regulacion-emocional-avanzado' }
  ],
  'Vergüenza': [
    { id: 'fact-checking', name: 'Comprobación de los Hechos', moduleId: 'regulacion-emocional-avanzado' },
    { id: 'accion-opuesta', name: 'Acción Opuesta (compartir con alguien de confianza)', moduleId: 'regulacion-emocional' },
    { id: 'autocompasion', name: 'Autocompasión Radical', moduleId: 'tolerancia-malestar'}
  ],
  'Abrumada': [
    { id: 'mejorar-momento', name: 'Mejorar el Momento (IMPROVE)', moduleId: 'tolerancia-malestar' },
    { id: 'describir', name: 'Describir (Mindfulness)', moduleId: 'mindfulness'},
    { id: 'resolver-problemas-detallado', name: 'Resolver Problemas (Paso a Paso)', moduleId: 'regulacion-emocional-avanzado' },
    { id: 'una-cosa-a-la-vez', name: 'Una Cosa a la Vez (Mindfulness "Cómo")', moduleId: 'mindfulness'}
  ]
};

export const MY_EMERGENCY_CONTACT = { name: "Josecito (Tu Panquecito Guardián ❤️)", phone: "51966075498" };

export const FUTURE_SELF_LETTER_PLACEHOLDERS = [
    "Querida yo del futuro, recuerda que eres increíblemente fuerte...",
    "Para mi yo del [Fecha Futura]: No olvides lo lejos que has llegado...",
    "Un mensaje de aliento para cuando las cosas se pongan difíciles: Eres capaz, eres amada...",
    "Recuerda esta alegría, este logro, este momento de paz...",
    "Cuando leas esto, quiero que sepas que..."
];

export const THEME_OPTIONS = [
    { id: 'default', name: 'Amanecer Rosado (Por defecto)', class: 'theme-default' },
    { id: 'lavenderDream', name: 'Sueño Lavanda', class: 'theme-lavender-dream' },
    { id: 'sereneOcean', name: 'Océano Sereno', class: 'theme-serene-ocean' },
    // Puedes añadir más temas aquí
];