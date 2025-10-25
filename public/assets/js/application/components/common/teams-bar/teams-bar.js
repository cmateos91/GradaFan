/**
 * ==================== TEAMS BAR ====================
 * Barra horizontal con escudos de equipos ordenados por clasificación
 */

class TeamsBar {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.teams = [];

        if (this.container) {
            this.init();
        }
    }

    async init() {
        console.log('🏆 Initializing Teams Bar');
        await this.loadTeams();
    }

    async loadTeams() {
        try {
            // Intentar obtener clasificación de la API
            const standingsData = await window.footballAPI.getStandings();

            if (standingsData && standingsData.standings && standingsData.standings[0]) {
                const table = standingsData.standings[0].table;

                // Mapear los datos de la API a nuestro formato
                this.teams = table.map(teamData => ({
                    id: teamData.team.id,
                    name: teamData.team.name,
                    shortName: teamData.team.shortName || teamData.team.tla,
                    position: teamData.position,
                    badge: window.TeamUtils.getTeamBadge(teamData.team.name)
                }));

                console.log(`✅ ${this.teams.length} equipos cargados de la API`);
            }
        } catch (error) {
            console.warn('⚠️ No se pudo cargar clasificación de API, usando datos locales');
            // Fallback a datos locales ordenados alfabéticamente
            this.teams = this.getLocalTeams();
        }

        this.render();
    }

    getLocalTeams() {
        // Usar TEAMS_DATA que ya está ordenado alfabéticamente
        if (typeof TEAMS_DATA !== 'undefined' && TEAMS_DATA.length > 0) {
            return TEAMS_DATA.map(team => ({
                id: team.id,
                name: team.name,
                shortName: team.shortName,
                position: team.stats.position,
                badge: team.logo
            }));
        }

        // Fallback si TEAMS_DATA no está disponible
        console.warn('⚠️ TEAMS_DATA no disponible');
        return [];
    }

    render() {
        // NUEVO: No reemplazar HTML si ya está pre-renderizado por Astro
        const existingItems = this.container.querySelectorAll('.team-badge-item');

        if (existingItems.length > 0) {
            console.log('✅ Teams Bar pre-renderizado por Astro (imágenes optimizadas)');
            // Solo agregar event listeners al contenido existente
            this.attachEventListeners();
            return;
        }

        // Fallback: si no hay contenido pre-renderizado, usar el método antiguo
        if (this.teams.length === 0) {
            this.container.innerHTML = '<p class="no-teams">No hay equipos disponibles</p>';
            return;
        }

        const teamsHTML = this.teams.map(team => this.createTeamItem(team)).join('');
        this.container.querySelector('.teams-bar-scroll').innerHTML = teamsHTML;

        // Inicializar iconos si es necesario
        if (typeof initIcons === 'function') {
            initIcons();
        }

        // Event listeners
        this.attachEventListeners();
    }

    createTeamItem(team) {
        return `
            <div class="team-badge-item" data-team-name="${team.name}" title="${team.name}">
                <img src="${team.badge}" alt="${team.name}" class="team-badge-img">
            </div>
        `;
    }

    attachEventListeners() {
        const teamItems = this.container.querySelectorAll('.team-badge-item');

        teamItems.forEach(item => {
            item.addEventListener('click', () => {
                const teamName = item.dataset.teamName;
                this.handleTeamClick(teamName);
            });
        });
    }

    handleTeamClick(teamName) {
        console.log(`Equipo seleccionado: ${teamName}`);
        // TODO: Navegar a página del equipo o filtrar contenido
        // window.location.href = `equipo.html?team=${encodeURIComponent(teamName)}`;
    }
}

// Auto-inicialización
let teamsBarComponent = null;
let teamsBarInitialized = false;

// Función de inicialización única
function initTeamsBarOnce() {
    if (teamsBarInitialized) {
        return;
    }

    const teamsBarContainer = document.getElementById('teams-bar');

    if (teamsBarContainer) {
        console.log('✅ Initializing TeamsBar...');
        teamsBarComponent = new TeamsBar('teams-bar');
        teamsBarInitialized = true;
    }
}

// Esperar a que los componentes se carguen
document.addEventListener('componentsLoaded', () => {
    initTeamsBarOnce();
});

// Fallback por si el evento no se dispara (solo si no se inicializó)
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (!teamsBarInitialized) {
            console.log('🔄 DOMContentLoaded fallback - initializing TeamsBar');
            initTeamsBarOnce();
        }
    }, 100); // Reducido de 1000ms a 100ms
});

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.TeamsBar = TeamsBar;
}
