/**
 * ==================== HERO ROTATOR ====================
 * Sistema de rotación automática de las top 3 noticias en el hero
 */

class HeroRotator {
    constructor() {
        this.heroContent = document.querySelector('.hero-news-content');
        this.heroTitle = document.querySelector('.hero-title');
        this.metaTeam = document.querySelector('.meta-team');
        this.metaTime = document.querySelector('.meta-time');
        this.metaAuthor = document.querySelector('.meta-author');
        this.statComments = document.querySelector('.hero-stats .stat-item:nth-child(1) .stat-value');
        this.statLikes = document.querySelector('.hero-stats .stat-item:nth-child(2) .stat-value');
        this.statTrending = document.querySelector('.trending-position');
        this.dots = document.querySelectorAll('.hero-nav-dots .dot');

        this.topNews = [];
        this.currentIndex = 0;
        this.autoRotateInterval = null;
        this.rotationDelay = 5000; // 5 segundos entre rotaciones
        this.transitionDuration = 300; // Duración de la transición
        this.isTransitioning = false;
        this.isPaused = false;
    }

    /**
     * Inicializar el hero rotator
     */
    init() {
        if (!this.heroContent) {
            console.error('⚠️ Hero content not found');
            return;
        }

        // Obtener top 3 noticias
        this.topNews = getTop3NewsByLikes();

        if (this.topNews.length === 0) {
            console.error('⚠️ No news found for hero');
            return;
        }

        console.log('📰 Hero Rotator initialized with', this.topNews.length, 'news items');

        // Mostrar primera noticia
        this.showNews(0);

        // Setup navigation dots
        this.setupDots();

        // Iniciar rotación automática
        this.startAutoRotate();

        // Pausar rotación en hover
        this.setupHoverPause();
    }

    /**
     * Mostrar noticia específica
     */
    showNews(index, isUserAction = false) {
        if (this.isTransitioning) return;

        this.isTransitioning = true;
        const news = this.topNews[index];

        // Fade out
        this.heroContent.style.opacity = '0';
        this.heroContent.style.transform = 'translateY(20px)';

        setTimeout(() => {
            // Actualizar contenido
            this.heroTitle.textContent = news.title;
            this.metaTeam.textContent = news.team;
            this.metaTime.textContent = formatRelativeTime(news.date);
            this.metaAuthor.textContent = `Por @${news.author.replace(' ', '')}`;
            this.statComments.textContent = formatNumber(news.comments);
            this.statLikes.textContent = formatNumber(news.likes);
            this.statTrending.textContent = `Trending #${index + 1}`;

            // Actualizar dots
            this.updateDots(index);

            // Fade in
            this.heroContent.style.opacity = '1';
            this.heroContent.style.transform = 'translateY(0)';

            this.currentIndex = index;
            this.isTransitioning = false;

            // Si es una acción del usuario, reiniciar el timer
            if (isUserAction) {
                this.resetAutoRotate();
            }
        }, this.transitionDuration);
    }

    /**
     * Setup navigation dots
     */
    setupDots() {
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                this.showNews(index, true);
            });
        });
    }

    /**
     * Actualizar estado de los dots
     */
    updateDots(activeIndex) {
        this.dots.forEach((dot, index) => {
            if (index === activeIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    /**
     * Iniciar rotación automática
     */
    startAutoRotate() {
        this.autoRotateInterval = setInterval(() => {
            const nextIndex = (this.currentIndex + 1) % this.topNews.length;
            this.showNews(nextIndex);
        }, this.rotationDelay);
    }

    /**
     * Detener rotación automática
     */
    stopAutoRotate() {
        if (this.autoRotateInterval) {
            clearInterval(this.autoRotateInterval);
            this.autoRotateInterval = null;
        }
    }

    /**
     * Reiniciar rotación automática
     */
    resetAutoRotate() {
        this.stopAutoRotate();
        this.startAutoRotate();
    }

    /**
     * Pausar rotación en hover
     */
    setupHoverPause() {
        const heroMain = document.querySelector('.hero-main');

        if (heroMain) {
            heroMain.addEventListener('mouseenter', () => {
                this.isPaused = true;
                this.stopAutoRotate();
            });

            heroMain.addEventListener('mouseleave', () => {
                this.isPaused = false;
                this.resetAutoRotate();
            });
        }
    }

    /**
     * Destruir el rotator (cleanup)
     */
    destroy() {
        this.stopAutoRotate();
        this.dots.forEach(dot => {
            dot.replaceWith(dot.cloneNode(true));
        });
    }
}

// Auto-inicialización
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        window.heroRotator = new HeroRotator();
        window.heroRotator.init();
    });
}
