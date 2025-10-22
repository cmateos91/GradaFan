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
        // Equipos locales con orden estimado
        const teamsOrder = [
            'Real Madrid CF',
            'FC Barcelona',
            'Club Atlético de Madrid',
            'Real Sociedad de Fútbol',
            'Athletic Club',
            'Real Betis Balompié',
            'Villarreal CF',
            'Valencia CF',
            'CA Osasuna',
            'Rayo Vallecano de Madrid',
            'Sevilla FC',
            'RCD Mallorca',
            'Getafe CF',
            'Girona FC',
            'RC Celta de Vigo',
            'Deportivo Alavés',
            'RCD Espanyol de Barcelona',
            'UD Las Palmas',
            'Real Valladolid CF',
            'Elche CF'
        ];

        return teamsOrder.map((teamName, index) => ({
            name: teamName,
            shortName: teamName.replace(/^(Real|FC|Club|CA|RCD|UD)\s+/, '').split(' ')[0],
            position: index + 1,
            badge: window.TeamUtils.getTeamBadge(teamName)
        }));
    }

    render() {
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

// Esperar a que los componentes se carguen
document.addEventListener('componentsLoaded', () => {
    console.log('🔍 componentsLoaded event fired - looking for teams-bar');
    const teamsBarContainer = document.getElementById('teams-bar');
    console.log('🔍 teams-bar container:', teamsBarContainer);

    if (teamsBarContainer) {
        console.log('✅ Initializing TeamsBar...');
        teamsBarComponent = new TeamsBar('teams-bar');
    } else {
        console.error('❌ teams-bar container not found!');
    }
});

// Fallback por si el evento no se dispara
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        console.log('🔍 DOMContentLoaded fallback - checking for teams-bar');
        const teamsBarContainer = document.getElementById('teams-bar');
        console.log('🔍 teams-bar container (fallback):', teamsBarContainer);

        if (teamsBarContainer && !teamsBarComponent) {
            console.log('✅ Initializing TeamsBar (fallback)...');
            teamsBarComponent = new TeamsBar('teams-bar');
        }
    }, 1000);
});

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.TeamsBar = TeamsBar;
}
