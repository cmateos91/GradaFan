/**
 * ==================== CHAT EN TIEMPO REAL (SSE) ====================
 * Server-Sent Events para chat efímero en memoria
 * - Mensajes NO se guardan en BD
 * - Solo últimos 50 mensajes en memoria
 * - Auto-limpieza cada 5 minutos
 */

// Tipo de mensaje
interface ChatMessage {
    id: string;
    userId: string;
    username: string;
    avatar: string;
    message: string;
    timestamp: number;
}

// Almacenamiento en memoria (se borra al reiniciar servidor)
const chatMessages: ChatMessage[] = [];
const MAX_MESSAGES = 50; // Solo guardar últimos 50 mensajes
const MESSAGE_RETENTION = 5 * 60 * 1000; // 5 minutos

// Clientes conectados (para broadcast)
const clients = new Set<ReadableStreamDefaultController>();

// Limpiar mensajes antiguos cada 1 minuto
setInterval(() => {
    const now = Date.now();
    const cutoff = now - MESSAGE_RETENTION;

    // Eliminar mensajes más antiguos de 5 minutos
    const removedCount = chatMessages.length;
    chatMessages.splice(0, chatMessages.findIndex(msg => msg.timestamp > cutoff));

    if (removedCount > chatMessages.length) {
        console.log(`🧹 Limpiados ${removedCount - chatMessages.length} mensajes antiguos`);
    }
}, 60000);

/**
 * GET: Stream de eventos (SSE)
 */
export async function GET() {
    const stream = new ReadableStream({
        start(controller) {
            // Agregar cliente a la lista
            clients.add(controller);

            // Enviar mensajes existentes al conectar
            chatMessages.forEach(msg => {
                const data = `data: ${JSON.stringify(msg)}\n\n`;
                controller.enqueue(new TextEncoder().encode(data));
            });

            console.log(`✅ Cliente conectado. Total: ${clients.size}`);

            // Cleanup al desconectar
            return () => {
                clients.delete(controller);
                console.log(`❌ Cliente desconectado. Total: ${clients.size}`);
            };
        },
    });

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        },
    });
}

/**
 * POST: Enviar nuevo mensaje
 */
export async function POST({ request }: { request: Request }) {
    try {
        const body = await request.json();
        const { userId, username, avatar, message } = body;

        // Validación
        if (!userId || !username || !message) {
            return new Response(JSON.stringify({ error: 'Faltan campos requeridos' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Validar longitud del mensaje
        if (message.length > 500) {
            return new Response(JSON.stringify({ error: 'Mensaje muy largo (máx 500 caracteres)' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Crear mensaje
        const newMessage: ChatMessage = {
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            userId,
            username,
            avatar: avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`,
            message: message.trim(),
            timestamp: Date.now()
        };

        // Agregar a memoria (mantener solo últimos 50)
        chatMessages.push(newMessage);
        if (chatMessages.length > MAX_MESSAGES) {
            chatMessages.shift(); // Eliminar el más antiguo
        }

        // Broadcast a todos los clientes conectados
        const data = `data: ${JSON.stringify(newMessage)}\n\n`;
        const encoded = new TextEncoder().encode(data);

        clients.forEach(controller => {
            try {
                controller.enqueue(encoded);
            } catch (error) {
                console.error('Error enviando a cliente:', error);
                clients.delete(controller);
            }
        });

        console.log(`📨 Mensaje enviado: ${username}: ${message.substring(0, 30)}...`);

        return new Response(JSON.stringify({
            success: true,
            message: newMessage,
            totalMessages: chatMessages.length
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Error procesando mensaje:', error);
        return new Response(JSON.stringify({ error: 'Error del servidor' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
