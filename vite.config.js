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
      includeAssets: ['icon-192.png', 'icon-512.png'],
      manifest: {
        name: 'Navegador Ferroviário SP',
        short_name: 'Navegador Ferroviário',
        description: 'Guia de rotas do metrô e CPTM de São Paulo',
        theme_color: '#080C18',
        background_color: '#080C18',
        display: 'standalone',
        orientation: 'portrait',
        start_url: REPO_NAME,
        scope: REPO_NAME,
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        skipWaiting: true,
        clientsClaim: true
      }
    })
  ]
})
