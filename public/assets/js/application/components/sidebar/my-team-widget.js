/**
 * ==================== MY TEAM WIDGET ====================
 * Widget del sidebar que muestra el equipo favorito del usuario
 * con sus estadísticas reales de la clasificación
 */

class MyTeamWidget {
    constructor() {
        this.container = document.querySelector('.my-team-card');
        this.widget = document.querySelector('.highlight-widget');
        this.teamStandings = null;

        this.init();
    }

    async init() {
        if (!this.container) {
            console.warn('⚠️ My Team widget container not found');
            return;
        }

        // Escuchar cambios de usuario
        window.addEventListener('userChanged', (e) => {
            this.handleUserChanged(e.detail);
        });

        // Cargar estado inicial
        await this.loadInitialState();

        console.log('✅ My Team Widget initialized');
    }

    async loadInitialState() {
        // Esperar a que AuthService esté listo
        if (window.AuthService) {
            await window.AuthService.waitUntilReady();

            if (window.AuthService.isAuth()) {
                const user = window.AuthService.getCurrentUser();
                await this.showUserTeam(user);
            } else {
                this.showDefaultState();
            }
        } else {
            this.showDefaultState();
        }
    }

    async handleUserChanged(detail) {
        const { user, isAuthenticated } = detail;

        if (isAuthenticated && user) {
            await this.showUserTeam(user);
        } else {
            this.showDefaultState();
        }
    }

    async showUserTeam(user) {
        const teamId = user.favorite_team_id || user.favoriteTeamId;

        if (!teamId) {
            this.showDefaultState();
            return;
        }

        try {
            // Obtener información del equipo desde la tabla teams
            const teamInfo = await this.getTeamInfo(teamId);

            if (!teamInfo) {
                console.error('No se encontró información del equipo');
                this.showDefaultState();
                return;
            }

            // Obtener estadísticas reales de la clasificación
            const standings = await this.getTeamStandings(teamInfo.api_id);

            // Renderizar con datos reales
            this.render(teamInfo, standings);

        } catch (error) {
            console.error('Error loading team info:', error);
            this.showDefaultState();
        }
    }

    async getTeamInfo(teamId) {
        try {
            // Obtener desde Supabase
            if (!window.supabase) {
                throw new Error('Supabase not initialized');
            }

            const { data, error } = await window.supabase
                .from('teams')
                .select('*')
                .eq('id', teamId)
                .single();

            if (error) throw error;

            return data;
        } catch (error) {
            console.error('Error fetching team info:', error);
            return null;
        }
    }

    async getTeamStandings(apiId) {
        try {
            // Usar el servicio de Football API
            if (!window.footballAPI) {
                console.warn('Football API not available');
                return null;
            }

            const standings = await window.footballAPI.getStandings();

            if (!standings || !standings.standings || standings.standings.length === 0) {
                return null;
            }

            // Buscar el equipo en la clasificación
            const table = standings.standings[0].table;
            const teamStanding = table.find(team => team.team.id === apiId);

            return teamStanding;
        } catch (error) {
            console.error('Error fetching team standings:', error);
            return null;
        }
    }

    render(teamInfo, standings) {
        const position = standings ? standings.position : '-';
        const points = standings ? standings.points : '-';
        const played = standings ? standings.playedGames : '-';
        const wins = standings ? standings.won : '-';
        const draws = standings ? standings.draw : '-';
        const losses = standings ? standings.lost : '-';

        // Obtener logo optimizado de Astro
        const logoUrl = this.getTeamLogo(teamInfo);

        this.container.innerHTML = `
            <img src="${logoUrl}"
                 alt="${teamInfo.name}"
                 class="team-logo"
                 onerror="this.src='/assets/img/default-team.svg'">
            <div class="team-info">
                <h4>${teamInfo.short_name || teamInfo.name}</h4>
                <p class="team-position">${position}º • ${points} pts</p>
                <div class="team-stats-mini">
                    <span title="Partidos jugados">PJ: ${played}</span>
                    <span title="Victorias">G: ${wins}</span>
                    <span title="Empates">E: ${draws}</span>
                    <span title="Derrotas">P: ${losses}</span>
                </div>
            </div>
        `;

        // Mostrar el widget si estaba oculto
        if (this.widget) {
            this.widget.style.display = 'block';
        }
    }

    /**
     * Obtener URL del logo del equipo (optimizado por Astro)
     */
    getTeamLogo(teamInfo) {
        // 1. Intentar obtener desde el mapa optimizado de Astro
        if (teamInfo.slug && window.TEAM_LOGOS_MAP && window.TEAM_LOGOS_MAP[teamInfo.slug]) {
            return window.TEAM_LOGOS_MAP[teamInfo.slug];
        }

        // 2. Fallback a logo_url de la BD (por si acaso)
        if (teamInfo.logo_url) {
            return teamInfo.logo_url;
        }

        // 3. Último fallback
        return '/assets/img/default-team.svg';
    }

    showDefaultState() {
        // Mostrar estado por defecto cuando no hay usuario logueado
        this.container.innerHTML = `
            <div class="no-team-selected">
                <p class="no-team-message">Inicia sesión para ver tu equipo favorito</p>
                <button class="btn-primary btn-sm" id="btnLoginFromTeam">
                    Iniciar Sesión
                </button>
            </div>
        `;

        // Event listener para el botón
        const loginBtn = document.getElementById('btnLoginFromTeam');
        if (loginBtn) {
            loginBtn.addEventListener('click', () => {
                window.dispatchEvent(new CustomEvent('showAuthModal', {
                    detail: { mode: 'login' }
                }));
            });
        }
    }
}

// Auto-inicialización
document.addEventListener('DOMContentLoaded', () => {
    window.myTeamWidget = new MyTeamWidget();
});
