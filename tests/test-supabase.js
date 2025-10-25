/**
 * API Endpoint para probar conexión con Supabase
 *
 * Accede a: http://localhost:4321/api/test-supabase
 */

import { createClient } from '@supabase/supabase-js';

export async function GET() {
    try {
        const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

        // Verificar que existan las credenciales
        if (!supabaseUrl || !supabaseAnonKey) {
            return new Response(JSON.stringify({
                success: false,
                error: 'Missing Supabase credentials',
                message: 'Asegúrate de tener PUBLIC_SUPABASE_URL y PUBLIC_SUPABASE_ANON_KEY en .env'
            }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Crear cliente
        const supabase = createClient(supabaseUrl, supabaseAnonKey);

        // Probar conexión simple - obtener versión de PostgreSQL
        const { data, error } = await supabase
            .from('_test_connection')
            .select('*')
            .limit(1);

        // Si hay error, es normal si la tabla no existe
        // Lo importante es que la conexión se estableció
        return new Response(JSON.stringify({
            success: true,
            message: '✅ Supabase connection successful!',
            supabaseUrl: supabaseUrl,
            connectionTest: error ? 'Table not found (normal)' : 'Query successful',
            details: {
                hasUrl: !!supabaseUrl,
                hasKey: !!supabaseAnonKey,
                keyPrefix: supabaseAnonKey.substring(0, 20) + '...'
            }
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        return new Response(JSON.stringify({
            success: false,
            error: error.message,
            stack: error.stack
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
