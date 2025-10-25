/**
 * Supabase Client para el Frontend
 *
 * Inicializa el cliente de Supabase usando la librería cargada desde CDN
 */

(function() {
    // Configuración de Supabase desde variables de entorno
    const SUPABASE_URL = window.SUPABASE_CONFIG?.supabaseUrl;
    const SUPABASE_ANON_KEY = window.SUPABASE_CONFIG?.supabaseAnonKey;

    // Validar que las credenciales existan
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
        console.error('❌ Supabase credentials not found in environment variables');
        return;
    }

    // Esperar a que la librería de Supabase esté cargada
    function initSupabase() {
        // Cuando se carga desde CDN, supabase es un objeto global con { createClient }
        if (typeof window.supabase === 'undefined' || typeof window.supabase.createClient === 'undefined') {
            console.log('⏳ Waiting for Supabase library...');
            setTimeout(initSupabase, 100);
            return;
        }

        console.log('🔄 Initializing Supabase client...');

        try {
            // Guardar referencia a createClient
            const { createClient } = window.supabase;

            // Crear cliente de Supabase y REEMPLAZAR el objeto global
            window.supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
                auth: {
                    autoRefreshToken: true,
                    persistSession: true,
                    detectSessionInUrl: true
                }
            });

            console.log('✅ Supabase client initialized');

            // Resolver la promesa para que otros servicios sepan que está listo
            if (window.supabaseReadyResolve) {
                window.supabaseReadyResolve(window.supabase);
            }
        } catch (error) {
            console.error('❌ Error initializing Supabase:', error);
            if (window.supabaseReadyReject) {
                window.supabaseReadyReject(error);
            }
        }
    }

    // Crear promesa que se resuelve cuando Supabase esté listo
    window.supabaseReady = new Promise((resolve, reject) => {
        window.supabaseReadyResolve = resolve;
        window.supabaseReadyReject = reject;
    });

    // Iniciar el proceso
    initSupabase();
})();

/**
 * Helper: Obtener usuario actual
 */
window.getCurrentUser = async function() {
    if (!window.supabase) return null;

    const { data: { user }, error } = await window.supabase.auth.getUser();

    if (error) {
        console.error('Error al obtener usuario:', error);
        return null;
    }

    return user;
};

/**
 * Helper: Verificar si hay sesión activa
 */
window.isAuthenticated = async function() {
    if (!window.supabase) return false;

    const { data: { session } } = await window.supabase.auth.getSession();
    return !!session;
};

/**
 * Helper: Obtener perfil del usuario actual
 */
window.getCurrentProfile = async function() {
    const user = await window.getCurrentUser();

    if (!user) return null;

    const { data, error } = await window.supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    if (error) {
        console.error('Error al obtener perfil:', error);
        return null;
    }

    return data;
};
