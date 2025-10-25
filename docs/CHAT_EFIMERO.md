# 💬 Chat Efímero en Tiempo Real

## 📋 Resumen

El chat ahora funciona **100% en memoria** sin guardar nada en la base de datos. Los mensajes son efímeros y desaparecen automáticamente.

## ✅ Ventajas

- ✅ **Cero costos de almacenamiento** - No se guarda nada en BD
- ✅ **Rendimiento instantáneo** - Todo en memoria RAM
- ✅ **Auto-limpieza** - Mensajes antiguos se eliminan automáticamente
- ✅ **Escalable** - No importa cuántos usuarios envíen mensajes
- ✅ **Tiempo real** - Server-Sent Events para broadcast instantáneo
- ✅ **Privacidad** - Los mensajes no se almacenan permanentemente

## 🏗️ Arquitectura

```
┌─────────────┐         SSE Stream          ┌─────────────┐
│   Cliente   │◄──────────────────────────►│   Servidor  │
│  (Browser)  │         WebSocket           │   (Astro)   │
└─────────────┘                             └─────────────┘
                                                    │
                                                    ▼
                                            ┌──────────────┐
                                            │   Memoria    │
                                            │  (últimos    │
                                            │ 50 mensajes) │
                                            └──────────────┘
                                                    │
                                                    ▼
                                            Auto-limpieza
                                            cada 5 minutos
```

## 📂 Archivos

### Backend

- **`src/pages/api/chat/stream.ts`** - API endpoint con SSE
  - `GET /api/chat/stream` - Stream de eventos en tiempo real
  - `POST /api/chat/stream` - Enviar nuevo mensaje

### Frontend

- **`public/assets/js/application/components/common/chat/chat-realtime.js`** - Componente de chat
  - Conexión SSE automática
  - Reconexión con backoff exponencial
  - UI responsive

### Base de Datos

- **`supabase-schema-v2.sql`** - Schema actualizado SIN tabla `chat_messages`

## 🚀 Cómo funciona

### 1. Conexión al Stream

```javascript
// El cliente se conecta automáticamente al iniciar
const eventSource = new EventSource('/api/chat/stream');

eventSource.onmessage = (event) => {
    const message = JSON.parse(event.data);
    // Mostrar mensaje en UI
};
```

### 2. Enviar Mensaje

```javascript
await fetch('/api/chat/stream', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        userId: 'user123',
        username: 'Juan',
        avatar: 'https://...',
        message: 'Hola!'
    })
});
```

### 3. Broadcast Automático

El servidor envía el mensaje a **todos** los clientes conectados instantáneamente.

## ⚙️ Configuración

### Límites

```javascript
const MAX_MESSAGES = 50;              // Solo 50 mensajes en memoria
const MESSAGE_RETENTION = 5 * 60 * 1000; // 5 minutos de retención
```

### Validaciones

- ✅ Longitud máxima: **500 caracteres**
- ✅ Campos requeridos: `userId`, `username`, `message`
- ✅ Protección XSS con escape HTML

## 🔄 Ciclo de Vida de un Mensaje

1. **Usuario envía mensaje** → POST a `/api/chat/stream`
2. **Servidor valida** → Longitud, campos requeridos
3. **Agregar a memoria** → Array de últimos 50 mensajes
4. **Broadcast** → Enviar a todos los clientes conectados vía SSE
5. **Auto-limpieza** → Mensajes >5 min se eliminan cada 1 min
6. **Límite alcanzado** → Si hay >50 mensajes, eliminar el más antiguo

```
Mensaje enviado → Validación → Memoria (max 50) → Broadcast → Auto-limpieza
                                                              (cada 5 min)
```

## 🛠️ Instalación

### 1. Aplicar nuevo schema en Supabase

```sql
-- Ejecutar en SQL Editor de Supabase
-- Ver: supabase-schema-v2.sql
```

### 2. El componente ya está integrado

El script `chat-realtime.js` ya está cargado en `BaseLayout.astro`:

```html
<script is:inline src="/assets/js/application/components/common/chat/chat-realtime.js"></script>
```

### 3. Usar en HTML

```html
<div id="live-chat">
    <div class="chat-messages"></div>
    <input class="chat-input" placeholder="Escribe un mensaje...">
    <button class="chat-send">Enviar</button>
</div>
```

## 🔐 Seguridad

- ✅ **Escape HTML** - Previene inyección de scripts
- ✅ **Validación de longitud** - Máximo 500 caracteres
- ✅ **Rate limiting** (TODO) - Prevenir spam
- ✅ **Sin datos sensibles** - Los mensajes no se almacenan

## 📊 Monitoreo

### Logs del servidor

```javascript
console.log(`✅ Cliente conectado. Total: ${clients.size}`);
console.log(`📨 Mensaje enviado: ${username}: ${message}...`);
console.log(`🧹 Limpiados ${count} mensajes antiguos`);
```

### Estado de conexión

El componente muestra mensajes del sistema:
- "Conectado al chat"
- "Desconectado. Reintentando..."
- "No se pudo conectar al chat. Recarga la página."

## 🚨 Limitaciones

- ❌ Los mensajes **NO se guardan** al refrescar la página
- ❌ Solo se mantienen **50 mensajes** en memoria
- ❌ Mensajes más antiguos de **5 minutos** se eliminan
- ❌ Al reiniciar el servidor se **pierden todos los mensajes**

## 🎯 Casos de Uso Ideales

✅ **Perfecto para:**
- Chat durante partidos en vivo
- Comentarios efímeros en eventos
- Conversaciones casuales sin importancia histórica
- Reducir costos de BD

❌ **NO usar para:**
- Mensajes importantes que deben guardarse
- Conversaciones privadas
- Soporte al cliente
- Histórico de mensajes

## 🔮 Mejoras Futuras

- [ ] Rate limiting por usuario (anti-spam)
- [ ] Moderación automática de palabras ofensivas
- [ ] Reacciones a mensajes (emoji)
- [ ] Menciones (@usuario)
- [ ] Integración con Supabase Auth para usuarios reales
- [ ] Salas de chat separadas por equipo
- [ ] WebSocket en lugar de SSE (bidireccional)

## 📝 Notas

- El chat es **público** - todos ven todos los mensajes
- No hay sistema de **salas privadas** (de momento)
- Los mensajes son **anónimos** hasta integrar Supabase Auth
- El sistema escala horizontalmente (cada servidor tiene su propia memoria)

## 🤝 Contribuir

Si quieres mejorar el sistema de chat, revisa los TODOs en el código y abre un PR.

---

**Última actualización:** 2025-01-25
**Versión:** 2.0.0
