import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    import.meta.env.PUBLIC_SUPABASE_URL!,
    import.meta.env.PUBLIC_SUPABASE_ANON_KEY!
);

// Store para mensajes por equipo (en memoria)
const teamChatMessages = new Map<string, any[]>();

// Store para clientes SSE por equipo
const teamClients = new Map<string, Set<WritableStreamDefaultWriter>>();

/**
 * GET: Stream de Server-Sent Events para chat de equipos
 */
export const GET: APIRoute = async ({ params, request }) => {
    const { teamId } = params;

    if (!teamId) {
        return new Response(JSON.stringify({ error: 'Team ID is required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    // Crear stream SSE
    const stream = new ReadableStream({
        start(controller) {
            const encoder = new TextEncoder();
            const writer = controller as any;

            // Registrar cliente para este equipo
            if (!teamClients.has(teamId)) {
                teamClients.set(teamId, new Set());
            }
            teamClients.get(teamId)!.add(writer);

            console.log(`✅ Cliente conectado al chat del equipo ${teamId}`);

            // Enviar mensajes iniciales (últimos 20)
            const messages = teamChatMessages.get(teamId) || [];
            const recentMessages = messages.slice(-20);

            recentMessages.forEach(msg => {
                const data = `data: ${JSON.stringify(msg)}\n\n`;
                controller.enqueue(encoder.encode(data));
            });

            // Cleanup cuando se cierra la conexión
            request.signal.addEventListener('abort', () => {
                const clients = teamClients.get(teamId);
                if (clients) {
                    clients.delete(writer);
                    if (clients.size === 0) {
                        teamClients.delete(teamId);
                    }
                }
                controller.close();
                console.log(`❌ Cliente desconectado del chat del equipo ${teamId}`);
            });
        }
    });

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
        }
    });
};

/**
 * POST: Enviar mensaje al chat del equipo (con validación)
 */
export const POST: APIRoute = async ({ params, request }) => {
    const { teamId } = params;

    if (!teamId) {
        return new Response(JSON.stringify({ error: 'Team ID is required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        const body = await request.json();
        const { userId, username, avatar, message, userTeamId } = body;

        // Validaciones básicas
        if (!message || message.trim().length === 0) {
            return new Response(JSON.stringify({ error: 'Message cannot be empty' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        if (message.length > 500) {
            return new Response(JSON.stringify({ error: 'Message too long (max 500 characters)' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // VALIDACIÓN IMPORTANTE: Solo usuarios con este equipo favorito pueden escribir
        if (userTeamId && String(userTeamId) !== String(teamId)) {
            return new Response(JSON.stringify({
                error: 'Solo los aficionados de este equipo pueden escribir en este chat',
                code: 'TEAM_MISMATCH'
            }), {
                status: 403,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Si el usuario está autenticado, verificar en Supabase que su equipo coincida
        if (userId && !userId.startsWith('temp_')) {
            const { data: profile } = await supabase
                .from('profiles')
                .select('favorite_team_id')
                .eq('id', userId)
                .single();

            if (!profile || String(profile.favorite_team_id) !== String(teamId)) {
                return new Response(JSON.stringify({
                    error: 'Solo los aficionados de este equipo pueden escribir en este chat',
                    code: 'TEAM_MISMATCH'
                }), {
                    status: 403,
                    headers: { 'Content-Type': 'application/json' }
                });
            }
        }

        // Crear mensaje
        const newMessage = {
            id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            userId,
            username: username || 'Anónimo',
            avatar: avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`,
            message: message.trim(),
            timestamp: new Date().toISOString(),
            teamId: teamId
        };

        // Guardar mensaje en memoria
        if (!teamChatMessages.has(teamId)) {
            teamChatMessages.set(teamId, []);
        }
        const messages = teamChatMessages.get(teamId)!;
        messages.push(newMessage);

        // Limitar a los últimos 100 mensajes
        if (messages.length > 100) {
            messages.shift();
        }

        // Broadcast a todos los clientes conectados a este equipo
        const clients = teamClients.get(teamId);
        if (clients && clients.size > 0) {
            const encoder = new TextEncoder();
            const data = `data: ${JSON.stringify(newMessage)}\n\n`;
            const encoded = encoder.encode(data);

            clients.forEach(writer => {
                try {
                    (writer as any).enqueue(encoded);
                } catch (error) {
                    console.error('Error broadcasting message:', error);
                    clients.delete(writer);
                }
            });
        }

        console.log(`✅ Mensaje enviado al chat del equipo ${teamId} por ${username}`);

        return new Response(JSON.stringify({
            success: true,
            messageId: newMessage.id
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error: any) {
        console.error('❌ Error en POST team chat:', error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};
