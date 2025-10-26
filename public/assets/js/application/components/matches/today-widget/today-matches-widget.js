/**
 * ==================== TODAY MATCHES WIDGET ====================
 * Widget para mostrar partidos de hoy en el sidebar del index
 * Muestra partidos en vivo o próximos del día
 */

class TodayMatchesWidget {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.matches = [];
        this.matchLikes = this.loadLikesFromStorage();
    }

    /**
     * Inicializar el widget
     */
    async init() {
        if (!this.container) {
            console.error('⚠️ Today matches widget container not found');
            return;
        }

        console.log('⚽ Initializing Today Matches Widget');
        await this.loadMatches();
    }

    /**
     * Cargar likes desde localStorage
     */
    loadLikesFromStorage() {
        const stored = localStorage.getItem('matchLikes');
        return stored ? JSON.parse(stored) : {};
    }

    /**
     * Guardar likes en localStorage
     */
    saveLikesToStorage() {
        localStorage.setItem('matchLikes', JSON.stringify(this.matchLikes));
    }

    /**
     * Obtener número de likes de un partido
     */
    getMatchLikes(matchId) {
        return this.matchLikes[matchId] || 0;
    }

    /**
     * Cargar partidos de hoy
     */
    async loadMatches() {
        try {
            const allMatches = [];

            // 1. Obtener partidos en vivo
            const liveData = await window.footballAPI.getLiveMatches();
            if (liveData && liveData.matches && liveData.matches.length > 0) {
                allMatches.push(...liveData.matches);
            }

            // 2. Obtener próximos partidos de hoy (para incluir los que NO están en vivo)
            const allUpcoming = await window.footballAPI.getUpcomingMatches(20);

            if (allUpcoming && allUpcoming.matches) {
                // Filtrar solo partidos de hoy
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const tomorrow = new Date(today);
                tomorrow.setDate(tomorrow.getDate() + 1);

                const todayMatches = allUpcoming.matches.filter(match => {
                    const matchDate = new Date(match.utcDate);
                    return matchDate >= today && matchDate < tomorrow;
                });

                // Agregar solo los partidos que no estén ya en la lista (evitar duplicados)
                todayMatches.forEach(match => {
                    const exists = allMatches.some(m => m.id === match.id);
                    if (!exists) {
                        allMatches.push(match);
                    }
                });
            }

            if (allMatches.length > 0) {
                // Ordenar: primero los en vivo, luego por hora
                this.matches = allMatches.sort((a, b) => {
                    const aIsLive = a.status === 'IN_PLAY' || a.status === 'PAUSED' || a.status === 'HALFTIME';
                    const bIsLive = b.status === 'IN_PLAY' || b.status === 'PAUSED' || b.status === 'HALFTIME';

                    // Primero ordenar por estado (en vivo primero)
                    if (aIsLive && !bIsLive) return -1;
                    if (!aIsLive && bIsLive) return 1;

                    // Si ambos tienen el mismo estado, ordenar por hora
                    return new Date(a.utcDate) - new Date(b.utcDate);
                });

                this.render();
                console.log(`✅ ${this.matches.length} partidos de hoy cargados (${allMatches.filter(m => m.status === 'IN_PLAY').length} en vivo)`);
            } else {
                this.renderNoMatches();
            }

        } catch (error) {
            console.error('❌ Error loading today matches:', error);
            this.renderNoMatches();
        }
    }

    /**
     * Renderizar partidos
     */
    render() {
        const matchesToShow = this.matches.slice(0, 3); // Top 3

        const matchesHTML = matchesToShow.map(match => this.createMatchItem(match)).join('');

        this.container.innerHTML = matchesHTML;

        // Inicializar iconos
        if (typeof initIcons === 'function') {
            initIcons();
        }

        // Setup event listeners
        this.setupLikeListeners();
    }

    /**
     * Obtener ruta del SVG del equipo
     * Usa la utilidad centralizada TeamUtils
     */
    getTeamBadge(teamName) {
        return window.TeamUtils.getTeamBadge(teamName);
    }

    /**
     * Obtener estado del partido en vivo
     */
    getMatchMinute(match) {
        // La API gratuita no proporciona el minuto exacto
        // Solo mostramos el estado del partido

        // Si está en descanso
        if (match.status === 'PAUSED' || match.status === 'HALFTIME') {
            return 'HT';
        }

        // Si está en juego
        if (match.status === 'IN_PLAY') {
            return 'LIVE';
        }

        return null;
    }

    /**
     * Crear item de partido
     */
    createMatchItem(match) {
        const homeTeam = match.homeTeam;
        const awayTeam = match.awayTeam;
        const score = match.score;
        const isLive = match.status === 'IN_PLAY' || match.status === 'PAUSED' || match.status === 'HALFTIME';
        const likes = this.getMatchLikes(match.id);

        const homeBadge = this.getTeamBadge(homeTeam.name);
        const awayBadge = this.getTeamBadge(awayTeam.name);

        let scoreDisplay;
        let minuteDisplay = '';

        if (isLive) {
            scoreDisplay = `${score.fullTime.home || 0}-${score.fullTime.away || 0}`;
            const minute = this.getMatchMinute(match);
            if (minute) {
                minuteDisplay = `<span class="match-minute-widget">${minute}</span>`;
            }
        } else {
            // Mostrar hora
            const matchDate = new Date(match.utcDate);
            scoreDisplay = matchDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
        }

        return `
            <div class="match-item ${isLive ? 'match-live' : ''}">
                <div class="match-teams-compact">
                    <div class="team-with-badge">
                        <img src="${homeBadge}" alt="${homeTeam.name}" class="team-badge-widget" loading="lazy">
                        <span class="team-name-compact">${homeTeam.shortName || homeTeam.tla}</span>
                    </div>
                    <span class="vs-compact">vs</span>
                    <div class="team-with-badge">
                        <img src="${awayBadge}" alt="${awayTeam.name}" class="team-badge-widget" loading="lazy">
                        <span class="team-name-compact">${awayTeam.shortName || awayTeam.tla}</span>
                    </div>
                </div>
                <div class="match-score-likes">
                    <span class="match-score ${isLive ? 'live-score' : ''}">${scoreDisplay}</span>
                    <button class="widget-like-btn" data-match-id="${match.id}">
                        <span class="like-icon" data-icon="like"></span>
                        <span class="like-count">${likes}</span>
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Setup listeners para likes
     */
    setupLikeListeners() {
        const likeButtons = this.container.querySelectorAll('.widget-like-btn');

        likeButtons.forEach(button => {
            const matchId = parseInt(button.dataset.matchId);

            // Marcar como activo si ya tiene likes del usuario
            if (this.hasUserLiked(matchId)) {
                button.classList.add('active');
            }

            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleLike(button, matchId);
            });
        });
    }

    /**
     * Verificar si el usuario dio like
     */
    hasUserLiked(matchId) {
        const userLikes = localStorage.getItem('userMatchLikes');
        if (!userLikes) return false;

        const likes = JSON.parse(userLikes);
        return likes.includes(matchId);
    }

    /**
     * Marcar/desmarcar like del usuario
     */
    toggleUserLike(matchId) {
        let userLikes = localStorage.getItem('userMatchLikes');
        userLikes = userLikes ? JSON.parse(userLikes) : [];

        const index = userLikes.indexOf(matchId);
        if (index > -1) {
            userLikes.splice(index, 1);
        } else {
            userLikes.push(matchId);
        }

        localStorage.setItem('userMatchLikes', JSON.stringify(userLikes));
        return index === -1; // true si se añadió, false si se quitó
    }

    /**
     * Manejar like
     */
    handleLike(button, matchId) {
        const countSpan = button.querySelector('.like-count');
        const wasLiked = this.toggleUserLike(matchId);

        if (wasLiked) {
            // Dar like
            button.classList.add('active');
            this.matchLikes[matchId] = (this.matchLikes[matchId] || 0) + 1;
            countSpan.textContent = this.matchLikes[matchId];

            // Animación
            button.style.animation = 'bounce-in 0.3s ease-out';
        } else {
            // Quitar like
            button.classList.remove('active');
            this.matchLikes[matchId] = Math.max(0, (this.matchLikes[matchId] || 0) - 1);
            countSpan.textContent = this.matchLikes[matchId];
        }

        this.saveLikesToStorage();
        console.log(`Like toggled for match ${matchId}`);
    }

    /**
     * Renderizar cuando no hay partidos
     */
    renderNoMatches() {
        this.container.innerHTML = `
            <div class="no-matches-today">
                <p>No hay partidos programados para hoy</p>
            </div>
        `;
    }
}

// Auto-inicialización
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const todayMatchesContainer = document.getElementById('live-matches');
        if (todayMatchesContainer) {
            window.todayMatchesWidget = new TodayMatchesWidget('live-matches');
            window.todayMatchesWidget.init();
        }
    });
}
