# 🚀 Guía de Setup de Supabase para GradaFan

**Fecha:** 23 de Octubre de 2025
**Proyecto:** GradaFan (LaLiga Social)
**Base de Datos:** Supabase PostgreSQL

---

## ✅ Progreso Actual

- [x] Proyecto GradaFan creado en Supabase
- [x] Credenciales obtenidas
- [x] Cliente de Supabase instalado (`@supabase/supabase-js`)
- [x] Archivo `.env` configurado
- [x] Cliente de Supabase configurado (`src/lib/supabase.js`)
- [x] Schema SQL creado (`supabase-schema.sql`)
- [ ] **SIGUIENTE:** Ejecutar schema SQL en Supabase

---

## 📋 Paso 1: Ejecutar Schema SQL

### Ir al SQL Editor de Supabase

1. Abre tu proyecto GradaFan en Supabase: https://supabase.com/dashboard/project/qvcrkqndunvirwmlalso
2. En el menú lateral izquierdo, haz clic en **SQL Editor**
3. Haz clic en **"+ New query"**

### Ejecutar el Schema

1. Abre el archivo `supabase-schema.sql` de este proyecto
2. Copia TODO el contenido
3. Pégalo en el SQL Editor de Supabase
4. Haz clic en **"Run"** (esquina inferior derecha)

### Verificar que se creó correctamente

Deberías ver un mensaje de éxito. Luego verifica:

1. Ve a **Table Editor** en el menú lateral
2. Deberías ver 5 tablas creadas:
   - ✅ profiles
   - ✅ debates
   - ✅ comments
   - ✅ chat_messages
   - ✅ likes

---

## 📋 Paso 2: Probar Conexión

### Opción A: Desde la API

1. Asegúrate de que el servidor de Astro esté corriendo:
   ```bash
   npm run dev
   ```

2. Abre en tu navegador:
   ```
   http://localhost:4321/api/test-supabase
   ```

3. Deberías ver una respuesta JSON como:
   ```json
   {
     "success": true,
     "message": "✅ Supabase connection successful!",
     "supabaseUrl": "https://qvcrkqndunvirwmlalso.supabase.co",
     "connectionTest": "Table not found (normal)",
     "details": {
       "hasUrl": true,
       "hasKey": true,
       "keyPrefix": "eyJhbGciOiJIUzI1NiIsIn..."
     }
   }
   ```

### Opción B: Desde Supabase Dashboard

1. Ve a **Table Editor**
2. Haz clic en la tabla **profiles**
3. Si la tabla está vacía, está bien (aún no hay usuarios registrados)

---

## 📋 Paso 3: Crear Usuario de Prueba

Tenemos dos opciones:

### Opción A: Desde Supabase Dashboard (Más Rápido)

1. Ve a **Authentication** → **Users**
2. Haz clic en **"Add user"** → **"Create new user"**
3. Rellena:
   - Email: `admin@gradafan.com`
   - Password: `admin123456` (cámbialo después)
   - Auto Confirm User: ✅ Activado
4. Haz clic en **"Create user"**

5. **IMPORTANTE:** Verifica que se creó el perfil automáticamente
   - Ve a **Table Editor** → **profiles**
   - Deberías ver un nuevo perfil con:
     - id (UUID del usuario)
     - username (generado automáticamente como "user_XXXXX")
     - avatar_url (con DiceBear)

### Opción B: Desde la App (Más Adelante)

Cuando implementemos el registro en la app, los usuarios se crearán directamente desde ahí.

---

## 📋 Paso 4: Insertar Debate de Ejemplo

### Desde SQL Editor

1. Ve a **SQL Editor** → **"+ New query"**
2. Copia y pega este código:

```sql
-- Obtener el ID del primer usuario (el que creaste)
-- Reemplaza 'AQUI_TU_USER_ID' con el UUID del usuario que acabas de crear

INSERT INTO public.debates (
    title,
    description,
    author_id,
    likes,
    featured,
    category
)
VALUES (
    '¿Quién ganará LaLiga esta temporada?',
    'Debate sobre el posible campeón de LaLiga 2024/2025. ¿Real Madrid, Barcelona, o algún otro equipo?',
    (SELECT id FROM public.profiles LIMIT 1),  -- Toma el primer usuario
    15,
    true,
    'debates'
);
```

3. Ejecuta el query
4. Verifica en **Table Editor** → **debates** que se creó el debate

---

## 📋 Paso 5: Verificar Row Level Security (RLS)

Las políticas de RLS están configuradas para:

### 🔓 Lectura Pública (No requiere autenticación)
- Ver perfiles de usuarios
- Ver debates
- Ver comentarios
- Ver mensajes de chat
- Ver likes

### 🔒 Escritura Protegida (Requiere autenticación)
- Crear debates
- Crear comentarios
- Enviar mensajes de chat
- Dar likes
- Solo puedes editar/eliminar TU PROPIO contenido

---

## 📋 Paso 6: Próximos Pasos de Implementación

### 1. Crear Páginas de Autenticación

Archivos a crear:
- `src/pages/registro.astro` - Página de registro
- `src/pages/login.astro` - Página de login
- `src/pages/perfil.astro` - Página de perfil de usuario

### 2. Migrar JavaScript a Supabase

Archivos a modificar:
- `public/assets/js/application/components/debates/debate-feed.js`
  - Cambiar de `window.DebatesData` a `supabase.from('debates')`
- `public/assets/js/application/components/debates/debate-detail.js`
  - Cargar debates desde Supabase
- `public/assets/js/application/components/common/chat/chat.js`
  - Conectar con Realtime de Supabase

### 3. Implementar Sistema de Likes

Crear funciones para:
- Dar like a un debate
- Quitar like
- Contar likes en tiempo real

### 4. Implementar Chat en Tiempo Real

Usar Supabase Realtime:
```javascript
const channel = supabase
  .channel('chat-room')
  .on('postgres_changes',
    { event: 'INSERT', schema: 'public', table: 'chat_messages' },
    (payload) => {
      // Agregar mensaje al chat UI
    }
  )
  .subscribe()
```

---

## 🔧 Comandos Útiles

### Desarrollo Local
```bash
# Iniciar servidor de desarrollo
npm run dev

# Probar conexión Supabase
curl http://localhost:4321/api/test-supabase
```

### Supabase CLI (Opcional)
```bash
# Instalar Supabase CLI
npm install -g supabase

# Login
supabase login

# Ver estado del proyecto
supabase status
```

---

## 📊 Estructura de la Base de Datos

```
auth.users (Supabase Auth)
    ↓
profiles (Datos adicionales del usuario)
    ↓
debates ← comments ← likes
    ↓
chat_messages ← likes
```

---

## 🔐 Seguridad

### Variables de Entorno

El archivo `.env` contiene:
```env
PUBLIC_SUPABASE_URL=https://qvcrkqndunvirwmlalso.supabase.co
PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**IMPORTANTE:**
- ✅ `.env` está en `.gitignore`
- ✅ Nunca subas este archivo a GitHub
- ✅ La `anon key` es segura para el cliente (protegida por RLS)
- ❌ NUNCA expongas la `service_role key`

### Row Level Security (RLS)

Todas las tablas tienen RLS habilitado. Esto significa:
- Los usuarios solo pueden modificar su propio contenido
- Todos pueden ver todo (lectura pública)
- Las escrituras requieren autenticación

---

## 🐛 Troubleshooting

### Error: "Invalid API key"
- Verifica que `.env` tenga las credenciales correctas
- Reinicia el servidor (`npm run dev`)

### Error: "Table does not exist"
- Ejecuta el schema SQL en Supabase
- Verifica en Table Editor que las tablas existan

### Error: "Row level security policy violation"
- Verifica que el usuario esté autenticado
- Revisa las políticas RLS en Supabase Dashboard

### No se crea el perfil automáticamente
- Verifica que el trigger `on_auth_user_created` exista
- Revisa en SQL Editor:
  ```sql
  SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
  ```

---

## ✅ Checklist de Setup

- [ ] Schema SQL ejecutado sin errores
- [ ] 5 tablas visibles en Table Editor
- [ ] Usuario de prueba creado
- [ ] Perfil del usuario creado automáticamente
- [ ] Debate de ejemplo insertado
- [ ] Endpoint `/api/test-supabase` responde OK
- [ ] Variables de entorno configuradas
- [ ] `.env` en `.gitignore`

---

## 📚 Recursos

- [Supabase Docs](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Realtime](https://supabase.com/docs/guides/realtime)
- [Dashboard GradaFan](https://supabase.com/dashboard/project/qvcrkqndunvirwmlalso)

---

**Setup completado por:** Claude Code
**Próximo paso:** Ejecutar schema SQL en Supabase SQL Editor
