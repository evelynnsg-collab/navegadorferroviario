import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

const REPO_NAME = '/navegadorferroviario/'

export default defineConfig({
  base: REPO_NAME,
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Navegador Ferroviário SP',
        short_name: 'Navegador Ferroviário',
        theme_color: '#080C18',
        background_color: '#080C18',
        display: 'standalone',
        start_url: REPO_NAME,
        scope: REPO_NAME,
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png}'],
        skipWaiting: true,
        clientsClaim: true
      }
    })
  ]
})
