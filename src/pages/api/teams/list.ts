/**
 * ==================== API: LISTA DE EQUIPOS ====================
 * Endpoint para obtener todos los equipos de LaLiga
 *
 * GET /api/teams/list
 */

import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

export const GET: APIRoute = async () => {
    try {
        const supabase = createClient(supabaseUrl, supabaseKey);

        // Obtener todos los equipos ordenados alfabéticamente
        const { data: teams, error } = await supabase
            .from('teams')
            .select('*')
            .order('name', { ascending: true });

        if (error) {
            console.error('Error obteniendo equipos:', error);
            return new Response(JSON.stringify({
                error: 'Error al obtener equipos',
                details: error.message
            }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        return new Response(JSON.stringify({
            success: true,
            teams: teams || []
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Error en /api/teams/list:', error);
        return new Response(JSON.stringify({
            error: 'Error interno del servidor',
            details: error instanceof Error ? error.message : 'Error desconocido'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};
