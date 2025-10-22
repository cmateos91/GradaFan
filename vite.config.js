import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  // Directorio raíz para el servidor de desarrollo
  root: 'src',

  // Directorio público con archivos estáticos
  publicDir: resolve(__dirname, 'public'),

  // Configuración del servidor de desarrollo
  server: {
    port: 3000,
    open: true,
    cors: true,
    // Proxy para evitar errores CORS con Football API
    proxy: {
      '/api': {
        target: 'https://api.football-data.org/v4',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        configure: (proxy, options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Sending Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
          });
        },
      }
    }
  },

  // Configuración de build
  build: {
    // Directorio de salida (desde la raíz del proyecto)
    outDir: resolve(__dirname, 'dist'),

    // Limpiar el directorio de salida antes de build
    emptyOutDir: true,

    // Configuración de Rollup para múltiples páginas HTML
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/pages/index.html'),
        clasificacion: resolve(__dirname, 'src/pages/clasificacion.html'),
        'en-vivo': resolve(__dirname, 'src/pages/en-vivo.html'),
        debate: resolve(__dirname, 'src/pages/debate.html')
      },
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      }
    },

    // Configuración de assets
    assetsDir: 'assets',

    // Source maps para debugging
    sourcemap: true
  },

  // Alias para imports más limpios (opcional, para uso futuro)
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@assets': resolve(__dirname, 'src/assets'),
      '@components': resolve(__dirname, 'src/components'),
      '@js': resolve(__dirname, 'src/assets/js')
    }
  }
});
