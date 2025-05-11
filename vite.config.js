import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate', // Actualiza el service worker automáticamente
      injectRegister: 'auto',
      devOptions: {
        enabled: true, // Habilita el PWA en modo desarrollo
      },
      manifest: {
        // Nombre de la aplicación
        name: 'Mi Refugio Interior',
        short_name: 'Refugio',
        description: 'Un espacio seguro y de apoyo TDC para ti, mi amor.',
        theme_color: '#A16AE8', // color de tema
        background_color: '#FFF0F5', // color de fondo
        display: 'standalone',
        scope: '/',
        start_url: '/',
        orientation: 'portrait-primary',
        icons: [
          {
            src: 'icons/icon-192x192.png', // Ruta relativa a la carpeta 'public'
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: 'icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
    })
  ],
})