/**
 * ==================== API: LOGIN DE USUARIOS ====================
 * Endpoint para autenticar usuarios con Supabase
 *
 * POST /api/auth/login
 * Body: { username, password }
 */

import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

export const POST: APIRoute = async ({ request }) => {
    try {
        const body = await request.json();
        const { username, password } = body;

        // Validaciones
        if (!username || !password) {
            return new Response(JSON.stringify({
                error: 'Faltan campos requeridos',
                details: 'Se requiere: username, password'
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Crear cliente de Supabase
        const supabase = createClient(supabaseUrl, supabaseKey);

        // Intentar login con email temporal (username@laliga.social)
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email: `${username}@laliga.social`,
            password: password
        });

        if (authError) {
            console.error('Error en login:', authError);

            return new Response(JSON.stringify({
                error: 'Credenciales inválidas',
                details: 'Usuario o contraseña incorrectos'
            }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Obtener perfil del usuario
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authData.user.id)
            .single();

        if (profileError) {
            console.error('Error obteniendo perfil:', profileError);
        }

        console.log(`✅ Login exitoso: ${username}`);

        return new Response(JSON.stringify({
            success: true,
            message: 'Login exitoso',
            user: {
                id: authData.user.id,
                username: profile?.username || username,
                displayName: profile?.display_name || username,
                avatarUrl: profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
                favoriteTeam: profile?.favorite_team,
                favoriteTeamId: profile?.favorite_team_id,
                points: profile?.points || 0,
                level: profile?.level || 'Aficionado'
            },
            session: {
                access_token: authData.session?.access_token,
                refresh_token: authData.session?.refresh_token,
                expires_at: authData.session?.expires_at,
                expires_in: authData.session?.expires_in,
                token_type: authData.session?.token_type,
                user: authData.session?.user
            }
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Error en login:', error);
        return new Response(JSON.stringify({
            error: 'Error interno del servidor',
            details: error instanceof Error ? error.message : 'Error desconocido'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};
