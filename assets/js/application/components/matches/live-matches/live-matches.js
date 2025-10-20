/**
 * ==================== LIVE MATCHES COMPONENT ====================
 * Componente para mostrar partidos de LaLiga en vivo
 */

class LiveMatches {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.matches = [];
        this.isLoading = false;
        this.error = null;
        this.updateInterval = null;
    }

    /**
     * Inicializar el componente
     */
    async init() {
        if (!this.container) {
            console.error('⚠️ Live matches container not found');
            return;
        }

        console.log('⚽ Initializing Live Matches Component');

        // Cargar partidos iniciales
        await this.loadMatches();

        // Actualizar cada 60 segundos
        this.startAutoUpdate();
    }

    /**
     * Cargar partidos en vivo
     */
    async loadMatches() {
        if (this.isLoading) return;

        this.isLoading = true;

        try {
            const data = await window.footballAPI.getLiveMatches();

            if (data && data.matches) {
                this.matches = data.matches;
                this.error = null;
                this.render();
                console.log(`✅ ${this.matches.length} partidos en vivo cargados`);
            } else {
                this.matches = [];
                this.renderNoMatches();
            }

        } catch (error) {
            console.error('❌ Error loading live matches:', error);
            this.error = error.message;
            this.showError();
        } finally {
            this.isLoading = false;
        }
    }

    /**
     * Iniciar actualización automática
     */
    startAutoUpdate() {
        // Actualizar cada 60 segundos
        this.updateInterval = setInterval(() => {
            console.log('🔄 Actualizando partidos en vivo...');
            this.loadMatches();
        }, 60000); // 60 segundos
    }

    /**
     * Detener actualización automática
     */
    stopAutoUpdate() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }

    /**
     * Renderizar partidos
     */
    render() {
        if (this.matches.length === 0) {
            this.renderNoMatches();
            return;
        }

        const matchesHTML = this.matches.map(match => this.createMatchCard(match)).join('');

        this.container.innerHTML = `
            <div class="live-matches-header">
                <h3 class="live-matches-title">
                    <span class="live-indicator"></span>
                    Partidos en Vivo
                </h3>
                <span class="live-count">${this.matches.length} ${this.matches.length === 1 ? 'partido' : 'partidos'}</span>
            </div>
            <div class="live-matches-grid">
                ${matchesHTML}
            </div>
        `;
    }

    /**
     * Crear tarjeta de partido
     */
    createMatchCard(match) {
        const homeTeam = match.homeTeam;
        const awayTeam = match.awayTeam;
        const score = match.score;
        const status = this.getMatchStatus(match);

        // Solo mostrar estado si está en descanso
        const showStatus = match.status === 'PAUSED' || match.status === 'HALFTIME';

        return `
            <div class="live-match-card" data-match-id="${match.id}">
                ${showStatus ? `
                <div class="match-status-bar">
                    <span class="match-status">${status}</span>
                </div>
                ` : ''}

                <div class="match-teams">
                    <div class="match-team match-home">
                        <img src="${homeTeam.crest}" alt="${homeTeam.name}" class="team-crest-live">
                        <span class="team-name-live">${homeTeam.shortName || homeTeam.name}</span>
                        <span class="team-score">${score.fullTime.home !== null ? score.fullTime.home : 0}</span>
                    </div>

                    <div class="match-separator">
                        <span class="vs-text">VS</span>
                    </div>

                    <div class="match-team match-away">
                        <span class="team-score">${score.fullTime.away !== null ? score.fullTime.away : 0}</span>
                        <span class="team-name-live">${awayTeam.shortName || awayTeam.name}</span>
                        <img src="${awayTeam.crest}" alt="${awayTeam.name}" class="team-crest-live">
                    </div>
                </div>

                ${this.renderMatchStats(match)}
            </div>
        `;
    }

    /**
     * Renderizar estadísticas del partido
     */
    renderMatchStats(match) {
        // La API puede no incluir stats detalladas en tiempo real
        // Por ahora mostramos info básica
        return `
            <div class="match-info">
                <span class="match-competition">LaLiga EA Sports</span>
                <span class="match-date">${this.formatMatchDate(match.utcDate)}</span>
            </div>
        `;
    }

    /**
     * Obtener estado del partido
     */
    getMatchStatus(match) {
        const status = match.status;

        switch(status) {
            case 'IN_PLAY':
                return 'En Juego';
            case 'PAUSED':
                return 'Descanso';
            case 'HALFTIME':
                return 'Medio Tiempo';
            default:
                return status;
        }
    }

    /**
     * Obtener minuto del partido
     */
    getMatchMinute(match) {
        // La API gratuita no proporciona el minuto exacto
        // Solo mostramos el estado del partido

        // Si está en descanso
        if (match.status === 'PAUSED' || match.status === 'HALFTIME') {
            return 'DESCANSO';
        }

        // Si está en juego
        if (match.status === 'IN_PLAY') {
            return 'EN VIVO';
        }

        // Fallback
        return 'EN JUEGO';
    }

    /**
     * Formatear fecha del partido
     */
    formatMatchDate(dateString) {
        const date = new Date(dateString);
        const today = new Date();

        if (date.toDateString() === today.toDateString()) {
            return 'Hoy';
        }

        return date.toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'short'
        });
    }

    /**
     * Renderizar cuando no hay partidos
     */
    renderNoMatches() {
        this.container.innerHTML = `
            <div class="no-live-matches">
                <div class="no-matches-icon">⚽</div>
                <h3>No hay partidos en vivo</h3>
                <p>Los partidos aparecerán aquí cuando comiencen</p>
            </div>
        `;
    }

    /**
     * Mostrar error
     */
    showError() {
        this.container.innerHTML = `
            <div class="live-matches-error">
                <p class="error-message">❌ Error al cargar partidos en vivo</p>
                <p class="error-detail">${this.error}</p>
                <button class="btn-secondary" onclick="window.liveMatchesComponent.loadMatches()">
                    Reintentar
                </button>
            </div>
        `;
    }

    /**
     * Destruir componente
     */
    destroy() {
        this.stopAutoUpdate();
    }
}

// Auto-inicialización
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const liveMatchesContainer = document.getElementById('live-matches-container');
        if (liveMatchesContainer) {
            window.liveMatchesComponent = new LiveMatches('live-matches-container');
            window.liveMatchesComponent.init();
        }
    });
}
