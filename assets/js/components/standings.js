/**
 * ==================== STANDINGS COMPONENT ====================
 * Componente para mostrar la clasificación de LaLiga
 */

class StandingsComponent {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.standingsData = null;
        this.isLoading = false;
        this.error = null;
    }

    /**
     * Inicializar el componente
     */
    async init() {
        if (!this.container) {
            console.error('⚠️ Standings container not found');
            return;
        }

        console.log('📊 Initializing Standings Component');

        // Mostrar loading
        this.showLoading();

        // Cargar datos
        await this.loadStandings();

        // Configurar actualización automática cada 5 minutos
        setInterval(() => {
            this.loadStandings();
        }, 5 * 60 * 1000);
    }

    /**
     * Cargar datos de clasificación
     */
    async loadStandings() {
        if (this.isLoading) return;

        this.isLoading = true;

        try {
            const data = await window.footballAPI.getStandings();
            this.standingsData = data;
            this.error = null;
            this.render();

            console.log('✅ Standings loaded successfully');

        } catch (error) {
            console.error('❌ Error loading standings:', error);
            this.error = error.message;
            this.showError();
        } finally {
            this.isLoading = false;
        }
    }

    /**
     * Mostrar loading
     */
    showLoading() {
        this.container.innerHTML = `
            <div class="standings-loading">
                <div class="loading-spinner"></div>
                <p>Cargando clasificación...</p>
            </div>
        `;
    }

    /**
     * Mostrar error
     */
    showError() {
        this.container.innerHTML = `
            <div class="standings-error">
                <p class="error-message">❌ Error al cargar la clasificación</p>
                <p class="error-detail">${this.error}</p>
                <button class="btn-secondary" onclick="window.standingsComponent.loadStandings()">
                    Reintentar
                </button>
            </div>
        `;
    }

    /**
     * Obtener clase según posición
     */
    getPositionClass(position) {
        if (position <= 4) return 'position-champions'; // Champions League
        if (position === 5) return 'position-europa'; // Europa League
        if (position === 6) return 'position-conference'; // Conference League
        if (position >= 18) return 'position-relegation'; // Descenso
        return '';
    }

    /**
     * Renderizar tabla de clasificación
     */
    render() {
        if (!this.standingsData || !this.standingsData.standings) {
            return;
        }

        const standings = this.standingsData.standings[0]; // Total standings
        const table = standings.table;

        const tableHTML = table.map(team => {
            const positionClass = this.getPositionClass(team.position);

            return `
                <tr class="standings-row ${positionClass}" data-team-id="${team.team.id}">
                    <td class="standings-position">
                        <span class="position-number">${team.position}</span>
                    </td>
                    <td class="standings-team">
                        <img src="${team.team.crest}" alt="${team.team.name}" class="team-crest">
                        <span class="team-name">${team.team.name}</span>
                    </td>
                    <td class="standings-stat">${team.playedGames}</td>
                    <td class="standings-stat standings-wins">${team.won}</td>
                    <td class="standings-stat standings-draws">${team.draw}</td>
                    <td class="standings-stat standings-losses">${team.lost}</td>
                    <td class="standings-stat standings-goals">
                        <span class="goals-for">${team.goalsFor}</span>
                        <span class="goals-separator">:</span>
                        <span class="goals-against">${team.goalsAgainst}</span>
                    </td>
                    <td class="standings-stat standings-diff ${team.goalDifference >= 0 ? 'positive' : 'negative'}">
                        ${team.goalDifference > 0 ? '+' : ''}${team.goalDifference}
                    </td>
                    <td class="standings-points">${team.points}</td>
                </tr>
            `;
        }).join('');

        this.container.innerHTML = `
            <div class="standings-table-container">
                <table class="standings-table">
                    <thead>
                        <tr>
                            <th class="th-position">Pos</th>
                            <th class="th-team">Equipo</th>
                            <th class="th-stat" title="Partidos jugados">PJ</th>
                            <th class="th-stat" title="Ganados">G</th>
                            <th class="th-stat" title="Empatados">E</th>
                            <th class="th-stat" title="Perdidos">P</th>
                            <th class="th-stat" title="Goles a favor y en contra">GF:GC</th>
                            <th class="th-stat" title="Diferencia de goles">DG</th>
                            <th class="th-points">Pts</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableHTML}
                    </tbody>
                </table>
            </div>

            <div class="standings-legend">
                <div class="legend-item">
                    <span class="legend-dot position-champions"></span>
                    <span class="legend-text">Champions League</span>
                </div>
                <div class="legend-item">
                    <span class="legend-dot position-europa"></span>
                    <span class="legend-text">Europa League</span>
                </div>
                <div class="legend-item">
                    <span class="legend-dot position-conference"></span>
                    <span class="legend-text">Conference League</span>
                </div>
                <div class="legend-item">
                    <span class="legend-dot position-relegation"></span>
                    <span class="legend-text">Descenso</span>
                </div>
            </div>
        `;

        // Inicializar iconos si están disponibles
        if (typeof initIcons === 'function') {
            initIcons();
        }
    }
}

// Auto-inicialización
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const standingsContainer = document.getElementById('standings-container');
        if (standingsContainer) {
            window.standingsComponent = new StandingsComponent('standings-container');
            window.standingsComponent.init();
        }
    });
}
