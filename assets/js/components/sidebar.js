/**
 * ==================== SIDEBAR COMPONENT ====================
 * Gestiona los widgets del sidebar
 * Trending, partidos en vivo, top usuarios
 */

class Sidebar {
    constructor() {
        this.trendingList = document.getElementById('trending-list');
        this.liveMatches = document.getElementById('live-matches');
        this.topUsersList = document.getElementById('top-users');

        this.init();
    }

    init() {
        // Renderizar trending
        this.renderTrending();

        // Renderizar partidos en vivo
        this.renderLiveMatches();

        // Renderizar top usuarios
        this.renderTopUsers();

        console.log('✅ Sidebar initialized');
    }

    renderTrending() {
        if (!this.trendingList) return;

        const trending = typeof getTrendingNews !== 'undefined'
            ? getTrendingNews(5)
            : [];

        const commentIcon = typeof getIcon !== 'undefined' ? getIcon('comment', 'inline-icon') : '💬';
        const likeIcon = typeof getIcon !== 'undefined' ? getIcon('like', 'inline-icon') : '👍';

        const html = trending.map((news, index) => `
            <div class="trending-item" data-news-id="${news.id}">
                <div class="trending-number">${index + 1}</div>
                <div class="trending-info">
                    <div class="trending-title">${news.title}</div>
                    <div class="trending-stats">
                        ${commentIcon} ${this.formatNumber(news.comments)} •
                        ${likeIcon} ${this.formatNumber(news.likes)}
                    </div>
                </div>
            </div>
        `).join('');

        this.trendingList.innerHTML = html;

        // Event listeners
        this.trendingList.querySelectorAll('.trending-item').forEach(item => {
            item.addEventListener('click', () => {
                const newsId = parseInt(item.dataset.newsId);
                this.handleTrendingClick(newsId);
            });
        });
    }

    renderLiveMatches() {
        if (!this.liveMatches) return;

        // Datos de ejemplo de partidos en vivo
        const matches = [
            {
                id: 1,
                homeTeam: 'Real Madrid',
                awayTeam: 'Barcelona',
                score: '3-1',
                minute: '85',
                isLive: true
            },
            {
                id: 2,
                homeTeam: 'Atlético',
                awayTeam: 'Sevilla',
                score: '2-2',
                minute: '78',
                isLive: true
            },
            {
                id: 3,
                homeTeam: 'Valencia',
                awayTeam: 'Betis',
                score: '1-0',
                minute: 'HT',
                isLive: false
            }
        ];

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