# 🔄 Guía de Migración: Chat con BD → Chat Efímero

## ⚠️ IMPORTANTE: Lee antes de ejecutar

Esta migración **eliminará permanentemente** la tabla `chat_messages` y todos los mensajes guardados. Es un cambio **irreversible**.

## 📋 Checklist Pre-Migración

- [ ] ✅ He leído y entendido que los mensajes no se guardarán en BD
- [ ] ✅ He respaldado la BD actual (si necesito los mensajes antiguos)
- [ ] ✅ He informado a los usuarios del cambio
- [ ] ✅ Estoy listo para aplicar el nuevo schema

## 🚀 Pasos de Migración

### Paso 1: Respaldar BD actual (Opcional)

Si quieres conservar los mensajes antiguos para análisis:

```sql
-- Exportar mensajes a CSV o JSON
SELECT * FROM public.chat_messages
ORDER BY created_at DESC;
```

Descarga los resultados antes de continuar.

### Paso 2: Aplicar nuevo schema

1. Abre **Supabase Dashboard**
2. Ve a **SQL Editor**
3. Abre el archivo `supabase-schema-v2.sql`
4. Copia todo el contenido
5. Pégalo en el SQL Editor
6. Click en **Run** (Ejecutar)

### Paso 3: Verificar que la tabla fue eliminada

```sql
-- Este query debe devolver 0 resultados
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name = 'chat_messages';
```

### Paso 4: Verificar que las demás tablas funcionan

```sql
-- Verificar tablas existentes
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

Deberías ver:
- ✅ `profiles`
- ✅ `debates`
- ✅ `comments`
- ✅ `likes`
- ❌ `chat_messages` (eliminada)

### Paso 5: Probar el nuevo chat

1. Inicia el servidor: `npm run dev`
2. Abre la aplicación en el navegador
3. Abre el chat
4. Verifica la consola del navegador:
   - Debe mostrar: `✅ Conectado al chat en tiempo real`
5. Envía un mensaje de prueba
6. Abre otra ventana/navegador en modo incógnito
7. Verifica que el mensaje aparezca en ambas ventanas en tiempo real

## ✅ Verificación Post-Migración

### Frontend

- [ ] Chat se conecta automáticamente al cargar la página
- [ ] Mensajes aparecen en tiempo real sin refrescar
- [ ] El input funciona y envía mensajes
- [ ] Múltiples usuarios ven los mismos mensajes
- [ ] La reconexión automática funciona (prueba desconectando Wi-Fi)

### Backend

- [ ] El endpoint `/api/chat/stream` responde correctamente
- [ ] Los logs muestran conexiones de clientes
- [ ] Los mensajes se broadcastean a todos los clientes
- [ ] La limpieza automática funciona (revisar logs después de 5 min)

### Base de Datos

- [ ] La tabla `chat_messages` ya no existe
- [ ] Las demás tablas funcionan correctamente
- [ ] No hay errores en los logs de Supabase

## 🐛 Troubleshooting

### Error: "Tabla chat_messages no existe"

✅ **Correcto** - La tabla fue eliminada exitosamente. Ignora este error.

### Error: "No se puede conectar al chat"

Verifica:
1. El servidor Astro está corriendo (`npm run dev`)
2. El endpoint `/api/chat/stream.ts` existe
3. No hay errores en la consola del servidor
4. El navegador soporta Server-Sent Events

### Error: "Los mensajes no aparecen en tiempo real"

Verifica:
1. Múltiples pestañas están conectadas al mismo servidor
2. La consola muestra: `✅ Conectado al chat en tiempo real`
3. No hay errores de CORS
4. El navegador permite EventSource

### Los mensajes desaparecen

✅ **Correcto** - Es el comportamiento esperado:
- Solo se mantienen los últimos 50 mensajes
- Mensajes mayores a 5 minutos se eliminan
- Al refrescar la página, solo ves los mensajes actuales en memoria

## 🔙 Rollback (Deshacer Migración)

Si necesitas volver al sistema antiguo:

### 1. Restaurar tabla chat_messages

```sql
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    message TEXT NOT NULL,
    team_id INTEGER,
    likes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Chat messages are viewable by everyone"
    ON public.chat_messages FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can send messages"
    ON public.chat_messages FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE INDEX IF NOT EXISTS idx_chat_created
    ON chat_messages(created_at DESC);
```

### 2. Restaurar likes para chat

```sql
ALTER TABLE public.likes
    ADD COLUMN chat_message_id BIGINT REFERENCES public.chat_messages(id) ON DELETE CASCADE;

-- Actualizar constraint
ALTER TABLE public.likes
    DROP CONSTRAINT IF EXISTS check_like_target;

ALTER TABLE public.likes
    ADD CONSTRAINT check_like_target CHECK (
        (debate_id IS NOT NULL AND comment_id IS NULL AND chat_message_id IS NULL) OR
        (debate_id IS NULL AND comment_id IS NOT NULL AND chat_message_id IS NULL) OR
        (debate_id IS NULL AND comment_id IS NULL AND chat_message_id IS NOT NULL)
    );

ALTER TABLE public.likes
    ADD CONSTRAINT likes_user_id_chat_message_id_key
    UNIQUE(user_id, chat_message_id);
```

### 3. Revertir BaseLayout.astro

```diff
- <script is:inline src="/assets/js/application/components/common/chat/chat-realtime.js"></script>
+ <script is:inline src="/assets/js/application/components/common/chat/chat.js"></script>
```

## 📊 Comparación

| Característica | Chat BD (Antes) | Chat Efímero (Ahora) |
|---|---|---|
| **Almacenamiento** | PostgreSQL | Memoria RAM |
| **Persistencia** | Permanente | Efímera (5 min) |
| **Límite** | Ilimitado | 50 mensajes |
| **Costos** | Crece con el tiempo | $0 |
| **Rendimiento** | Lento con millones | Siempre rápido |
| **Tiempo Real** | Polling | SSE (instantáneo) |
| **Histórico** | ✅ Sí | ❌ No |

## 🎯 Preguntas Frecuentes

### ¿Los mensajes se guardan en algún lado?

❌ **No**. Solo en memoria RAM del servidor. Se pierden al reiniciar.

### ¿Cuántos mensajes puedo enviar?

✅ **Ilimitados**, pero solo se guardan los últimos 50 en memoria.

### ¿Puedo ver mensajes de ayer?

❌ **No**. Solo mensajes de los últimos 5 minutos.

### ¿Funciona con múltiples servidores?

⚠️ **Parcialmente**. Cada servidor tiene su propia memoria. Para producción multi-servidor necesitas Redis u otra solución centralizada.

### ¿Es seguro?

✅ **Sí**. Los mensajes tienen escape HTML y validación de longitud.

### ¿Puedo cambiar el límite de 50 mensajes?

✅ **Sí**. Edita `MAX_MESSAGES` en `/api/chat/stream.ts`.

---

**¿Necesitas ayuda?** Revisa la documentación en `docs/CHAT_EFIMERO.md`
