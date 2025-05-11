const mindfulnessExercises = [
    {
      id: "breathing-anchor",
      title: "Ancla de Respiración: Tu Puerto Seguro",
      description: "Encuentra calma y centro conectando con el ritmo natural de tu respiración. Es un ancla siempre disponible en el mar de tus pensamientos y emociones.",
      duration: "5-10 minutos",
      type: "Respiración",
      steps: [
        "Siéntate cómodamente, con la espalda recta pero relajada. Cierra suavemente los ojos o baja la mirada.",
        "Lleva tu atención a tu respiración, allí donde la sientas más claramente: en las fosas nasales, el pecho o el abdomen.",
        "Simplemente observa cómo el aire entra y sale, sin intentar cambiar nada. Siente cada inhalación y cada exhalación.",
        "Si tu mente se distrae con pensamientos, es natural. Con amabilidad, reconócelo y redirige suavemente tu atención a la respiración.",
        "Permanece así unos minutos, anclado en el presente a través de tu aliento vital."
      ],
      affirmation: "Con cada respiración, encuentro mi calma interior."
    },
    {
      id: "body-scan-love",
      title: "Escaneo Corporal: Un Abrazo de Consciencia",
      description: "Recorre tu cuerpo con atención plena y cariño, notando cualquier sensación sin juicio. Es una forma de habitarte plenamente y agradecerle a tu cuerpo.",
      duration: "10-15 minutos",
      type: "Escaneo Corporal",
      steps: [
        "Acuéstate o siéntate en una posición cómoda. Permite que tu cuerpo se relaje.",
        "Lleva tu atención a los dedos de tus pies. Siente cualquier sensación presente: hormigueo, calor, contacto con la ropa.",
        "Lentamente, ve subiendo tu atención por tus pies, tobillos, pantorrillas, rodillas, muslos. Dedica un momento a cada parte, observando con curiosidad.",
        "Continúa por tus caderas, abdomen, pecho. Nota el suave movimiento de la respiración.",
        "Sigue por tu espalda, hombros, brazos, manos y dedos.",
        "Finalmente, lleva tu atención a tu cuello, rostro y cabeza. Relaja cualquier tensión que encuentres.",
        "Permanece unos instantes sintiendo todo tu cuerpo, respirando con él, envuelto en una sensación de presencia y gratitud."
      ],
      affirmation: "Mi cuerpo es mi hogar, lo cuido y lo escucho con amor."
    },
    {
      id: "loving-kindness",
      title: "Meditación de Amor Benevolente: Cultivando Compasión",
      description: "Envía pensamientos de amor, bienestar y paz hacia ti mismo y hacia los demás. Una práctica que expande el corazón y nutre la conexión.",
      duration: "10-15 minutos",
      type: "Compasión",
      steps: [
        "Adopta una postura cómoda. Respira suavemente unas cuantas veces para centrarte.",
        "Dirige primero los deseos de amor benevolente hacia ti mismo. Repite internamente frases como: 'Que yo esté bien. Que yo sea feliz. Que yo esté libre de sufrimiento. Que yo esté en paz.'",
        "Luego, piensa en un ser querido y envíale los mismos deseos: 'Que (nombre) esté bien. Que sea feliz. Que esté libre de sufrimiento. Que esté en paz.'",
        "Extiende estos deseos a una persona neutral, alguien por quien no sientes ni agrado ni desagrado particular.",
        "Si te sientes capaz, dirige estos deseos a una persona con la que tengas alguna dificultad. Este puede ser un paso desafiante, hazlo con suavidad.",
        "Finalmente, irradia estos deseos a todos los seres, en todas partes: 'Que todos los seres estén bien. Que todos sean felices. Que todos estén libres de sufrimiento. Que todos estén en paz.'",
        "Descansa en la sensación de amor y conexión que esta práctica puede generar."
      ],
      affirmation: "Mi corazón se abre al amor y la compasión por mí y por todos los seres."
    },
    {
      id: "mindful-walking",
      title: "Caminata Consciente: Pasos de Presencia",
      description: "Transforma una simple caminata en una meditación en movimiento, conectando con las sensaciones de tu cuerpo y el entorno.",
      duration: "Variable",
      type: "Movimiento",
      steps: [
          "Encuentra un lugar tranquilo donde puedas caminar unos pasos de ida y vuelta, o un sendero corto.",
          "Comienza de pie, sintiendo el contacto de tus pies con el suelo. Toma unas respiraciones conscientes.",
          "Empieza a caminar muy lentamente. Presta atención a las sensaciones en tus pies al levantar, mover y apoyar cada uno.",
          "Siente el movimiento en tus piernas, el balanceo de tus brazos, la postura de tu cuerpo.",
          "Si lo deseas, puedes coordinar tu respiración con tus pasos, por ejemplo, inhalar durante tres pasos, exhalar durante tres pasos.",
          "Expande tu conciencia para incluir los sonidos a tu alrededor, la temperatura del aire, lo que ves.",
          "Si tu mente divaga, tráela de vuelta con amabilidad a las sensaciones de caminar."
      ],
      affirmation: "Con cada paso, me arraigo en el presente y celebro el viaje."
    }
  ];
  
  export const getMindfulnessExercises = () => {
    return [...mindfulnessExercises];
  };
  
  export const getMindfulnessExerciseById = (id) => {
    return mindfulnessExercises.find(exercise => exercise.id === id);
  };