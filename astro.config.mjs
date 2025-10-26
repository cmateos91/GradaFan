// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  // Enable SSR for dynamic routes
  output: 'server',
  adapter: node({
    mode: 'standalone'
  }),

  // Mantener estructura src/ existente
  srcDir: './src',
  publicDir: './public',

  // Configuración del servidor
  // host: '0.0.0.0' es crítico para Railway (acepta tráfico externo)
  server: {
    port: 4321,
    host: '0.0.0.0'
  },

  // Build configuration
  build: {
    assets: 'assets'
  },

  // Desactivar warnings de optimización de imágenes para contenido dinámico
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp'
    }
  },

  // Mantener compatibilidad con archivos existentes
  vite: {
    build: {
      rollupOptions: {
        output: {
          assetFileNames: 'assets/[name]-[hash][extname]',
          chunkFileNames: 'assets/[name]-[hash].js',
          entryFileNames: 'assets/[name]-[hash].js'
        }
      }
    }
  }
});
