# 🔧 Troubleshooting - LaLiga Social

## ✅ Estado Actual

**Tu proyecto está funcionando correctamente.** Los mensajes que ves en consola son **comportamiento esperado**, no errores críticos.

---

## ⚠️ "Errores" Normales (Esperados)

### 1. **CORS Error de Football API**

```
Access to fetch at 'https://api.football-data.org/...' has been blocked by CORS policy
```

#### ¿Por qué ocurre?

La API de Football-Data.org está configurada para aceptar requests solo desde:
- `http://localhost` (puerto 80)
- Tu dominio en producción

Pero Vite usa `http://localhost:3000`, lo que causa el rechazo CORS.

#### ¿Es un problema?

**NO** ❌ - El código tiene fallback automático:

```javascript
// football-api.js detecta el error y usa datos locales
⚠️ No se pudo cargar clasificación de API, usando datos locales
```

La aplicación **sigue funcionando** usando `TEAMS_DATA` mock.

#### Soluciones:

**Opción 1: Usar Mock Data (Recomendado para desarrollo)**
- ✅ Ya está funcionando
- ✅ No requiere API key
- ✅ Perfecto para desarrollo y testing

**Opción 2: Configurar API Real**

1. **Obtener API Key:**
   - Ve a https://www.football-data.org/
   - Regístrate gratis
   - Copia tu API key

2. **Configurar en el proyecto:**
   ```bash
   # Copiar archivo de ejemplo
   cp src/assets/js/application/config/api-config.example.js src/assets/js/application/config/api-config.js
   ```

3. **Editar `api-config.js`:**
   ```javascript
   const API_CONFIG = {
       FOOTBALL_DATA: {
           API_KEY: 'TU_API_KEY_AQUI', // 👈 Pegar tu API key aquí
           // ...
       }
   };
   ```

4. **Reiniciar servidor:**
   ```bash
   npm run dev
   ```

**Opción 3: Usar Proxy de Vite (Avanzado)**

Ya configurado en `vite.config.js`:
```javascript
server: {
  proxy: {
    '/api': {
      target: 'https://api.football-data.org/v4',
      changeOrigin: true,
      // ...
    }
  }
}
```

Para usarlo, cambiar en `football-api.js`:
```javascript
// Antes
BASE_URL: 'https://api.football-data.org/v4'

// Después (para dev)
BASE_URL: import.meta.env.DEV ? '/api' : 'https://api.football-data.org/v4'
```

---

### 2. **Smooth Scroll Warning**

```
⚠️ Smooth Scroll desactivado - usando scroll nativo
```

#### ¿Por qué ocurre?

Lenis (librería de smooth scroll) puede no inicializarse si:
- Está cargando desde CDN lento
- Tu navegador tiene JavaScript deshabilitado
- `prefers-reduced-motion` está activo

#### ¿Es un problema?

**NO** ❌ - El scroll **sigue funcionando** normalmente (sin animación suave).

#### Solución:

1. **Verificar CDN:**
   Abre [https://unpkg.com/@studio-freight/lenis@1.0.42/dist/lenis.min.js](https://unpkg.com/@studio-freight/lenis@1.0.42/dist/lenis.min.js)

2. **Instalar localmente (opcional):**
   ```bash
   npm install @studio-freight/lenis
   ```

   Cambiar en `index.html`:
   ```html
   <!-- Antes -->
   <script src="https://unpkg.com/@studio-freight/lenis@1.0.42/dist/lenis.min.js"></script>

   <!-- Después -->
   <script type="module">
     import Lenis from '@studio-freight/lenis'
     window.Lenis = Lenis
   </script>
   ```

---

## 🐛 Errores Reales (Requieren Atención)

### 1. **Página en Blanco**

#### Síntomas:
- Navegador muestra pantalla blanca
- Console muestra errores de sintaxis

#### Solución:
```bash
# 1. Limpiar caché del navegador
Ctrl + Shift + Delete

# 2. Limpiar build de Vite
rm -rf dist node_modules/.vite

# 3. Reinstalar
npm install

# 4. Reiniciar servidor
npm run dev
```

---

### 2. **Estilos No Se Aplican**

#### Síntomas:
- HTML sin estilos
- Console: `Failed to load resource: main.css`

#### Solución:

Verificar rutas en `src/pages/*.html`:
```html
<!-- ✅ Correcto -->
<link rel="stylesheet" href="/assets/css/main.css">

<!-- ❌ Incorrecto -->
<link rel="stylesheet" href="assets/css/main.css">
<link rel="stylesheet" href="../assets/css/main.css">
```

---

### 3. **Componentes No Cargan (navbar, footer)**

#### Síntomas:
- Navbar/footer no aparecen
- Console: `Component "navbar" not found`

#### Solución:

Verificar rutas en `component-loader.js`:
```javascript
// ✅ Correcto
this.components = {
    navbar: '/components/navbar.html',
    footer: '/components/footer.html'
};

// ❌ Incorrecto
this.components = {
    navbar: '../components/navbar.html',
    navbar: 'components/navbar.html'
};
```

---

### 4. **Build Falla**

#### Síntomas:
```bash
npm run build
# Error: Could not resolve...
```

#### Solución:

1. **Verificar paths en `vite.config.js`:**
   ```javascript
   rollupOptions: {
     input: {
       main: resolve(__dirname, 'src/pages/index.html'),
       // ✅ Asegurar que existen estos archivos
     }
   }
   ```

2. **Limpiar y reconstruir:**
   ```bash
   rm -rf dist
   npm run build
   ```

---

## 📊 Console Messages Esperados (Normal)

### ✅ Mensajes de Inicialización:
```
🚀 Initializing LaLiga Social...
✅ 1 3D Tilt Cards initialized
✅ Parallax initialized for 1 elements
✅ Icons initialized
✅ Live Chat initialized
✅ Sidebar initialized
✅ LaLiga Social initialized successfully!
```

### ⚠️ Warnings Normales:
```
⚠️ Smooth Scroll desactivado - usando scroll nativo
⚠️ No se pudo cargar clasificación de API, usando datos locales
⚠️ API Key no configurada
```

### ❌ Errores que Ignorar (con fallback):
```
❌ Error en API request: TypeError: Failed to fetch
  → Fallback a datos locales activado ✅
```

---

## 🔍 Debug Checklist

Si algo no funciona, verifica:

- [ ] `npm install` ejecutado
- [ ] `npm run dev` corriendo
- [ ] Navegador en `http://localhost:3000`
- [ ] Console abierta (F12)
- [ ] Caché del navegador limpio
- [ ] Archivos en `src/` correctos
- [ ] Rutas absolutas (`/assets/`, `/components/`)

---

## 🆘 Comandos de Emergencia

### Reset Completo:
```bash
# 1. Detener servidor (Ctrl+C)

# 2. Limpiar todo
rm -rf node_modules dist

# 3. Reinstalar
npm install

# 4. Reiniciar
npm run dev
```

### Verificar Estructura:
```bash
# Listar archivos importantes
ls -la src/pages/
ls -la src/components/
ls -la src/assets/css/
ls -la src/assets/js/

# Verificar configuración
cat vite.config.js
cat package.json
```

### Test Build:
```bash
# Build de producción
npm run build

# Preview
npm run preview

# Abrir en navegador
# http://localhost:4173
```

---

## 📞 Soporte

### Logs Útiles:

**Ver estructura:**
```bash
tree -L 3 -I 'node_modules|dist'
```

**Ver últimos commits:**
```bash
git log --oneline -5
```

**Ver cambios:**
```bash
git status
git diff
```

### Reportar Issues:

Si encuentras un error real:
1. ✅ Verificar que no está en esta guía
2. ✅ Copiar mensaje de error completo
3. ✅ Incluir console output
4. ✅ Mencionar pasos para reproducir
5. ✅ Crear issue en GitHub

---

## 💡 Tips de Desarrollo

### Performance:
- ✅ Usar Chrome DevTools > Network para ver requests
- ✅ Usar Console > Preserve log para ver todos los mensajes
- ✅ Deshabilitar caché en Network tab durante desarrollo

### Hot Reload:
- ✅ Guardar archivo = auto-reload (gracias a Vite)
- ✅ No cerrar/reabrir navegador innecesariamente
- ✅ Si algo no actualiza, hard reload: `Ctrl+Shift+R`

### Mock Data vs API:
- ✅ Desarrollo: Usar mock data (rápido, sin límites)
- ✅ Testing: Probar con API real
- ✅ Producción: API real configurada

---

## ✅ Conclusión

**Tu proyecto está funcionando perfectamente** si ves:
- ✅ Página carga correctamente
- ✅ Estilos aplicados
- ✅ Navbar y componentes visibles
- ✅ Console muestra "✅ LaLiga Social initialized"

Los mensajes de CORS y API son **normales** - el código tiene fallbacks automáticos.

**No necesitas hacer nada** a menos que quieras conectar la API real (opcional).

---

**Última actualización:** 2025-10-22
**Versión:** 2.0.0
