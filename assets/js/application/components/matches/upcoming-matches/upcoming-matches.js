/**
 * ==================== UPCOMING MATCHES COMPONENT ====================
 * Componente para mostrar próximos partidos de LaLiga
 */

class UpcomingMatches {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.matches = [];
        this.isLoading = false;
        this.error = null;
    }

    /**
     * Inicializar el componente
     */
    async init() {
        if (!this.container) {
            console.error('⚠️ Upcoming matches container not found');
            return;
        }

        console.log('📅 Initializing Upcoming Matches Component');
        await this.loadMatches();
    }

    /**
     * Cargar próximos partidos
     */
    async loadMatches() {
        if (this.isLoading) return;

        this.isLoading = true;
        this.showLoading();

        try {
            const data = await window.footballAPI.getUpcomingMatches(10);

            if (data && data.matches) {
                this.matches = data.matches;
                this.error = null;
                this.render();
                console.log(`✅ ${this.matches.length} próximos partidos cargados`);
            } else {
                this.matches = [];
                this.renderNoMatches();
            }

        } catch (error) {
            console.error('❌ Error loading upcoming matches:', error);
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
            <div class="upcoming-loading">
                <div class="loading-spinner"></div>
                <p>Cargando próximos partidos...</p>
            </div>
        `;
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
            <div class="upcoming-matches-grid">
                ${matchesHTML}
            </div>
        `;

        // Inicializar iconos
        if (typeof initIcons === 'function') {
            initIcons();
        }

        // Setup event listeners para likes y comentarios
        this.setupActionListeners();
    }

    /**
     * Configurar listeners para acciones
     */
    setupActionListeners() {
        const actionButtons = this.container.querySelectorAll('.upcoming-action-btn');

        actionButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const action = button.dataset.action;
                const matchId = button.dataset.matchId;

                if (action === 'like') {
                    this.handleLike(button, matchId);
                } else if (action === 'comment') {
                    this.handleComment(matchId);
                }
            });
        });
    }

    /**
     * Manejar like
     */
    handleLike(button, matchId) {
        const countSpan = button.querySelector('.action-count');
        const currentCount = parseInt(countSpan.textContent);

        if (button.classList.contains('active')) {
            // Quitar like
            button.classList.remove('active');
            countSpan.textContent = currentCount - 1;
        } else {
            // Dar like
            button.classList.add('active');
            countSpan.textContent = currentCount + 1;

            // Animación
            button.style.animation = 'none';
            setTimeout(() => {
                button.style.animation = 'bounce-in 0.3s ease-out';
            }, 10);
        }

        console.log(`Like toggled for match ${matchId}`);
    }

    /**
     * Manejar comentario
     */
    handleComment(matchId) {
        console.log(`Open comments for match ${matchId}`);
        // Aquí se podría abrir un modal de comentarios
        alert('Funcionalidad de comentarios próximamente');
    }

    /**
     * Crear tarjeta de partido
     */
    createMatchCard(match) {
        const homeTeam = match.homeTeam;
        const awayTeam = match.awayTeam;
        const matchDate = new Date(match.utcDate);
        const dateInfo = this.getDateInfo(matchDate);
        const stadium = match.venue || null;

        return `
            <div class="upcoming-match-card" data-match-id="${match.id}">
                <div class="upcoming-date-badge">
                    <span class="upcoming-day">${dateInfo.day}</span>
                    <span class="upcoming-month">${dateInfo.month}</span>
                </div>

                <div class="upcoming-match-header">
                    <span class="upcoming-time">${dateInfo.time}</span>
                    ${stadium ? `<span class="upcoming-stadium">${stadium}</span>` : ''}
                </div>

                <div class="upcoming-teams-container">
                    <div class="upcoming-team-centered">
                        <img src="${homeTeam.crest}" alt="${homeTeam.name}" class="upcoming-crest">
                        <span class="upcoming-team-name">${homeTeam.shortName || homeTeam.name}</span>
                    </div>

                    <div class="upcoming-vs-centered">
                        <span class="vs-label">VS</span>
                    </div>

                    <div class="upcoming-team-centered">
                        <img src="${awayTeam.crest}" alt="${awayTeam.name}" class="upcoming-crest">
                        <span class="upcoming-team-name">${awayTeam.shortName || awayTeam.name}</span>
                    </div>
                </div>

                <div class="upcoming-info">
                    <span class="upcoming-competition">LaLiga EA Sports</span>
                </div>

                <div class="upcoming-actions">
                    <button class="upcoming-action-btn" data-action="like" data-match-id="${match.id}">
                        <span class="action-icon" data-icon="like"></span>
                        <span class="action-count">0</span>
                    </button>
                    <button class="upcoming-action-btn" data-action="comment" data-match-id="${match.id}">
                        <span class="action-icon" data-icon="comment"></span>
                        <span class="action-count">0</span>
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Obtener información de fecha
     */
    getDateInfo(date) {
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);

        let dayText;
        if (date.toDateString() === now.toDateString()) {
            dayText = 'Hoy';
        } else if (date.toDateString() === tomorrow.toDateString()) {
            dayText = 'Mañana';
        } else {
            dayText = date.toLocaleDateString('es-ES', { weekday: 'short' });
        }

        return {
            day: dayText,
            month: date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }),
            time: date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
            weekday: date.toLocaleDateString('es-ES', { weekday: 'long' })
        };
    }

    /**
     * Renderizar cuando no hay partidos
     */
    renderNoMatches() {
        this.container.innerHTML = `
            <div class="no-upcoming-matches">
                <div class="no-matches-icon">📅</div>
                <h3>No hay próximos partidos programados</h3>
                <p>Vuelve más tarde para ver el calendario actualizado</p>
            </div>
        `;
    }

    /**
     * Mostrar error
     */
    showError() {
        this.container.innerHTML = `
            <div class="upcoming-matches-error">
                <p class="error-message">❌ Error al cargar próximos partidos</p>
                <p class="error-detail">${this.error}</p>
                <button class="btn-secondary" onclick="window.upcomingMatchesComponent.loadMatches()">
                    Reintentar
                </button>
            </div>
        `;
    }
}

// Auto-inicialización
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const upcomingMatchesContainer = document.getElementById('upcoming-matches-container');
        if (upcomingMatchesContainer) {
            window.upcomingMatchesComponent = new UpcomingMatches('upcoming-matches-container');
            window.upcomingMatchesComponent.init();
        }
    });
}
