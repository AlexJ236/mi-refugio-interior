# Mi Refugio Interior (My Inner Refuge)

**A secure and personalized DBT support space, created with love.** ❤️

"Mi Refugio Interior" (My Inner Refuge) is a Progressive Web Application (PWA) thoughtfully designed as a personal digital sanctuary. Drawing inspiration from Dialectical Behavior Therapy (DBT) principles, this application provides a private, comforting, and aesthetically pleasing environment. It empowers users with tools for emotional logging, gratitude journaling, DBT skill-building, mindfulness exploration, and proactive coping strategy planning. This project showcases the development of a feature-rich, user-centric mental well-being support tool, emphasizing privacy and personalized user experience.

## ✨ Main Features

* **Daily Card:** Log your emotions (with detailed selection and intensity), urges, DBT skills used, and personal notes. Allows editing of past entries. Includes skill suggestions based on logged emotions.
* **Gratitude Journal:** A space to cultivate a positive perspective by noting daily gratitudes.
* **DBT Skills:** A compendium of modules (Mindfulness, Distress Tolerance, Emotion Regulation, Interpersonal Effectiveness) with descriptions, exercises, and **interactive step-by-step guides** for key skills like Fact Checking, Problem Solving, DEAR MAN, GIVE, and FAST.
* **Mindfulness Oasis:** A selection of text-based mindfulness exercises to find calm and connect with the present.
* **Personal Support Plan:** Create and consult your personalized crisis and well-being plan, stored securely.
* **Letters to My Future Self:** Write and schedule the delivery of messages of encouragement or wisdom for a future date.
* **Refuge Customization:**
    * Manage your username and password.
    * Choose from predefined visual themes or **create your own theme** with a custom color palette.
    * Option to toggle the display of progress charts.
* **My Progress Garden:** Sensitively (and optionally) visualize charts on emotion frequency, skill usage, and streaks for Daily Card and Gratitude Journal use.
* **Immediate Support Tools:**
    * **SOS Refuge Button:** Quick access to emergency contacts and key strategies from your Support Plan.
    * **Pause Button:** An interactive tool for moments of impulsivity, offering a timer with mindfulness or distraction suggestions.
* **Gentle Gamification:** Subtle positive reinforcements, such as visual changes and encouraging messages based on activity, and an "achievements" system to celebrate consistency.
* **User Experience:** Intuitive interface, responsive design, warm and validating language, and a customizable aesthetic focused on calm and positivity.
* **PWA (Progressive Web App):** Can be added to the mobile device's home screen for a native app-like experience, with its own icon.

## 🛠️ Technologies Used

* **Frontend:** React (v18.3+), Vite (v5.2+), JavaScript (ES6+), JSX, React Router DOM (v6.23+)
* **Backend (BaaS):** Appwrite Cloud (SDK v15.0.0) - Authentication, Database.
* **Styling:** Modularized CSS with variables, Responsive Design.
* **State Management:** React Context API.
* **Charts:** Recharts.
* **PWA:** Web App Manifest, Service Worker (basic, optional via `vite-plugin-pwa`).

## 🚀 Getting Started (Local Development)

1.  **Clone the Repository:**
    ```bash
    git clone [https://YOUR-REPOSITORY-URL.git](https://YOUR-REPOSITORY-URL.git)
    cd project-directory-name
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```
    or if you use yarn:
    ```bash
    yarn install
    ```

3.  **Set Up Environment Variables:**
    * Create a `.env` file in the project root.
    * Copy the contents of `.env.example` (if you have one) or add the following variables with your Appwrite IDs:
        ```env
        VITE_APPWRITE_ENDPOINT="[https://cloud.appwrite.io/v1](https://cloud.appwrite.io/v1)" # Or your Appwrite endpoint
        VITE_APPWRITE_PROJECT_ID="YOUR_PROJECT_ID"
        VITE_APPWRITE_DATABASE_ID="YOUR_DATABASE_ID"
        VITE_APPWRITE_COLLECTION_ID_DAILY_CARDS="YOUR_DAILY_CARDS_COLLECTION_ID"
        VITE_APPWRITE_COLLECTION_ID_SUPPORT_PLANS="YOUR_SUPPORT_PLANS_COLLECTION_ID"
        VITE_APPWRITE_COLLECTION_ID_GRATITUDE_ENTRIES="YOUR_GRATITUDE_ENTRIES_COLLECTION_ID"
        VITE_APPWRITE_COLLECTION_ID_FUTURE_ME_LETTERS="YOUR_FUTURE_ME_LETTERS_COLLECTION_ID"
        VITE_APPWRITE_COLLECTION_ID_USER_PREFERENCES="YOUR_USER_PREFERENCES_COLLECTION_ID"
        ```

4.  **Start the Development Server:**
    ```bash
    npm run dev
    ```
    or
    ```bash
    yarn dev
    ```
    The application should be running at `http://localhost:5173` (or the port Vite assigns).

5.  **Appwrite Cloud Project Configuration:**
    * Ensure you have a project created in [Appwrite Cloud](https://cloud.appwrite.io/).
    * **Authentication:** Enable the Email/Password method.
    * **Database:** Create a database and the following collections with the attributes and permissions specified in the detailed project documentation (if available, otherwise define as needed):
        * `daily_cards`
        * `support_plans`
        * `gratitude_entries`
        * `future_me_letters`
        * `user_preferences`
    * **Platforms:** Add a web platform for local development (e.g., Hostname: `localhost`) and another for your deployed site (e.g., Hostname: `myinnerrefuge.netlify.app`).

## 🏗️ Building for Production

```bash
npm run build
```

This will generate the dist/ folder with optimized static files, ready to be deployed on any static site hosting platform.

🌐 Deployment
This application is optimized for easy deployment on platforms like Netlify, Vercel, or Firebase Hosting.

For Netlify (Recommended):

Push your code to a GitHub/GitLab/Bitbucket repository.
Connect your repository to Netlify.
Build Settings:
Build command: npm run build
Publish directory: dist
Add your environment variables (those from the .env file) in Netlify's site configuration.
Create a _redirects file in your project's root (or public folder that gets copied to dist) with the content: /* /index.html 200 for correct SPA routing.
Ensure you add the Netlify domain (e.g., your-site.netlify.app) to your Appwrite project's "Platforms."
💖 Created With Love
This project was developed with immense care and dedication as a personal gift and a tool for support.
