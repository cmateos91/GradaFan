/**
 * ==================== HERO ROTATOR ====================
 * Sistema de rotación automática de las top 3 debates en el hero
 * AHORA CARGA DATOS DESDE SUPABASE
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
    async init() {
        if (!this.heroContent) {
            console.error('⚠️ Hero content not found');
            return;
        }

        // Mostrar skeleton loader
        this.showLoadingSkeleton();

        // Cargar top 3 debates desde caché (optimizado - 1 request en lugar de 2)
        console.log('🔄 Loading top debates from cache...');
        this.topNews = await window.DebatesCacheService.getTopDebates(3);

        if (this.topNews.length === 0) {
            console.error('⚠️ No debates found for hero');
            this.showEmptyState();
            return;
        }

        console.log('✅ Hero Rotator initialized with', this.topNews.length, 'debates from Supabase');

        // Generar dots dinámicamente según número de debates
        this.generateDots();

        // Mostrar primer debate
        this.showNews(0);

        // Setup navigation dots
        this.setupDots();

        // Solo iniciar rotación si hay más de un debate
        if (this.topNews.length > 1) {
            this.startAutoRotate();
            this.setupHoverPause();
        }
    }

    /**
     * Mostrar estado vacío si no hay debates
     */
    showEmptyState() {
        this.heroTitle.textContent = 'No hay debates disponibles';
        this.metaTeam.textContent = 'GradaFan';
        this.metaTime.textContent = 'Ahora';
        this.metaAuthor.textContent = 'Crea el primer debate';
        this.statComments.textContent = '0';
        this.statLikes.textContent = '0';
        this.statTrending.textContent = 'Sin debates';
    }

    /**
     * Mostrar noticia específica
     */
    showNews(index, isUserAction = false) {
        if (this.isTransitioning) return;

        this.isTransitioning = true;
        const debate = this.topNews[index];

        // Fade out
        this.heroContent.style.opacity = '0';
        this.heroContent.style.transform = 'translateY(20px)';

        setTimeout(() => {
            // Remover skeleton loader si existe
            this.removeLoadingSkeleton();

            // Actualizar contenido con datos del debate
            this.heroTitle.textContent = debate.title;
            this.metaTeam.textContent = debate.category || 'Debate';

            // Formatear tiempo (debates usan createdAt/updatedAt)
            const timeAgo = this.formatTimeAgo(debate.updatedAt || debate.createdAt);
            this.metaTime.textContent = timeAgo;

            this.metaAuthor.textContent = `Por @${debate.author.name.replace(' ', '')}`;
            this.statComments.textContent = debate.commentsCount || 0;
            this.statLikes.textContent = debate.likes || 0;
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
     * Formatear tiempo transcurrido
     */
    formatTimeAgo(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return 'Hace menos de 1 minuto';
        if (diffInSeconds < 3600) {
            const minutes = Math.floor(diffInSeconds / 60);
            return `Hace ${minutes} minuto${minutes > 1 ? 's' : ''}`;
        }
        if (diffInSeconds < 86400) {
            const hours = Math.floor(diffInSeconds / 3600);
            return `Hace ${hours} hora${hours > 1 ? 's' : ''}`;
        }
        const days = Math.floor(diffInSeconds / 86400);
        return `Hace ${days} día${days > 1 ? 's' : ''}`;
    }

    /**
     * Generar dots dinámicamente según número de noticias
     */
    generateDots() {
        const dotsContainer = document.querySelector('.hero-nav-dots');
        if (!dotsContainer) return;

        // Limpiar dots existentes
        dotsContainer.innerHTML = '';

        // Crear un dot por cada noticia
        this.topNews.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.className = 'dot';
            if (index === 0) dot.classList.add('active');
            dot.dataset.index = index;
            dotsContainer.appendChild(dot);
        });

        // Actualizar referencia a dots
        this.dots = document.querySelectorAll('.hero-nav-dots .dot');
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
     * Mostrar skeleton loader mientras carga
     */
    showLoadingSkeleton() {
        // Agregar clase de loading al título
        if (this.heroTitle) {
            this.heroTitle.textContent = '';
            this.heroTitle.classList.add('hero-skeleton-title');
        }

        // Agregar clase de loading a los meta items
        if (this.metaTeam) this.metaTeam.classList.add('hero-skeleton-meta-item');
        if (this.metaTime) this.metaTime.classList.add('hero-skeleton-meta-item');
        if (this.metaAuthor) this.metaAuthor.classList.add('hero-skeleton-meta-item');

        // Ocultar texto de los meta items
        if (this.metaTeam) this.metaTeam.textContent = '';
        if (this.metaTime) this.metaTime.textContent = '';
        if (this.metaAuthor) this.metaAuthor.textContent = '';

        // Agregar clase de loading a las estadísticas
        if (this.statComments) {
            this.statComments.textContent = '';
            this.statComments.classList.add('hero-skeleton-stat');
        }
        if (this.statLikes) {
            this.statLikes.textContent = '';
            this.statLikes.classList.add('hero-skeleton-stat');
        }
        if (this.statTrending) {
            this.statTrending.textContent = '';
            this.statTrending.classList.add('hero-skeleton-stat');
        }
    }

    /**
     * Remover skeleton loader
     */
    removeLoadingSkeleton() {
        // Remover clases de skeleton
        if (this.heroTitle) this.heroTitle.classList.remove('hero-skeleton-title');
        if (this.metaTeam) this.metaTeam.classList.remove('hero-skeleton-meta-item');
        if (this.metaTime) this.metaTime.classList.remove('hero-skeleton-meta-item');
        if (this.metaAuthor) this.metaAuthor.classList.remove('hero-skeleton-meta-item');
        if (this.statComments) this.statComments.classList.remove('hero-skeleton-stat');
        if (this.statLikes) this.statLikes.classList.remove('hero-skeleton-stat');
        if (this.statTrending) this.statTrending.classList.remove('hero-skeleton-stat');
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
    document.addEventListener('DOMContentLoaded', async () => {
        // Esperar a que Supabase esté listo antes de inicializar
        if (window.supabaseReady) {
            await window.supabaseReady;
        }

        window.heroRotator = new HeroRotator();
        await window.heroRotator.init();
    });
}
