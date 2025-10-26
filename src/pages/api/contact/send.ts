/**
 * ==================== API: ENVIAR FORMULARIO DE CONTACTO ====================
 * Endpoint para procesar mensajes de contacto
 *
 * POST /api/contact/send
 * Body: { messageType, name, email, subject, message }
 */

import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

export const POST: APIRoute = async ({ request }) => {
    try {
        const body = await request.json();
        const { messageType, name, email, subject, message } = body;

        // Validaciones
        if (!messageType || !name || !email || !subject || !message) {
            return new Response(JSON.stringify({
                error: 'Faltan campos requeridos',
                details: 'Todos los campos son obligatorios'
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Validar email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return new Response(JSON.stringify({
                error: 'Email inválido',
                details: 'Por favor, introduce un email válido'
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Validar longitud del mensaje
        if (message.length < 10) {
            return new Response(JSON.stringify({
                error: 'Mensaje muy corto',
                details: 'El mensaje debe tener al menos 10 caracteres'
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        if (message.length > 2000) {
            return new Response(JSON.stringify({
                error: 'Mensaje muy largo',
                details: 'El mensaje no puede superar los 2000 caracteres'
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Crear cliente de Supabase
        const supabase = createClient(supabaseUrl, supabaseKey);

        // Guardar en la base de datos
        const { data, error } = await supabase
            .from('contact_messages')
            .insert({
                message_type: messageType,
                name: name,
                email: email,
                subject: subject,
                message: message,
                status: 'pending',
                created_at: new Date().toISOString()
            })
            .select()
            .single();

        if (error) {
            console.error('Error guardando mensaje de contacto:', error);
            throw new Error('Error al guardar el mensaje');
        }

        console.log(`✅ Mensaje de contacto recibido de ${name} (${email})`);

        // Aquí podrías enviar un email de notificación si tienes configurado un servicio
        // Por ahora, solo guardamos en la BD

        return new Response(JSON.stringify({
            success: true,
            message: 'Mensaje enviado correctamente',
            id: data.id
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Error en API de contacto:', error);
        return new Response(JSON.stringify({
            error: 'Error interno del servidor',
            details: error instanceof Error ? error.message : 'Error desconocido'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};
