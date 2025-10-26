/**
 * ==================== TEAM STANDINGS WIDGET ====================
 * Widget de clasificación del equipo en el sidebar
 */

class TeamStandingsWidget {
    constructor() {
        this.container = document.getElementById('team-standings-widget');
        this.teamData = window.TEAM_DATA;

        this.init();
    }

    async init() {
        if (!this.container || !this.teamData) {
            console.error('⚠️ Team standings widget container or team data not found');
            return;
        }

        await this.loadStandings();
    }

    async loadStandings() {
        try {
            // Obtener clasificación desde Football API
            const standings = await window.footballAPI.getStandings();
            const table = standings.standings[0].table;

            // Encontrar el equipo en la clasificación
            const teamStanding = table.find(team => team.team.id === this.teamData.apiId);

            if (!teamStanding) {
                this.showError('No se encontró el equipo en la clasificación');
                return;
            }

            // Actualizar las estadísticas del hero
            document.getElementById('team-position').textContent = `${teamStanding.position}º`;
            document.getElementById('team-points').textContent = teamStanding.points;

            // Renderizar el widget con la posición del equipo y equipos cercanos
            this.render(table, teamStanding);

        } catch (error) {
            console.error('Error loading team standings:', error);
            this.showError('Error al cargar la clasificación');
        }
    }

    render(fullTable, teamStanding) {
        const position = teamStanding.position;

        // Mostrar 5 equipos: 2 arriba, el equipo, 2 abajo
        const startIndex = Math.max(0, position - 3);
        const endIndex = Math.min(fullTable.length, position + 2);
        const displayedTeams = fullTable.slice(startIndex, endIndex);

        const html = `
            <div class="mini-standings-table">
                ${displayedTeams.map(team => `
                    <div class="mini-standings-row ${team.team.id === this.teamData.apiId ? 'highlight' : ''}">
                        <span class="mini-position">${team.position}</span>
                        <span class="mini-team-name">${team.team.tla || team.team.shortName}</span>
                        <span class="mini-points">${team.points}pts</span>
                    </div>
                `).join('')}
            </div>
            <a href="/clasificacion" class="widget-link">Ver clasificación completa →</a>
        `;

        this.container.innerHTML = html;
    }

    showError(message) {
        this.container.innerHTML = `
            <div class="widget-error">
                <p>${message}</p>
            </div>
        `;
    }
}

// Auto-inicialización
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        new TeamStandingsWidget();
    });
}
