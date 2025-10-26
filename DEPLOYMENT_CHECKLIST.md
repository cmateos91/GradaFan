# ✅ Checklist de Deployment - LaLiga Social en Railway

## 🎯 Estado Actual del Proyecto

### ✅ Configuración Completada

- [x] **astro.config.mjs** - Host configurado a `0.0.0.0`
- [x] **package.json** - Script `start` añadido
- [x] **railway.json** - Configuración de build y deploy
- [x] **.railwayignore** - Archivos excluidos
- [x] **Build local exitoso** - Proyecto compila sin errores
- [x] **.gitignore** - Variables de entorno protegidas

### ✅ Dependencias Verificadas

```json
{
  "@astrojs/node": "^9.5.0",        // ✅ Adaptador SSR
  "@supabase/supabase-js": "^2.76.1", // ✅ Database
  "astro": "^5.14.8"                  // ✅ Framework
}
```

## 📝 Pasos para Deployment

### 1. Preparar Repositorio Git

```bash
# Verificar estado
git status

# Añadir archivos de configuración
git add astro.config.mjs package.json railway.json .railwayignore RAILWAY_DEPLOY.md

# Commit
git commit -m "feat: configurar proyecto para Railway deployment"

# Push a GitHub
git push origin master
```

### 2. Deployment en Railway

#### Opción Recomendada: GitHub Integration

1. Ve a https://railway.app/dashboard
2. Click "New Project"
3. Selecciona "Deploy from GitHub repo"
4. Busca `LaLiga-Social`
5. Railway detectará automáticamente la configuración

#### Variables de Entorno a Configurar

En Railway Dashboard → Tu Proyecto → Variables, añade:

```env
PUBLIC_SUPABASE_URL=https://qvcrkqndunvirwmlalso.supabase.co
PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2Y3JrcW5kdW52aXJ3bWxhbHNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEyMzUzNjYsImV4cCI6MjA3NjgxMTM2Nn0.clUegEQEAHZuZFEb1IWNzBIB5KvzhLKUWT8slt18WkI
FOOTBALL_API_KEY=bc92b948c6a34800be3be7be9eedb93c
```

⚠️ **IMPORTANTE**: No copies las credenciales tal cual, usa las tuyas del archivo `.env`

### 3. Post-Deployment

1. **Generar Dominio**
   - Settings → Networking → "Generate Domain"
   - Tu app estará en: `https://laliga-social-production.up.railway.app` (ejemplo)

2. **Verificar Logs**
   - Deployments → View Logs
   - Busca: "Server listening on http://0.0.0.0:XXXX"

3. **Probar la App**
   - Visita tu dominio
   - Verifica: Login, Chat, Páginas de equipos, Widgets

## 📊 Plan Hobby - Recursos

**Tu plan incluye:**
- $5 USD mensuales en créditos
- 512 MB RAM por servicio
- 1 GB Disco
- SSL automático
- Dominios personalizados

**Consumo estimado de LaLiga Social:**
- ~$3-4 USD/mes (dentro del plan ✅)
- ~200-300 MB RAM en uso normal
- ~400 MB disco (node_modules + build)

## 🔍 Verificaciones Post-Deploy

### 1. Health Check
```bash
# Desde terminal local
curl https://tu-dominio.up.railway.app

# Deberías ver HTML de tu página de inicio
```

### 2. Test de Funcionalidades
- [ ] Página de inicio carga correctamente
- [ ] TeamsBar muestra 20 equipos
- [ ] Páginas de equipos funcionan (/equipo/sevilla)
- [ ] Chat funciona (requiere login)
- [ ] Imágenes de escudos se cargan
- [ ] Imágenes de estadios se cargan
- [ ] API de partidos funciona

### 3. Monitoreo
- Dashboard muestra métricas en tiempo real
- Configura alertas si superas 80% de recursos

## 🐛 Troubleshooting

### Problema: Error 502
**Solución**: Verifica que `host: '0.0.0.0'` esté en astro.config.mjs (✅ ya configurado)

### Problema: Build falla
**Revisa**:
- Logs de Railway para error específico
- Que `npm run build` funcione localmente (✅ verificado)
- Que todas las dependencias estén en `dependencies`

### Problema: Variables de entorno no funcionan
**Revisa**:
- Que estén configuradas en Railway Dashboard
- Prefijo `PUBLIC_` para variables del cliente
- Reinicia el deployment después de añadir variables

### Problema: Imágenes no cargan
**Revisa**:
- Que estén en `src/assets/img/` (✅ correcto)
- Que Sharp esté instalado (✅ incluido en dependencies)
- Logs de build para errores de optimización

## 🔄 Actualizaciones Futuras

Para actualizar tu app en producción:

```bash
# 1. Haz cambios en tu código
# 2. Commit y push
git add .
git commit -m "feat: nueva funcionalidad"
git push origin master

# 3. Railway redesplegará automáticamente
# 4. Verifica logs en Dashboard
```

## 📱 Dominio Personalizado (Opcional)

Si tienes un dominio propio:

1. Railway Dashboard → Settings → Networking
2. Click "Custom Domain"
3. Añade tu dominio (ej: laligasocial.com)
4. Configura DNS según instrucciones de Railway
5. SSL se configura automáticamente

## 🎉 ¡Listo para Deploy!

Tu proyecto **LaLiga Social** está completamente preparado para desplegarse en Railway.

**Próximo paso**: Sigue la guía detallada en [RAILWAY_DEPLOY.md](RAILWAY_DEPLOY.md)

---

**Última verificación**: 2025-10-26
**Build status**: ✅ Exitoso
**Configuración**: ✅ Completa
