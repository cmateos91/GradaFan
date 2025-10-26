/**
 * ==================== API: REGISTRO DE USUARIOS ====================
 * Endpoint para registrar nuevos usuarios con Supabase
 *
 * POST /api/auth/register
 * Body: { username, password, favoriteTeam, favoriteTeamId }
 */

import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

export const POST: APIRoute = async ({ request }) => {
    try {
        const body = await request.json();
        const { username, password, favoriteTeam, favoriteTeamId } = body;

        // Validaciones
        if (!username || !password || !favoriteTeam || !favoriteTeamId) {
            return new Response(JSON.stringify({
                error: 'Faltan campos requeridos',
                details: 'Se requiere: username, password, favoriteTeam, favoriteTeamId'
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Validar longitud de username
        if (username.length < 3 || username.length > 20) {
            return new Response(JSON.stringify({
                error: 'Nombre de usuario inválido',
                details: 'El username debe tener entre 3 y 20 caracteres'
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Validar que username solo contenga letras, números y guiones
        if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
            return new Response(JSON.stringify({
                error: 'Nombre de usuario inválido',
                details: 'Solo se permiten letras, números, guiones y guiones bajos'
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Validar longitud de contraseña
        if (password.length < 6) {
            return new Response(JSON.stringify({
                error: 'Contraseña muy corta',
                details: 'La contraseña debe tener al menos 6 caracteres'
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Crear cliente de Supabase
        const supabase = createClient(supabaseUrl, supabaseKey);

        // Registrar usuario en Supabase Auth
        // Usamos el username como email temporal (username@laliga.social)
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: `${username}@laliga.social`,
            password: password,
            options: {
                data: {
                    username: username,
                    display_name: username,
                    favorite_team: favoriteTeam,
                    favorite_team_id: favoriteTeamId,
                    avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`
                }
            }
        });

        if (authError) {
            console.error('Error en Supabase Auth:', authError);

            // Manejar errores específicos
            if (authError.message.includes('already registered')) {
                return new Response(JSON.stringify({
                    error: 'Usuario ya existe',
                    details: 'Este nombre de usuario ya está registrado'
                }), {
                    status: 409,
                    headers: { 'Content-Type': 'application/json' }
                });
            }

            // Rate limit error
            if (authError.message.includes('15 seconds')) {
                return new Response(JSON.stringify({
                    error: 'Demasiados intentos',
                    details: 'Por seguridad, espera 15 segundos antes de intentar de nuevo'
                }), {
                    status: 429,
                    headers: { 'Content-Type': 'application/json' }
                });
            }

            return new Response(JSON.stringify({
                error: 'Error al registrar usuario',
                details: authError.message
            }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Registro exitoso
        console.log(`✅ Usuario registrado: ${username}, Equipo: ${favoriteTeam}`);

        return new Response(JSON.stringify({
            success: true,
            message: 'Usuario registrado exitosamente',
            user: {
                id: authData.user?.id,
                username: username,
                favoriteTeam: favoriteTeam
            }
        }), {
            status: 201,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Error en registro:', error);
        return new Response(JSON.stringify({
            error: 'Error interno del servidor',
            details: error instanceof Error ? error.message : 'Error desconocido'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};
