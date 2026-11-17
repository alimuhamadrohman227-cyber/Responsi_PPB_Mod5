import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  envDir: '..',
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['chili.png'],
      manifest: {
        name: 'Sambal Catalog',
        short_name: 'Sambal Catalog',
        description: 'Katalog Varian Sambal & Manajemen Stok PWA Offline-First',
        theme_color: '#dc2626',
        background_color: '#450a0a',
        display: 'standalone',
        lang: 'id',
        icons: [
          {
            src: '/chili.png',
            sizes: '360x360',
            type: 'image/png'
          }
        ]
      }
    })
  ]
})