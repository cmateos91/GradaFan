/**
 * ==================== NEWS FEED COMPONENT ====================
 * Renderiza y gestiona el feed de noticias
 * Filtros, paginación y 3D cards
 */

class NewsFeed {
    constructor() {
        this.feedContainer = document.getElementById('news-grid');
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.loadMoreButton = document.getElementById('load-more');
        this.currentFilter = 'all';
        this.currentPage = 1;
        this.itemsPerPage = 6;
        this.allNews = [];

        this.init();
    }

    init() {
        if (!this.feedContainer) return;

        // Cargar datos de noticias
        this.allNews = typeof getAllNews !== 'undefined' ? getAllNews(50) : [];

        // Renderizar noticias iniciales
        this.renderNews();

        // Configurar filtros
        this.setupFilters();

        // Configurar botón load more
        this.setupLoadMore();

        console.log('✅ News Feed initialized');
    }

    setupFilters() {
        this.filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remover active de todos
                this.filterButtons.forEach(b => b.classList.remove('active'));

                // Añadir active al clickeado
                btn.classList.add('active');

                // Actualizar filtro
                this.currentFilter = btn.dataset.filter;
                this.currentPage = 1;

                // Re-renderizar
                this.feedContainer.innerHTML = '';
                this.renderNews();
            });
        });
    }

    setupLoadMore() {
        if (this.loadMoreButton) {
            this.loadMoreButton.addEventListener('click', () => {
                this.currentPage++;
                this.renderNews(true);
            });
        }
    }

    getFilteredNews() {
        let filtered = [...this.allNews];

        switch (this.currentFilter) {
            case 'trending':
                filtered = filtered.filter(news => news.trending);
                break;
            case 'myteam':
                filtered = filtered.filter(news => news.teamId === 1); // Real Madrid por defecto
                break;
            case 'live':
                filtered = filtered.filter(news => news.breaking);
                break;
            default:
                // 'all' - no filter
                break;
        }

        return filtered;
    }

    renderNews(append = false) {
        const filtered = this.getFilteredNews();
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        const newsToShow = filtered.slice(start, end);

        if (!append) {
            this.feedContainer.innerHTML = '';
        }

        newsToShow.forEach((news, index) => {
            const newsCard = this.createNewsCard(news);
            this.feedContainer.appendChild(newsCard);

            // Inicializar 3D tilt para la nueva tarjeta (si está disponible)
            if (typeof tiltCardsManager !== 'undefined' && tiltCardsManager) {
                setTimeout(() => {
                    tiltCardsManager.addCard(newsCard);
                }, 50);
            }
        });

        // Mostrar/ocultar botón load more
        if (this.loadMoreButton) {
            if (end >= filtered.length) {
                this.loadMoreButton.style.display = 'none';
            } else {
                this.loadMoreButton.style.display = 'inline-flex';
            }
        }
    }

    createNewsCard(news) {
        const card = document.createElement('article');
        card.className = 'news-card reveal-scale';
        card.dataset.newsId = news.id;
        card.dataset.tilt = ''; // Añadir atributo data-tilt para efecto 3D

        const timeAgo = typeof formatRelativeTime !== 'undefined'
            ? formatRelativeTime(news.date)
            : 'Reciente';

        const commentsFormatted = typeof formatNumber !== 'undefined'
            ? formatNumber(news.comments)
            : news.comments;

        const likesFormatted = typeof formatNumber !== 'undefined'
            ? formatNumber(news.likes)
            : news.likes;

        card.innerHTML = `
            <div class="news-card-inner">
                <div class="news-card-image">
                    <img src="${news.image}"
                         alt="${news.title}"
                         loading="lazy">
                    <div class="news-card-overlay"></div>
                </div>

                <div class="news-card-content">
                    <span class="news-card-category">${news.category}</span>

                    <h3 class="news-card-title">${news.title}</h3>

                    <div class="news-card-meta">
                        <span>${timeAgo}</span>
                        <span>•</span>
                        <span>${news.author}</span>
                    </div>

                    <div class="news-card-stats">
                        <div class="news-stat">
                            <span class="news-stat-icon">${typeof getIcon !== 'undefined' ? getIcon('comment', 'inline-icon') : '💬'}</span>
                            <span class="news-stat-value">${commentsFormatted}</span>
                        </div>
                        <div class="news-stat">
                            <span class="news-stat-icon">${typeof getIcon !== 'undefined' ? getIcon('like', 'inline-icon') : '👍'}</span>
                            <span class="news-stat-value">${likesFormatted}</span>
                        </div>
                    </div>
                </div>

                <div class="news-card-shine"></div>
            </div>
        `;

        // Event listener para click
        card.addEventListener('click', () => {
            this.handleNewsClick(news);
        });

        // Reveal animation
        setTimeout(() => {
            card.classList.add('is-visible');
        }, 100);

        return card;
    }

    handleNewsClick(news) {
        console.log('News clicked:', news.title);

        // Disparar evento personalizado
        const event = new CustomEvent('newsClicked', {
            detail: { news }
        });
        document.dispatchEvent(event);

        // Aquí iría la navegación a la página de detalle
        // Por ahora solo mostramos en consola
    }
}

// Inicializar
let newsFeedComponent = null;

document.addEventListener('DOMContentLoaded', () => {
    newsFeedComponent = new NewsFeed();
});