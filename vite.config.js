import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            injectRegister: 'auto',
            devOptions: {
                enabled: true // Para probar PWA en desarrollo
            },
            workbox: { // Para cacheo básico y offline
                globPatterns: ['**/*.{js,css,html,ico,png,svg,json,woff2}']
            },
            manifest: { 
                name: "Mi Refugio Interior",
                short_name: "Refugio",
                description: "Un espacio seguro y de apoyo TDC para ti, mi amor.",
                icons: [
                    {
                        src: "/icons/android-chrome-192x192.png",
                        sizes: "192x192",
                        type: "image/png",
                        purpose: "any maskable"
                    },
                    {
                        src: "/icons/android-chrome-512x512.png",
                        sizes: "512x512",
                        type: "image/png",
                        purpose: "any maskable"
                    },
                    {
                        src: "/icons/apple-touch-icon.png",
                        sizes: "180x180",
                        type: "image/png",
                        type: "image/png",
                        purpose: "any"
                    },
                    {
                        src: "/icons/favicon-32x32.png",
                        sizes: "32x32",
                        type: "image/png",
                        purpose: "any"
                    },
                    {
                        src: "/icons/favicon-16x16.png",
                        sizes: "16x16",
                        type: "image/png",
                        purpose: "any"
                    }
                ],
                start_url: "/",
                display: "standalone",
                background_color: "#FFF0F5",
                theme_color: "#A16AE8",
                orientation: "portrait-primary",
                scope: "/"
            }
        })
    ],
})