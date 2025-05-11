# Mi Refugio Interior

**Un espacio seguro y de apoyo TDC personalizado, creado con amor.** ❤️

"Mi Refugio Interior" es una aplicación web progresiva (PWA) diseñada como un santuario digital personal, inspirada en los principios de la Terapia Dialéctico Conductual (TDC). Su objetivo es ofrecer un espacio privado, reconfortante y estéticamente agradable para el registro emocional, la práctica de la gratitud, el aprendizaje de habilidades TDC, la exploración de mindfulness, la planificación de estrategias de afrontamiento y mucho más.

## ✨ Características Principales

* **Tarjeta Diaria:** Registra tus emociones (con selección detallada e intensidad), impulsos, habilidades TDC utilizadas y notas personales. Permite editar entradas pasadas. Incluye sugerencias de habilidades basadas en las emociones registradas.
* **Diario de Gratitud:** Un espacio para cultivar una perspectiva positiva anotando agradecimientos diarios.
* **Habilidades TDC:** Un compendio de módulos (Mindfulness, Tolerancia al Malestar, Regulación Emocional, Efectividad Interpersonal) con descripciones, ejercicios y **guías interactivas paso a paso** para habilidades clave como Comprobación de Hechos, Resolución de Problemas, DEAR MAN, GIVE y FAST.
* **Oasis de Mindfulness:** Una selección de ejercicios de mindfulness textuales para encontrar calma y conexión con el presente.
* **Plan de Apoyo Personal:** Crea y consulta tu plan de crisis y bienestar personalizado, almacenado de forma segura.
* **Cartas para Mi Yo del Futuro:** Escribe y programa la entrega de mensajes de aliento o sabiduría para una fecha futura.
* **Personalización del Refugio:**
    * Gestiona tu nombre de usuario y contraseña.
    * Elige entre temas visuales predefinidos o **crea tu propio tema** con una paleta de colores personalizada.
    * Opción para activar/desactivar la visualización de gráficos de progreso.
* **Mi Jardín de Avances (Progreso):** Visualiza de forma sensible (y opcional) gráficos sobre la frecuencia de emociones, uso de habilidades y rachas de uso de la Tarjeta Diaria y el Diario de Gratitud.
* **Herramientas de Apoyo Inmediato:**
    * **Botón SOS Refugio:** Acceso rápido a contactos de emergencia y estrategias clave de tu Plan de Apoyo.
    * **Botón de Pausa:** Una herramienta interactiva para momentos de impulsividad, ofreciendo un temporizador con sugerencias de mindfulness o distracción.
* **Gamificación Suave:** Refuerzos positivos sutiles, como cambios visuales y mensajes de ánimo basados en la actividad, y un sistema de "logros" para celebrar la constancia.
* **Experiencia de Usuario:** Interfaz intuitiva, diseño responsivo, lenguaje cálido y validante, y una estética personalizable enfocada en la calma y el positivismo.
* **PWA (Progressive Web App):** Puede ser añadida a la pantalla de inicio del dispositivo móvil para una experiencia similar a una aplicación nativa, con tu propio icono.

## 🛠️ Tecnologías Utilizadas

* **Frontend:** React (v18.3+), Vite (v5.2+), JavaScript (ES6+), JSX, React Router DOM (v6.23+)
* **Backend (BaaS):** Appwrite Cloud (SDK v15.0.0) - Autenticación, Base de Datos.
* **Estilo:** CSS Modularizado con variables, Diseño Responsivo.
* **Gestión de Estado:** React Context API.
* **Gráficos:** Recharts.
* **PWA:** Manifest Web App, Service Worker (básico, opcional via `vite-plugin-pwa`).

## 🚀 Cómo Empezar (Desarrollo Local)

1.  **Clonar el Repositorio:**
    ```bash
    git clone [https://URL-DE-TU-REPOSITORIO.git](https://URL-DE-TU-REPOSITORIO.git)
    cd nombre-del-directorio-del-proyecto
    ```

2.  **Instalar Dependencias:**
    ```bash
    npm install
    ```
    o si usas yarn:
    ```bash
    yarn install
    ```

3.  **Configurar Variables de Entorno:**
    * Crea un archivo `.env` en la raíz del proyecto.
    * Copia el contenido de `.env.example` (si lo tienes) o añade las siguientes variables con tus IDs de Appwrite:
        ```env
        VITE_APPWRITE_ENDPOINT="[https://cloud.appwrite.io/v1](https://cloud.appwrite.io/v1)" # O tu endpoint de Appwrite
        VITE_APPWRITE_PROJECT_ID="TU_PROJECT_ID"
        VITE_APPWRITE_DATABASE_ID="TU_DATABASE_ID"
        VITE_APPWRITE_COLLECTION_ID_DAILY_CARDS="ID_COLECCION_TARJETAS_DIARIAS"
        VITE_APPWRITE_COLLECTION_ID_SUPPORT_PLANS="ID_COLECCION_PLANES_APOYO"
        VITE_APPWRITE_COLLECTION_ID_GRATITUDE_ENTRIES="ID_COLECCION_GRATITUD"
        VITE_APPWRITE_COLLECTION_ID_FUTURE_ME_LETTERS="ID_COLECCION_CARTAS_FUTURO"
        VITE_APPWRITE_COLLECTION_ID_USER_PREFERENCES="ID_COLECCION_PREFERENCIAS_USUARIO"
        ```

4.  **Iniciar el Servidor de Desarrollo:**
    ```bash
    npm run dev
    ```
    o
    ```bash
    yarn dev
    ```
    La aplicación debería estar corriendo en `http://localhost:5173` (o el puerto que Vite asigne).

5.  **Configuración del Proyecto Appwrite Cloud:**
    * Asegúrate de tener un proyecto creado en [Appwrite Cloud](https://cloud.appwrite.io/).
    * **Autenticación:** Habilita el método de Email/Password.
    * **Base de Datos:** Crea una base de datos y las siguientes colecciones con los atributos y permisos especificados en la documentación detallada del proyecto.
        * `daily_cards`
        * `support_plans`
        * `gratitude_entries`
        * `future_me_letters`
        * `user_preferences`
    * **Plataformas (Platforms):** Añade una plataforma web para desarrollo local (ej. Hostname: `localhost`) y otra para tu sitio desplegado (ej. Hostname: `mirefugiointerior.netlify.app`).

## 🏗️ Build para Producción

```bash
npm run build
Esto generará la carpeta dist/ con los archivos estáticos optimizados, listos para ser desplegados en cualquier plataforma de hosting de sitios estáticos.

🌐 Despliegue
Esta aplicación está optimizada para un despliegue sencillo en plataformas como Netlify, Vercel o Firebase Hosting.

Para Netlify (Recomendado):

Sube tu código a un repositorio de GitHub/GitLab/Bitbucket.
Conecta tu repositorio a Netlify.
Configuración de Build:
Build command: npm run build
Publish directory: dist
Añade tus variables de entorno (las del archivo .env) en la configuración del sitio en Netlify.
Crea un archivo _redirects en la raíz de tu proyecto con el contenido: /* /index.html 200 para el correcto funcionamiento del enrutamiento SPA.
Asegúrate de añadir el dominio de Netlify (ej. tu-sitio.netlify.app) a las "Platforms" de tu proyecto Appwrite.
💖 Creado Con Amor
Este proyecto fue desarrollado con un inmenso cariño y dedicación como un regalo personal y una herramienta de apoyo.