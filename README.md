# Aplicación de Apoyo TDC Personalizada (MVP)

Esta es una aplicación web de apoyo inspirada en la Terapia Dialéctico Conductual (TDC), diseñada inicialmente como una herramienta personalizada y de apoyo.

## Tecnologías Principales

* **Frontend:** React (v18.3+) con Vite (v5.2+)
* **Backend (BaaS):** Appwrite Cloud
* **Enrutamiento:** React Router DOM (v6.23+)
* **Estilo:** CSS modular con variables globales
* **Gestión de Estado:** React Context API (para Autenticación)

## Configuración del Backend (Appwrite Cloud)

1.  **Proyecto:** Crea un proyecto en Appwrite. Obtén el `Project ID` y el `API Endpoint`.
2.  **Autenticación:** Habilita el método de autenticación por Email/Password.
3.  **Base de Datos:**
    * Crea una base de datos (o usa la 'default'). Obtén su `Database ID`.
    * **Colección `daily_cards`:**
        * Atributos: `userId` (string, requerido, indexado), `date` (string, requerida, formato ISO YYYY-MM-DD, indexada), `cardData` (string, requerido, tamaño amplio para JSON).
        * Permisos (Nivel de Colección): Usuarios autenticados pueden crear (`role:member` con `create`).
        * Permisos (Nivel de Documento): El usuario creador tiene permisos CRUD (`read("user:USER_ID")`, `update("user:USER_ID")`, `delete("user:USER_ID")`).
    * **Colección `support_plans`:**
        * Atributos: `userId` (string, requerido, indexado, único), `crisisContacts` (string, opcional), `copingStrategies` (string, opcional), `warningSigns` (string, opcional), `selfCareActivities` (string, opcional), `goals` (string, opcional), `notes` (string, opcional).
        * Permisos: Similar a `daily_cards`.
    * **Colección `gratitude_entries`:** (NUEVO)
        * Atributos: `userId` (string, requerido, indexado), `date` (string, requerida, formato ISO YYYY-MM-DD), `entryText` (string, requerida, tamaño amplio).
        * Permisos: Similar a `daily_cards`.

## Cómo Ejecutar la Aplicación

1.  Clona o descarga el proyecto.
2.  Crea un archivo `.env` en la raíz del proyecto con tus credenciales de Appwrite (ver ejemplo en la documentación o más arriba).
    ```env
    VITE_APPWRITE_ENDPOINT="TU_ENDPOINT"
    VITE_APPWRITE_PROJECT_ID="TU_ID_DE_PROYECTO"
    VITE_APPWRITE_DATABASE_ID="TU_ID_DE_BASE_DE_DATOS"
    VITE_APPWRITE_COLLECTION_ID_DAILY_CARDS="TU_ID_COLECCION_TARJETAS_DIARIAS"
    VITE_APPWRITE_COLLECTION_ID_SUPPORT_PLANS="TU_ID_COLECCION_PLAN_APOYO"
    VITE_APPWRITE_COLLECTION_ID_GRATITUDE_ENTRIES="TU_ID_COLECCION_GRATITUD"
    ```
3.  Instala las dependencias:
    ```bash
    npm install
    ```
4.  Inicia el servidor de desarrollo:
    ```bash
    npm run dev
    ```
5.  Abre la URL local (ej. `http://localhost:5173`) en tu navegador.

¡Que este espacio te brinde paz y claridad!