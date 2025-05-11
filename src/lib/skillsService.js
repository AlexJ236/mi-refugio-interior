const skillsData = [
  {
    id: "mindfulness",
    name: "Mindfulness: Conectando con tu Presente",
    description: "Un conjunto de habilidades para anclarte en el aquí y ahora, observando tus pensamientos y sentimientos sin juicio, como nubes pasajeras en tu cielo interior.",
    color: "var(--primary-pink)", // Color del tema para la tarjeta del módulo
    skills: [
      {
        id: "observar",
        name: "Observar con Curiosidad (Qué)",
        description: "Presta atención a tu entorno y a tus sensaciones internas, simplemente notando lo que es, sin añadir historias ni juicios.",
        exercise: "Dedica 5 minutos a observar un objeto cotidiano como si fuera la primera vez. Nota sus colores, texturas, la forma en que la luz interactúa con él."
      },
      {
        id: "describir",
        name: "Describir con Palabras Amables (Qué)",
        description: "Nombra tus experiencias internas y externas de forma objetiva. 'Siento tristeza en mi pecho' en lugar de 'Soy un desastre'.",
        exercise: "Durante una emoción intensa, intenta describirla: 'Noto tensión en mis hombros. Mi respiración es rápida. Hay un pensamiento que dice...'."
      },
      {
        id: "participar",
        name: "Participar Plenamente (Qué)",
        description: "Sumérgete por completo en la actividad que estés realizando, con toda tu atención y ser. Deja que el hacer te envuelva.",
        exercise: "Elige una tarea rutinaria (lavar los platos, caminar). Enfócate en cada sensación: el agua en tus manos, el movimiento de tus pies, los sonidos."
      },
      {
        id: "no-juzgar",
        name: "Sin Juzgar (Cómo)",
        description: "Observa tus pensamientos, emociones y acciones sin etiquetarlos como buenos o malos. Acepta la realidad tal como es.",
        exercise: "Cuando te descubras juzgando, simplemente nota el juicio como un pensamiento más. Di 'estoy teniendo un pensamiento de juicio'. Intenta reformular la observación de manera neutral."
      },
      {
        id: "una-cosa-a-la-vez",
        name: "Una Cosa a la Vez (Cómo)",
        description: "Enfoca toda tu atención en una sola actividad en el momento presente. Si tu mente se dispersa, redirígela suavemente.",
        exercise: "Cuando converses, escucha con toda tu atención. Cuando comas, solo come, saboreando cada bocado. Deja de lado las distracciones."
      },
      {
        id: "efectividad",
        name: "Con Efectividad (Cómo)",
        description: "Haz lo que funciona, lo que es necesario en la situación para alcanzar tus metas. Deja de lado el 'debería' y enfócate en lo que te acerca a tus objetivos.",
        exercise: "Antes de actuar, pregúntate: '¿Es esto efectivo para lo que quiero lograr?'. Si estás molesta y quieres gritar, pregúntate si eso te ayudará. Elige la acción más probable que funcione."
      }
    ]
  },
  {
    id: "tolerancia-malestar",
    name: "Tolerancia al Malestar: Navegando las Olas",
    description: "Habilidades para atravesar momentos de crisis y emociones intensas sin empeorar la situación, aceptando la realidad tal como es.",
    color: "var(--secondary-purple)",
    skills: [
      {
        id: "tip",
        name: "Habilidad TIPP: Cambia tu Química Corporal",
        description: "Reduce rápidamente la activación emocional extrema cambiando la química de tu cuerpo.",
        exercise: "T - Temperatura: Moja tu cara con agua fría (30s). I - Ejercicio Intenso: Actividad física vigorosa corta. P - Respiración Pautada: Exhalación más larga que inhalación. P - Relajación Muscular Progresiva: Tensa y relaja músculos."
      },
      {
        id: "distraerse",
        name: "Distraerse Sabiamente (ACCEPTS)",
        description: "Aleja temporalmente tu mente del dolor con actividades que te nutran o te enfoquen en algo diferente y positivo.",
        exercise: "A - Actividades. C - Contribuir. C - Comparar. E - Emociones opuestas. P - Empujar lejos. T - Pensamientos otros. S - Sensaciones intensas."
      },
      {
        id: "autocalmarse",
        name: "Autocalmarse con los Cinco Sentidos",
        description: "Utiliza tus sentidos para reconfortarte y encontrar un oasis de calma.",
        exercise: "Visión (algo bello), Oído (música suave), Olfato (aromas relajantes), Gusto (un té caliente), Tacto (manta suave)."
      },
      {
        id: "mejorar-momento",
        name: "Mejorar el Momento (IMPROVE)",
        description: "Pequeñas acciones que pueden transformar un instante difícil en uno más llevadero.",
        exercise: "I - Imágenes. M - Meaning (propósito). P - Plegaria/Meditación. R - Relajación. O - Una cosa a la vez. V - Vacaciones (descanso mental). E - Estímulo propio y ánimo."
      },
      {
        id: "pros-contras",
        name: "Pros y Contras con Corazón",
        description: "Evalúa las consecuencias de actuar impulsivamente versus tolerar el malestar.",
        exercise: "Haz una lista de pros y contras de tolerar el malestar, y pros y contras de ceder al impulso problemático. Compara."
      },
      {
        id: "aceptacion-radical",
        name: "Aceptación Radical de la Realidad",
        description: "Aceptar la realidad tal como es, sin luchar contra ella, especialmente cuando no se puede cambiar. Reduce el sufrimiento añadido.",
        exercise: "Identifica lo que resistes. Recuerda que la realidad es. Practica la aceptación con todo tu ser. Observa si la lucha disminuye."
      },
      {
        id: 'autocompasion',
        name: 'Autocompasión Radical',
        description: 'Tratarte a ti misma con la misma amabilidad, cuidado y comprensión que ofrecerías a un buen amigo.',
        exercise: "Cuando sufras: (1) Nota tu sufrimiento (Mindfulness). (2) Recuerda que el sufrimiento es parte de ser humano (Humanidad Compartida). (3) Ofrécete amabilidad y consuelo (Autokindness)."
      }
    ]
  },
  {
    id: "regulacion-emocional",
    name: "Regulación Emocional: Cuidando tu Jardín",
    description: "Aprende a identificar, comprender y cambiar tus emociones para que trabajen a tu favor, cultivando un paisaje emocional más resiliente.",
    color: "#FF85A1",
    textColor: "var(--text-light)", // Para asegurar contraste si el color de fondo es vibrante
    skills: [
      {
        id: "identificar-nombrar-emociones",
        name: "Identificar y Nombrar Emociones",
        description: "Conoce tus emociones. Ponerles nombre reduce su poder y te da claridad. 'Hola, ansiedad, te veo'.",
        exercise: "Lleva un registro emocional. Pregúntate: ¿Qué siento? ¿Dónde en mi cuerpo? ¿Intensidad? Usa una rueda emocional si ayuda."
      },
      {
        id: "comprobacion-hechos",
        name: "Comprobación de los Hechos",
        description: "Evalúa si tu reacción emocional y tus interpretaciones se ajustan a los hechos objetivos de una situación.",
        guide: "fact-checking-guide" 
      },
      {
        id: "resolucion-problemas",
        name: "Resolución de Problemas (Paso a Paso)",
        description: "Un método estructurado para abordar problemas que contribuyen a emociones dolorosas.",
        guide: "problem-solving-guide"
      },
      {
        id: "accion-opuesta",
        name: "Acción Opuesta con Amor",
        description: "Cuando una emoción no encaja con los hechos o no es útil, actúa de forma contraria a lo que te impulsa a hacer.",
        exercise: "Si sientes tristeza y quieres aislarte (y no hay razón objetiva), llama a un amigo. Si sientes miedo de algo seguro, acércate gradualmente."
      },
      {
        id: "acumular-emociones-positivas",
        name: "Acumular Emociones Positivas",
        description: "Siembra activamente momentos de alegría, gratitud y conexión (corto plazo). Construye una vida que valga la pena vivir (largo plazo).",
        exercise: "Corto Plazo: Haz una lista de actividades placenteras. Programa al menos una al día. Largo Plazo: Identifica valores y metas. Trabaja hacia ellas."
      },
      {
        id: "fortaleza-abc-please",
        name: "Construir Fortaleza (ABC PLEASE)",
        description: "Cuida tu cuerpo y mente para reducir la vulnerabilidad a emociones negativas intensas y aumentar tu resiliencia.",
        exercise: "A - Acumular positivas. B - Base (maestría). C - Capear (afrontar). PLEASE: PL - Tratar enfermedades físicas. E - Comer equilibrado. A - Evitar drogas. S - Dormir. E - Ejercicio."
      },
      {
        id: "atencion-plena-emociones-actuales",
        name: "Atención Plena a Emociones Actuales",
        description: "Observa tus emociones sin reaccionar, como olas en el océano. Permite que vengan y se vayan sin ser arrastrada.",
        exercise: "Cuando una emoción surja, nómbrala. Obsérvala sin juzgarla. Recuerda que es temporal. No tienes que actuar sobre ella."
      }
    ]
  },
  {
    id: "efectividad-interpersonal",
    name: "Efectividad Interpersonal: Conectando con Otros",
    description: "Habilidades para construir y mantener relaciones saludables, expresar tus necesidades y límites, y manejar conflictos.",
    color: "#4DB6AC", 
    textColor: "var(--text-light)",
    skills: [
      {
        id: "clarificar-objetivos-interpersonales",
        name: "Clarificar Objetivos Interpersonales",
        description: "Antes de una interacción, define qué quieres: ¿Obtener algo? ¿Mantener/mejorar la relación? ¿Mantener tu autorespeto?",
        exercise: "Antes de una conversación importante, anota: 1. ¿Resultado específico? 2. ¿Cómo quiero que la otra persona se sienta conmigo después? 3. ¿Cómo quiero sentirme yo conmigo después?"
      },
      {
        id: "dear-man",
        name: "DEAR MAN: Pedir u Obtener Algo / Decir No",
        description: "Guía para pedir lo que necesitas o decir no de manera efectiva, manteniendo el respeto mutuo.",
        guide: "dear-man-guide"
      },
      {
        id: "give",
        name: "GIVE: Mantener y Mejorar la Relación",
        description: "Componentes para mantener y mejorar tus relaciones, enfocándote en la validación y la amabilidad.",
        guide: "give-guide"
      },
      {
        id: "fast",
        name: "FAST: Mantener el Autorespeto",
        description: "Estrategias para interactuar de manera que mantengas tu autorespeto, siendo justa contigo misma y con tus valores.",
        guide: "fast-guide"
      }
    ]
  }
];

export const getSkillModules = () => {
  return [...skillsData];
};

export const getSkillModuleById = (moduleId) => {
  return skillsData.find(module => module.id === moduleId);
};

export const getSkillById = (moduleId, skillId) => {
  const module = getSkillModuleById(moduleId);
  if (!module) return null;
  return module.skills.find(skill => skill.id === skillId);
};

export const getInteractiveGuideData = (guideId) => {
    const guides = {
        "fact-checking-guide": {
            title: "Comprobando los Hechos con Amor",
            introduction: "A veces, nuestras emociones son intensas porque interpretamos una situación de una manera que no se ajusta completamente a los hechos. Esta guía te ayudará a explorar esto con curiosidad y sin juicio, como una detective amable de tu propia mente.",
            steps: [
                { question: "1. ¿Cuál es la emoción que quieres explorar con esta guía?", type: "text", id: "fc_emotionName", placeholder: "Ej: Miedo intenso, tristeza profunda, enojo..." },
                { question: "2. Describe brevemente el evento o situación que disparó esta emoción. Solo los hechos observables, como si una cámara lo grabara.", type: "textarea", id: "fc_triggerEvent", placeholder: "Ej: 'Recibí un mensaje corto de X persona.', 'No me llamaron para la entrevista.'"},
                { question: "3. ¿Cuáles fueron tus interpretaciones o pensamientos automáticos sobre este evento? (Lo que te dijiste a ti misma)", type: "textarea", id: "fc_interpretations", placeholder: "Ej: 'Significa que está enojada conmigo.', 'Nunca conseguiré trabajo.'"},
                { question: "4. ¿Tu emoción (y su intensidad) se basa más en los hechos observables (Paso 2) o en tus interpretaciones (Paso 3)?", type: "radio", id: "fc_basisOfEmotion", options: ["Principalmente en los hechos", "Principalmente en mis interpretaciones", "En una mezcla de ambos"] },
                { question: "5. Ahora, busquemos evidencia. ¿Qué hechos observables (que una cámara podría ver o grabar) APOYAN tu interpretación del Paso 3?", type: "textarea", id: "fc_supportingFacts", placeholder: "Ej: 'El mensaje era más corto de lo usual.' (Hecho). 'No he tenido éxito en otras entrevistas.' (Hecho pasado, ¿es relevante para ESTA interpretación?)."},
                { question: "6. ¿Qué hechos observables (que una cámara podría ver o grabar) NO APOYAN o CONTRADICEN tu interpretación del Paso 3?", type: "textarea", id: "fc_contradictingFacts", placeholder: "Ej: 'Hemos tenido buenas conversaciones recientemente.', 'Podría estar ocupada.', 'El mercado laboral es competitivo.'"},
                { question: "7. ¿Hay otras formas posibles de interpretar la situación, considerando TODOS los hechos (los que apoyan y los que no)? Escribe al menos una alternativa.", type: "textarea", id: "fc_alternativeViews", placeholder: "Ej: 'Quizás X persona estaba ocupada y por eso el mensaje fue corto.', 'La entrevista pudo tener muchos candidatos.'"},
                { question: "8. Pensando en la interpretación más equilibrada y basada en hechos (considerando el Paso 6 y 7), ¿cómo describirías la situación ahora?", type: "textarea", id: "fc_balancedThought", placeholder: "Ej: 'Recibí un mensaje corto, no sé la razón aún.' 'No fui seleccionada para esta oportunidad específica.'"},
                { question: "9. Si tu emoción original (Paso 1) aún está presente, ¿cómo se siente ahora su intensidad después de este análisis? (1=Muy baja, 5=Muy alta)", type: "rating", id: "fc_emotionIntensityAfter", options: [1,2,3,4,5]},
                { question: "10. ¿Qué acción efectiva (o inacción sabia) podrías tomar ahora, basada en esta nueva perspectiva más ajustada a los hechos?", type: "textarea", id: "fc_effectiveAction", placeholder: "Ej: 'Puedo preguntarle a X cómo está, sin asumir enojo.', 'Seguiré aplicando a otras oportunidades.'"}
            ],
            conclusion: "¡Has hecho un gran trabajo, corazón! Recordar que tus pensamientos no siempre son hechos es una habilidad poderosa. Con cada práctica, te vuelves más sabia en navegar tus emociones."
        },
        "problem-solving-guide": {
            title: "Resolviendo Problemas con Claridad y Corazón",
            introduction: "Cuando una situación te causa malestar persistente y parece que algo necesita cambiar, esta guía te ayudará a abordarlo paso a paso. Eres capaz de encontrar soluciones, ¡confía en ti!",
            steps: [
                { question: "Paso 1: Describe el problema con la mayor claridad y objetividad posible. ¿Qué es exactamente lo que te molesta o dificulta tu bienestar?", type: "textarea", id: "ps_defineProblem", placeholder: "Ej: 'Siento mucha soledad últimamente y no sé cómo hacer nuevos amigos.'"},
                { question: "Paso 2: ¿Cuál es tu meta principal en relación a este problema? ¿Cómo se vería la situación si el problema estuviera resuelto o fuera menos problemático para ti?", type: "textarea", id: "ps_defineGoal", placeholder: "Ej: 'Me gustaría sentirme más conectada y tener al menos una conversación significativa a la semana.'"},
                { question: "Paso 3: Ahora, una lluvia de ideas de TODAS las posibles soluciones o pasos que podrías dar. No las juzgues aún, ¡cualquier idea es bienvenida!", type: "textarea", id: "ps_brainstormSolutions", placeholder: "Ej: 'Unirme a un club', 'Hablar con un viejo amigo', 'Usar una agenda'..."},
                { question: "Paso 4: De tu lluvia de ideas, elige 2 o 3 soluciones que parezcan más prometedoras. Para cada una, piensa en los PROS (ventajas) y los CONTRAS (desventajas).", type: "pros-cons-list", id: "ps_prosConsSolutions", note:"Añade una fila por cada solución que quieras analizar."},
                { question: "Paso 5: Basándote en tus pros y contras, ¿cuál solución (o combinación de pasos) eliges para empezar? Describe tu plan de acción: ¿Qué harás? ¿Cuándo? ¿Necesitas algo?", type: "textarea", id: "ps_actionPlan", placeholder: "Ej: 'Esta semana, buscaré clubes de lectura (Miércoles). Necesito mi laptop.'"},
                { question: "Paso 6: ¡Comprométete con amor a dar el primer paso de tu plan! El progreso es más importante que la perfección.", type: "checkbox", label: "Me comprometo con cariño a intentar este primer paso.", id: "ps_commitToAction" },
                { question: "Paso 7 (Para después de actuar): ¿Cómo fue? ¿Qué funcionó? ¿Qué no? ¿Qué aprendiste? ¿Ajustar el plan o probar otra solución?", type: "textarea", id: "ps_evaluateResults", placeholder: "Este espacio es para tu reflexión después de intentarlo."}
            ],
            conclusion: "¡Maravilloso! Enfrentar los problemas así es un acto de gran valentía y sabiduría. Cada paso, incluso si no sale perfecto, es un aprendizaje valioso en tu camino."
        },
        "dear-man-guide": {
            title: "DEAR MAN: Pedir con Gracia y Decir No con Firmeza",
            introduction: "Esta habilidad te ayuda a comunicar tus necesidades, pedir lo que quieres y decir 'no' de manera efectiva, manteniendo tanto tus objetivos como tus relaciones importantes.",
            sections: [
                { title: "D - Describe", instruction: "Describe la situación actual de forma clara, breve y objetiva. Cíñete solo a los hechos, como si una cámara lo grabara, sin juicios ni interpretaciones.", example: "Ej: 'Noté que en las últimas tres reuniones de equipo, mis ideas no fueron discutidas.' o 'Me pediste que cuidara a tu mascota este fin de semana.'", type: "textarea", id: "dear_describe", rows: 3 },
                { title: "E - Expresa", instruction: "Expresa tus sentimientos y opiniones sobre la situación de manera clara. Usa frases con 'Yo siento...', 'Yo quiero...', 'Yo no quiero...'. No asumas que la otra persona sabe cómo te sientes.", example: "Ej: 'Me siento frustrada y un poco desanimada por esto.' o 'Quiero ayudarte, pero este fin de semana ya tengo otros compromisos importantes.'", type: "textarea", id: "dear_express", rows: 3 },
                { title: "A - Aserción (Pide/Di No)", instruction: "Pide claramente lo que quieres o di 'no' de forma clara y directa. Sé específica. No des rodeos ni esperes que la otra persona adivine.", example: "Ej: 'Me gustaría que en la próxima reunión podamos dedicar unos minutos a discutir mis propuestas.' o 'No, no podré cuidar a tu mascota este fin de semana.'", type: "textarea", id: "dear_assert", rows: 3 },
                { title: "R - Refuerza (o Recompensa)", instruction: "Explica las consecuencias positivas (refuerzos) para la otra persona o la relación si obtienes lo que quieres, o cómo puede beneficiarles. Si es apropiado, ofrece una recompensa o agradecimiento.", example: "Ej: 'Creo que mis ideas podrían aportar valor al proyecto y ayudarnos a alcanzar nuestros objetivos más rápido.' o 'Aprecio mucho que pienses en mí para esto y espero poder ayudarte en otra ocasión.'", type: "textarea", id: "dear_reinforce", rows: 3 },
                { type: "divider", label:"MAN (Cómo decirlo con Autorespeto y Efectividad)"},
                { title: "M - Mantente Mindful (Enfocada)", instruction: "Mantén tu objetivo en mente. No te desvíes del tema ni te dejes llevar por distracciones o provocaciones. Si es necesario, usa la técnica del 'disco rayado' (repetir tu petición o negativa con calma).", example: "Si intentan cambiar de tema: 'Entiendo tu punto, pero ahora me gustaría centrarme en [tu objetivo].'", type: "textarea", id: "man_mindful", rows: 3 },
                { title: "A - Apariencia Segura", instruction: "Muestra una postura y tono de voz seguros y confiados (aunque por dentro sientas nervios). Mantén contacto visual (si es culturalmente apropiado), habla con voz firme pero amable, sin susurrar ni gritar.", example: "Practica frente al espejo si es necesario. Hombros hacia atrás, cabeza en alto.", type: "textarea", id: "man_appearConfident", rows: 3 },
                { title: "N - Negocia", instruction: "Prepárate para negociar si es necesario y estás dispuesta a hacerlo. Ofrece o pide soluciones alternativas. Sé flexible en los detalles, pero firme en tu objetivo principal o en tu límite.", example: "Ej: 'Si no es posible discutirlo en la reunión, ¿podríamos tener una charla breve después?' o 'Aunque no puedo este fin de semana, ¿te serviría si te ayudo a buscar otra persona?'", type: "textarea", id: "man_negotiate", rows: 3 }
            ],
            conclusion: "¡Bien hecho por practicar DEAR MAN! Comunicarte así es un acto de amor propio y respeto por los demás. Cada vez te sentirás más cómoda y efectiva."
        },
        "give-guide": {
            title: "GIVE: Cultivando Relaciones Positivas",
            introduction: "Esta habilidad te ayuda a mantener y mejorar tus relaciones importantes, enfocándote en cómo interactúas con los demás para fomentar la conexión y el entendimiento mutuo.",
            sections: [
                { title: "G - Gentle (Sé Amable y Gentil)", instruction: "Usa un tono de voz amable, palabras respetuosas y un lenguaje corporal suave. Evita los ataques verbales, las amenazas, los juicios o el sarcasmo que pueda herir.", example: "Incluso si estás en desacuerdo o te sientes frustrada, intenta mantener la calma y la cortesía. 'Entiendo que esto es importante para ti...' en lugar de '¡Siempre haces lo mismo!'", type: "textarea", id: "give_gentle", rows: 3 },
                { title: "I - Interested (Muestra Interés Genuino)", instruction: "Escucha activamente lo que la otra persona está diciendo, sin interrumpir. Haz preguntas para entender mejor, asiente, usa contacto visual (si es cómodo) y demuestra que te importa su perspectiva.", example: "'Cuéntame más sobre eso, por favor.' '¿Cómo te sientes con esta situación?' 'Entiendo lo que dices cuando mencionas que...'", type: "textarea", id: "give_interested", rows: 3 },
                { title: "V - Validate (Valida los Sentimientos y Pensamientos del Otro)", instruction: "Valida lo que la otra persona siente o piensa, incluso si no estás de acuerdo con ello. Hazle saber que entiendes (o intentas entender) su punto de vista y que sus emociones son comprensibles dada su perspectiva.", example: "'Puedo ver por qué te sentirías de esa manera.' 'Tiene sentido que pienses eso, especialmente si consideras que...' 'Comprendo que esto te preocupe mucho.'", type: "textarea", id: "give_validate", rows: 3 },
                { title: "E - Easy Manner (Actitud Ligera, Fácil y Relajada)", instruction: "Intenta mantener una actitud relajada y abierta. Usa un poco de humor (si es apropiado y la situación lo permite), sonríe, sé paciente. Facilita que la otra persona se sienta cómoda.", example: "Relaja tu cuerpo, respira. Una sonrisa amable puede ayudar mucho. Evita la tensión excesiva o la rigidez.", type: "textarea", id: "give_easyManner", rows: 3 }
            ],
            conclusion: "Con la habilidad GIVE, cada interacción se convierte en una oportunidad para sembrar cariño y fortalecer tus lazos. El respeto y la calidez que ofreces, a menudo vuelven a ti multiplicados."
        },
        "fast-guide": {
            title: "FAST: Fortaleciendo tu Autorespeto",
            introduction: "Esta habilidad te ayuda a mantener tu autorespeto en las interacciones, especialmente cuando es difícil, asegurando que actúes de acuerdo con tus valores y te trates con dignidad.",
            sections: [
                { title: "F - Fair (Sé Justa contigo misma y con los demás)", instruction: "Considera tus propios derechos, necesidades y deseos, así como los de la otra persona. No te sacrifiques innecesariamente ni te aproveches de otros. Busca un equilibrio.", example: "Reconoce que tus necesidades son tan válidas como las de los demás. 'Necesito tiempo para mí también.'", type: "textarea", id: "fast_fair", rows: 3 },
                { title: "A - Apologies (Sin Disculpas Innecesarias)", instruction: "No te disculpes en exceso, ni por tener una opinión, por decir 'no' a algo que no quieres o no puedes hacer, o simplemente por ser tú. Discúlpate sinceramente solo si has hecho algo incorrecto.", example: "En lugar de 'Siento mucho molestarte, pero ¿podrías...?', prueba con 'Me gustaría pedirte si podrías...'. Evita disculparte por tus límites.", type: "textarea", id: "fast_noApologies", rows: 3 },
                { title: "S - Stick to Values (Aférrate a tus Valores)", instruction: "Mantente firme en lo que crees que es correcto y en tus valores más importantes. No cedas a la presión si eso implica ir en contra de tus principios o hacer algo que te haga sentir mal contigo misma.", example: "Si la honestidad es un valor clave para ti, no mientas para agradar o evitar un conflicto. 'Prefiero ser sincera sobre esto...'", type: "textarea", id: "fast_stickToValues", rows: 3 },
                { title: "T - Truthful (Sé Honesta y Veraz)", instruction: "Sé honesta contigo misma y con los demás (sin ser cruel). No exageres, no minimices tus sentimientos o necesidades, y no inventes excusas. Expresa tu verdad de manera respetuosa.", example: "Si no quieres ir a un evento, en lugar de inventar una excusa elaborada, puedes decir amablemente: 'Gracias por la invitación, pero esta vez no podré asistir.'", type: "textarea", id: "fast_truthful", rows: 3 }
            ],
            conclusion: "La habilidad FAST es un abrazo para tu alma, te ayuda a honrarte y a vivir de acuerdo con lo que es verdaderamente importante para ti. ¡Tu autorespeto es un tesoro incalculable!"
        }
    };
    return guides[guideId] || null;
};