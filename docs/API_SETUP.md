# 🔑 Configuración de la API de Football-Data.org

## 📋 Paso 1: Obtener tu API Key

1. Ve a **https://www.football-data.org/**
2. Haz click en **"Register"** o **"Sign Up"**
3. Completa el formulario de registro con tu email
4. Confirma tu cuenta desde el email que recibirás
5. Inicia sesión y ve a tu **Dashboard**
6. Copia tu **API Token** (aparecerá algo como: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`)

---

## ⚙️ Paso 2: Configurar la API Key en el Proyecto

### Opción A: Usando el archivo de configuración

1. Navega a: `assets/js/config/`
2. Abre el archivo **`api-config.js`**
3. Encuentra esta línea:
   ```javascript
   API_KEY: 'TU_API_KEY_AQUI',
   ```
4. Reemplaza `'TU_API_KEY_AQUI'` con tu API key real:
   ```javascript
   API_KEY: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6',
   ```
5. Guarda el archivo

### Opción B: Si no existe api-config.js

1. Copia el archivo `api-config.example.js`
2. Renómbralo a `api-config.js`
3. Edita y añade tu API key como en la Opción A

---

## ✅ Paso 3: Verificar que Funciona

1. Abre el proyecto en tu navegador
2. Ve a la página **Clasificación** (`clasificacion.html`)
3. Abre la **Consola del navegador** (F12)
4. Deberías ver:
   ```
   📰 Hero Rotator initialized with 3 news items
   📊 Initializing Standings Component
   🔄 Fetching: https://api.football-data.org/v4/competitions/PD/standings
   ✅ Datos obtenidos de API: /competitions/PD/standings
   ✅ Standings loaded successfully
   ```

---

## 🚨 Problemas Comunes

### ❌ Error: "API key no configurada"

**Solución:** Asegúrate de haber reemplazado `'TU_API_KEY_AQUI'` con tu API key real.

### ❌ Error: "HTTP Error: 401"

**Causa:** API key incorrecta o inválida

**Solución:**
- Verifica que copiaste la API key completa
- Asegúrate de que no haya espacios antes o después
- Confirma tu cuenta de email si es nueva

### ❌ Error: "HTTP Error: 429" o "Rate limit excedido"

**Causa:** Has superado el límite de 10 requests por minuto

**Solución:**
- Espera 1 minuto y recarga la página
- El sistema tiene cache de 5 minutos para evitar esto

### ❌ Error: "Failed to fetch" o "CORS error"

**Causa:** La API de football-data.org requiere que uses `http://localhost` sin especificar puerto

**Solución:** Usa un servidor local en puerto 80:

**Con Python (RECOMENDADO):**
```bash
# Abre PowerShell COMO ADMINISTRADOR
cd C:\Users\TU_USUARIO\Documents\Proyectos\LaLiga-Social
python -m http.server 80

# Visita http://localhost/clasificacion.html (sin puerto)
```

**IMPORTANTE:**
- ✅ Funciona: `http://localhost` (puerto 80, sin especificar)
- ❌ NO funciona: `http://localhost:8000` (puerto 8000)
- ❌ NO funciona: `http://127.0.0.1:8000` (IP local con puerto)

**Alternativa (sin permisos admin):**
Si no puedes usar puerto 80, necesitarás configurar un proxy CORS o contactar con football-data.org para que agreguen tu origen a su lista de CORS permitidos

---

## 📊 Datos Disponibles

Con tu API key configurada, tendrás acceso a:

✅ **Clasificación de LaLiga** (actualizada cada 5 minutos)
- Posiciones
- Puntos, victorias, empates, derrotas
- Goles a favor y en contra
- Diferencia de goles

✅ **Partidos** (próximamente)
- Partidos en vivo
- Resultados recientes
- Próximos partidos

✅ **Goleadores** (próximamente)
- Top goleadores de LaLiga
- Estadísticas de jugadores

---

## 🔒 Seguridad

### ⚠️ IMPORTANTE: NO SUBAS TU API KEY A GITHUB

El archivo `api-config.js` está incluido en `.gitignore` para proteger tu API key.

**Si accidentalmente subiste tu API key:**

1. Ve a https://www.football-data.org/
2. Regenera tu API token
3. Actualiza `api-config.js` con el nuevo token
4. Elimina el archivo del historial de Git:
   ```bash
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch assets/js/config/api-config.js" \
     --prune-empty --tag-name-filter cat -- --all
   ```

---

## 📝 Límites del Plan Gratuito

- ✅ **10 requests por minuto**
- ✅ **Acceso a LaLiga para siempre**
- ✅ **Sin tarjeta de crédito requerida**
- ✅ **Datos actualizados cada pocos minutos**

El sistema incluye:
- 🔄 Cache de 5 minutos (reduce requests)
- ⚠️ Rate limiting automático
- 📊 Mensajes de error informativos

---

## 🆘 Soporte

Si tienes problemas:

1. **Verifica la consola del navegador** (F12)
2. **Lee los mensajes de error** - son descriptivos
3. **Revisa este documento** - cubre los problemas comunes
4. **Consulta la documentación oficial:** https://www.football-data.org/documentation/api

---

## 🎉 ¡Listo!

Una vez configurada tu API key, podrás disfrutar de:

- 📊 Clasificación en tiempo real de LaLiga
- 🔄 Actualización automática cada 5 minutos
- 🎨 Diseño responsive y moderno
- 🏆 Indicadores visuales de posiciones (Champions, Europa, Descenso)

**¡Disfruta de LaLiga Social!** ⚽
