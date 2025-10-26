/**
 * ==================== AUTH SERVICE ====================
 * Servicio de autenticación para LaLiga Social
 * Gestiona registro, login, logout y sesión de usuarios
 */

class AuthService {
    constructor() {
        this.currentUser = null;
        this.isAuthenticated = false;
        this.supabase = null;
        this.isInitialized = false;
        this.initPromise = null;

        this.initPromise = this.init();
    }

    async init() {
        // Obtener cliente de Supabase
        if (typeof window !== 'undefined' && window.supabase) {
            this.supabase = window.supabase;

            // Cargar sesión actual si existe
            await this.loadSession();

            this.isInitialized = true;
            console.log('✅ AuthService initialized');
        } else {
            console.error('❌ Supabase client not found');
        }
    }

    /**
     * Esperar a que AuthService se inicialice completamente
     */
    async waitUntilReady() {
        if (this.initPromise) {
            await this.initPromise;
        }
        return this.isInitialized;
    }

    /**
     * Cargar sesión actual desde Supabase
     */
    async loadSession() {
        try {
            // Primero intentar cargar desde localStorage
            const storedSession = localStorage.getItem('session');
            const storedUser = localStorage.getItem('user');

            if (storedSession && storedUser) {
                const sessionData = JSON.parse(storedSession);

                // Establecer la sesión en Supabase
                const { error: sessionError } = await this.supabase.auth.setSession({
                    access_token: sessionData.access_token,
                    refresh_token: sessionData.refresh_token
                });

                if (sessionError) {
                    console.error('Error al establecer sesión desde localStorage:', sessionError);
                    // Limpiar localStorage si la sesión no es válida
                    localStorage.removeItem('session');
                    localStorage.removeItem('user');
                    return;
                }

                // Restaurar usuario desde localStorage
                this.currentUser = JSON.parse(storedUser);
                this.isAuthenticated = true;

                console.log('✅ Sesión restaurada desde localStorage:', this.currentUser.username);

                // Emitir evento de usuario autenticado
                this.emitUserChanged();
                return;
            }

            // Si no hay sesión en localStorage, intentar obtener de Supabase
            const { data: { session }, error } = await this.supabase.auth.getSession();

            if (error) {
                console.error('Error loading session:', error);
                return;
            }

            if (session) {
                // Obtener perfil del usuario
                const { data: profile } = await this.supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', session.user.id)
                    .single();

                if (profile) {
                    this.currentUser = {
                        id: session.user.id,
                        username: profile.username,
                        displayName: profile.display_name,
                        avatarUrl: profile.avatar_url,
                        favoriteTeam: profile.favorite_team,
                        favoriteTeamId: profile.favorite_team_id,
                        points: profile.points,
                        level: profile.level
                    };
                    this.isAuthenticated = true;

                    console.log('✅ Sesión cargada:', this.currentUser.username);

                    // Emitir evento de usuario autenticado
                    this.emitUserChanged();
                }
            }
        } catch (error) {
            console.error('Error loading session:', error);
        }
    }

    /**
     * Registrar nuevo usuario
     */
    async register(username, password, favoriteTeam, favoriteTeamId) {
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username,
                    password,
                    favoriteTeam,
                    favoriteTeamId
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.details || data.error || 'Error en registro');
            }

            console.log('✅ Usuario registrado:', data.user.username);

            // Auto-login después del registro
            try {
                return await this.login(username, password);
            } catch (loginError) {
                // Si falla el login, probablemente sea porque Supabase requiere confirmación de email
                throw new Error('Usuario registrado correctamente, pero necesitas configurar Supabase: Ve a Authentication → Settings → Desactiva "Enable email confirmations"');
            }

        } catch (error) {
            console.error('Error en registro:', error);
            throw error;
        }
    }

    /**
     * Iniciar sesión
     */
    async login(username, password) {
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username,
                    password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.details || data.error || 'Error en login');
            }

            // IMPORTANTE: Establecer la sesión en el cliente de Supabase del frontend
            if (this.supabase && data.session) {
                const { error: sessionError } = await this.supabase.auth.setSession({
                    access_token: data.session.access_token,
                    refresh_token: data.session.refresh_token
                });

                if (sessionError) {
                    console.error('Error al establecer sesión en Supabase:', sessionError);
                } else {
                    console.log('✅ Sesión establecida en Supabase client');
                }
            }

            // Guardar usuario en memoria
            this.currentUser = data.user;
            this.isAuthenticated = true;

            // Guardar en localStorage
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('session', JSON.stringify(data.session));

            console.log('✅ Login exitoso:', this.currentUser.username);

            // Emitir evento de cambio de usuario
            this.emitUserChanged();

            return data;

        } catch (error) {
            console.error('Error en login:', error);
            throw error;
        }
    }

    /**
     * Cerrar sesión
     */
    async logout() {
        try {
            // 1. Cerrar sesión en Supabase
            if (this.supabase) {
                await this.supabase.auth.signOut();
                console.log('✅ Sesión cerrada en Supabase');
            }

            // 2. Llamar al endpoint de logout del backend
            await fetch('/api/auth/logout', {
                method: 'POST'
            });

            // 3. Limpiar datos locales ANTES de recargar
            this.currentUser = null;
            this.isAuthenticated = false;
            localStorage.removeItem('user');
            localStorage.removeItem('session');

            console.log('✅ Logout exitoso, recargando página...');

            // 4. Emitir evento de cambio de usuario
            this.emitUserChanged();

            // 5. Esperar un momento para asegurar que todo se limpió
            await new Promise(resolve => setTimeout(resolve, 100));

            // 6. Recargar página para limpiar todo el estado
            window.location.href = '/';

        } catch (error) {
            console.error('Error en logout:', error);
            // Forzar limpieza y recarga incluso si hay error
            localStorage.clear();
            window.location.href = '/';
        }
    }

    /**
     * Obtener usuario actual
     */
    getCurrentUser() {
        return this.currentUser;
    }

    /**
     * Verificar si está autenticado
     */
    isAuth() {
        return this.isAuthenticated;
    }

    /**
     * Emitir evento de cambio de usuario
     */
    emitUserChanged() {
        const event = new CustomEvent('userChanged', {
            detail: {
                user: this.currentUser,
                isAuthenticated: this.isAuthenticated
            }
        });
        window.dispatchEvent(event);
    }
}

// Instancia global
if (typeof window !== 'undefined') {
    window.AuthService = new AuthService();
}
