/**
 * ==================== TEAM NEXT MATCH WIDGET ====================
 * Widget del próximo partido del equipo
 */

class TeamNextMatchWidget {
    constructor() {
        this.container = document.getElementById('next-match-widget');
        this.teamData = window.TEAM_DATA;

        this.init();
    }

    async init() {
        if (!this.container || !this.teamData) {
            console.error('⚠️ Team next match widget container or team data not found');
            return;
        }

        await this.loadNextMatch();
    }

    async loadNextMatch() {
        try {
            // Obtener próximos partidos
            const response = await window.footballAPI.getUpcomingMatches(50);
            const matches = response.matches;

            // Encontrar el próximo partido del equipo
            const nextMatch = matches.find(match =>
                match.homeTeam.id === this.teamData.apiId ||
                match.awayTeam.id === this.teamData.apiId
            );

            if (!nextMatch) {
                this.showEmpty('No hay próximos partidos programados');
                return;
            }

            this.render(nextMatch);

        } catch (error) {
            console.error('Error loading next match:', error);
            this.showError('Error al cargar el próximo partido');
        }
    }

    render(match) {
        const matchDate = new Date(match.utcDate);
        const formattedDate = matchDate.toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'short'
        });
        const formattedTime = matchDate.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit'
        });

        const isHome = match.homeTeam.id === this.teamData.apiId;
        const opponent = isHome ? match.awayTeam : match.homeTeam;
        const venue = isHome ? 'Local' : 'Visitante';

        const html = `
            <div class="next-match-card">
                <div class="match-date">${formattedDate} • ${formattedTime}</div>
                <div class="match-teams-with-badges">
                    <div class="match-team-item">
                        <img src="${match.homeTeam.crest}" alt="${match.homeTeam.name}" class="match-team-badge">
                        <div class="team-name">${match.homeTeam.shortName}</div>
                    </div>
                    <div class="vs">VS</div>
                    <div class="match-team-item">
                        <img src="${match.awayTeam.crest}" alt="${match.awayTeam.name}" class="match-team-badge">
                        <div class="team-name">${match.awayTeam.shortName}</div>
                    </div>
                </div>
                <div class="match-venue">${venue}</div>
                ${match.competition.name ? `<div class="match-competition">${match.competition.name}</div>` : ''}
            </div>
        `;

        this.container.innerHTML = html;
    }

    showEmpty(message) {
        this.container.innerHTML = `
            <div class="widget-empty">
                <p>${message}</p>
            </div>
        `;
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
        new TeamNextMatchWidget();
    });
}
