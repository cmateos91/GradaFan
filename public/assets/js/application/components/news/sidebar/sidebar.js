/**
 * ==================== SIDEBAR COMPONENT ====================
 * Gestiona los widgets del sidebar
 * Trending, partidos en vivo, top usuarios
 */

class Sidebar {
    constructor() {
        this.featuredDebatesList = document.getElementById('featured-debates-list');
        this.liveMatches = document.getElementById('live-matches');
        this.topUsersList = document.getElementById('top-users');

        this.init();
    }

    init() {
        // Renderizar debates destacados
        this.renderFeaturedDebates();

        // Renderizar partidos en vivo
        this.renderLiveMatches();

        // Renderizar top usuarios
        this.renderTopUsers();

        console.log('✅ Sidebar initialized');
    }

    renderFeaturedDebates() {
        if (!this.featuredDebatesList) return;

        const featuredDebates = typeof window.DebatesData !== 'undefined'
            ? window.DebatesData.getFeatured().slice(0, 5)
            : [];

        if (featuredDebates.length === 0) {
            this.featuredDebatesList.innerHTML = '<p class="no-debates">No hay debates destacados</p>';
            return;
        }

        const html = featuredDebates.map((debate, index) => `
            <div class="trending-item debate-item-sidebar" data-debate-id="${debate.id}">
                <div class="trending-number">${index + 1}</div>
                <div class="trending-info">
                    <div class="trending-title">${this.truncateText(debate.title, 60)}</div>
                    <div class="trending-stats">
                        💬 ${debate.commentsCount} •
                        👥 ${debate.participantsCount}
                    </div>
                </div>
            </div>
        `).join('');

        this.featuredDebatesList.innerHTML = html;

        // Event listeners
        this.featuredDebatesList.querySelectorAll('.debate-item-sidebar').forEach(item => {
            item.addEventListener('click', () => {
                const debateId = parseInt(item.dataset.debateId);
                window.location.href = `/debate/${debateId}`;
            });
        });
    }

    truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    }

    renderLiveMatches() {
        if (!this.liveMatches) return;

        // Datos de ejemplo mínimos - En producción vendría de la API
        const matches = [];

        const html = matches.map(match => `
            <div class="match-item" data-match-id="${match.id}">
                <div class="match-teams">
                    ${match.homeTeam} vs ${match.awayTeam}
                </div>
                <div class="match-score ${match.isLive ? 'live' : ''}">
                    ${match.score}
                    ${match.isLive ? '<span class="live-indicator">🔴</span>' : ''}
                </div>
            </div>
        `).join('');

        this.liveMatches.innerHTML = html;

        // Event listeners
        this.liveMatches.querySelectorAll('.match-item').forEach(item => {
            item.addEventListener('click', () => {
                const matchId = parseInt(item.dataset.matchId);
                this.handleMatchClick(matchId);
            });
        });
    }

    renderTopUsers() {
        if (!this.topUsersList) return;

        const topUsers = typeof getTopUsers !== 'undefined'
            ? getTopUsers(5)
            : [];

        const html = topUsers.map((user, index) => `
            <div class="user-item" data-user-id="${user.id}">
                <img src="${user.avatar}"
                     alt="${user.username}"
                     class="user-avatar-small">
                <div class="user-info">
                    <div class="user-name">${user.displayName}</div>
                    <div class="user-points-small">${typeof getIcon !== 'undefined' ? getIcon('star', 'inline-icon') : '⭐'} ${this.formatNumber(user.points)}</div>
                </div>
                <div class="user-rank">#${index + 1}</div>
            </div>
        `).join('');

        this.topUsersList.innerHTML = html;

        // Event listeners
        this.topUsersList.querySelectorAll('.user-item').forEach(item => {
            item.addEventListener('click', () => {
                const userId = parseInt(item.dataset.userId);
                this.handleUserClick(userId);
            });
        });
    }

    handleTrendingClick(newsId) {
        console.log('Trending news clicked:', newsId);

        // Disparar evento
        const event = new CustomEvent('trendingClicked', {
            detail: { newsId }
        });
        document.dispatchEvent(event);
    }

    handleMatchClick(matchId) {
        console.log('Match clicked:', matchId);

        // Disparar evento
        const event = new CustomEvent('matchClicked', {
            detail: { matchId }
        });
        document.dispatchEvent(event);
    }

    handleUserClick(userId) {
        console.log('User clicked:', userId);

        // Disparar evento
        const event = new CustomEvent('userClicked', {
            detail: { userId }
        });
        document.dispatchEvent(event);
    }

    formatNumber(num) {
        if (typeof formatNumber !== 'undefined') {
            return formatNumber(num);
        }

        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }
}

// Inicializar
let sidebarComponent = null;

document.addEventListener('DOMContentLoaded', () => {
    sidebarComponent = new Sidebar();
});