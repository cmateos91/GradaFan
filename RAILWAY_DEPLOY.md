# 🚂 Guía de Despliegue en Railway - LaLiga Social

## 📋 Pre-requisitos

- ✅ Cuenta en [Railway](https://railway.app) con plan Hobby
- ✅ Repositorio Git (GitHub, GitLab o Bitbucket)
- ✅ Proyecto configurado para SSR con Node adapter

## 🔧 Configuración Realizada

### 1. Archivos Actualizados

- ✅ **astro.config.mjs**: Host configurado a `0.0.0.0` para Railway
- ✅ **package.json**: Script `start` añadido para producción
- ✅ **railway.json**: Configuración de build y deploy
- ✅ **.railwayignore**: Archivos excluidos del deploy

### 2. Adaptador Node SSR

Ya instalado: `@astrojs/node` en modo `standalone`

## 🚀 Pasos para Desplegar

### Opción A: Deploy desde GitHub (Recomendado)

1. **Subir código a GitHub**
   ```bash
   git add .
   git commit -m "feat: preparar proyecto para Railway deployment"
   git push origin master
   ```

2. **Conectar con Railway**
   - Ve a [Railway Dashboard](https://railway.app/dashboard)
   - Click en "New Project"
   - Selecciona "Deploy from GitHub repo"
   - Busca y selecciona tu repositorio `LaLiga-Social`
   - Railway detectará automáticamente que es un proyecto Node.js/Astro

3. **Configurar Variables de Entorno**

   En Railway Dashboard → Tu Proyecto → Variables:

   ```env
   # Supabase (OBLIGATORIO)
   PUBLIC_SUPABASE_URL=https://qvcrkqndunvirwmlalso.supabase.co
   PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

   # Football API (OBLIGATORIO)
   FOOTBALL_API_KEY=bc92b948c6a34800be3be7be9eedb93c

   # Node Environment (Automático pero puedes forzarlo)
   NODE_ENV=production
   ```

4. **Generar Dominio Público**
   - Settings → Networking
   - Click en "Generate Domain"
   - Tu app estará disponible en: `https://tu-proyecto.up.railway.app`

5. **Esperar el Deploy**
   - Railway hará el build automáticamente
   - Verás los logs en tiempo real
   - Deploy completo en ~2-5 minutos

### Opción B: Deploy con Railway CLI

1. **Instalar Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login**
   ```bash
   railway login
   ```

3. **Inicializar Proyecto**
   ```bash
   railway init
   ```

4. **Deploy**
   ```bash
   railway up
   ```

5. **Configurar Variables de Entorno**
   ```bash
   railway variables set PUBLIC_SUPABASE_URL=https://qvcrkqndunvirwmlalso.supabase.co
   railway variables set PUBLIC_SUPABASE_ANON_KEY=tu_key
   railway variables set FOOTBALL_API_KEY=tu_key
   ```

## 🎯 Plan Hobby - Beneficios

Con tu plan **Hobby de Railway** ($5/mes) obtienes:

- ✅ **$5 de créditos mensuales** (suficiente para proyectos pequeños-medianos)
- ✅ **512 MB RAM** por servicio
- ✅ **1 GB Disk** por servicio
- ✅ **Dominios personalizados** ilimitados
- ✅ **SSL automático** con Let's Encrypt
- ✅ **Build time ilimitado**
- ✅ **CI/CD automático** desde GitHub
- ✅ **Sin tarjeta de crédito requerida** para el plan Hobby

**Costos estimados para LaLiga Social:**
- Aplicación Astro SSR: ~$3-4/mes
- Total: Dentro del plan Hobby ✅

## 📊 Monitoreo Post-Deploy

1. **Ver Logs**
   ```bash
   railway logs
   ```
   O en Dashboard → Deployments → View Logs

2. **Verificar Salud**
   - Dashboard muestra CPU, RAM, Disco en tiempo real
   - Configura alertas si te acercas a límites

3. **Rollback si es necesario**
   - Dashboard → Deployments → Click en deploy anterior → "Redeploy"

## 🔍 Troubleshooting

### Error 502 Bad Gateway
- ✅ **Solución**: Verifica que `host: '0.0.0.0'` esté en `astro.config.mjs`
- Verifica que el puerto sea dinámico: Railway usa `$PORT` automáticamente

### Build Falla
- Verifica que `npm run build` funcione localmente
- Revisa logs de Railway para errores específicos
- Asegúrate de que todas las dependencias estén en `dependencies`, no en `devDependencies`

### Variables de Entorno no Funcionan
- Variables con prefijo `PUBLIC_` son accesibles en el cliente
- Variables sin prefijo solo en servidor
- Verifica que estén configuradas en Railway Dashboard

### Imágenes no se ven
- Astro optimiza imágenes en build time
- Verifica que Sharp esté instalado (ya incluido)
- Usa rutas relativas, no absolutas

## 🔄 Actualizaciones Futuras

Para actualizar tu app después del deploy inicial:

```bash
git add .
git commit -m "feat: nueva funcionalidad"
git push origin master
```

Railway detectará el push y redesplegará automáticamente 🎉

## 📚 Recursos Adicionales

- [Railway Docs - Astro](https://docs.railway.com/guides/astro)
- [Astro Docs - Railway Deploy](https://docs.astro.build/en/guides/deploy/railway/)
- [Railway Community](https://help.railway.app/)

## ✅ Checklist Pre-Deploy

- [ ] Código subido a GitHub
- [ ] Variables de entorno preparadas (Supabase + Football API)
- [ ] Build local exitoso (`npm run build`)
- [ ] .env en .gitignore (no subir credenciales)
- [ ] Cuenta Railway con plan Hobby activado

---

**¡Tu proyecto está listo para desplegarse en Railway!** 🚀

Sigue los pasos de "Opción A: Deploy desde GitHub" para el método más sencillo.
