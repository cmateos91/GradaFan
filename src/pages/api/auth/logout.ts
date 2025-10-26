/**
 * ==================== API: LOGOUT DE USUARIOS ====================
 * Endpoint para cerrar sesión
 *
 * POST /api/auth/logout
 */

import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

export const POST: APIRoute = async ({ request }) => {
    try {
        // Crear cliente de Supabase
        const supabase = createClient(supabaseUrl, supabaseKey);

        // Cerrar sesión
        const { error } = await supabase.auth.signOut();

        if (error) {
            console.error('Error en logout:', error);
            return new Response(JSON.stringify({
                error: 'Error al cerrar sesión',
                details: error.message
            }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        console.log('✅ Logout exitoso');

        return new Response(JSON.stringify({
            success: true,
            message: 'Sesión cerrada exitosamente'
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Error en logout:', error);
        return new Response(JSON.stringify({
            error: 'Error interno del servidor',
            details: error instanceof Error ? error.message : 'Error desconocido'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};
