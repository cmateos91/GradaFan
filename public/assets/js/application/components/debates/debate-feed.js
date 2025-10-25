class DebateFeed {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.options = {
            limit: options.limit || null,
            category: options.category || null,
            featuredOnly: options.featuredOnly || false,
            showCreateButton: options.showCreateButton !== false
        };

        if (this.container) {
            this.init();
        }
    }

    async init() {
        await this.render();
    }

    async getDebates() {
        // Cargar debates desde Supabase
        // Usar caché service (compartirá request con hero.js)
        const debates = await window.DebatesCacheService.getRecentDebates(this.options.limit || 100);

        // Filtrar por categoría si es necesario
        if (this.options.category) {
            return debates.filter(d => d.category === this.options.category);
        }

        // Filtrar por featured si es necesario
        if (this.options.featuredOnly) {
            return debates.filter(d => d.featured);
        }

        return debates;
    }

    async render() {
        // Mostrar loading skeleton
        this.container.innerHTML = this.createLoadingSkeleton();

        const debates = await this.getDebates();

        let html = '';

        // Botón para crear debate
        if (this.options.showCreateButton) {
            html += `
                <div class="debate-header">
                    <h2>Debates Activos</h2>
                    <button class="btn-primary btn-create-debate" id="btnCreateDebate">
                        <span class="icon">+</span> Crear Debate
                    </button>
                </div>
            `;
        }

        // Grid de debates
        html += '<div class="debates-grid">';

        if (debates.length === 0) {
            html += `
                <div class="empty-state">
                    <p>No hay debates disponibles</p>
                    <button class="btn-primary" id="btnCreateFirstDebate">Crear el primer debate</button>
                </div>
            `;
        } else {
            debates.forEach(debate => {
                html += this.createDebateCard(debate);
            });
        }

        html += '</div>';

        this.container.innerHTML = html;

        // Event listeners
        this.attachEventListeners();

        // Inicializar iconos SVG
        if (typeof initIcons === 'function') {
            initIcons();
        }

        // Inicializar efectos 3D tilt en las tarjetas
        this.initTiltEffect();
    }

    createDebateCard(debate) {

        const externalLinkPreview = debate.externalLink
            ? `
                <div class="debate-external-link">
                    ${debate.externalLink.image
                        ? `<img src="${debate.externalLink.image}" alt="${debate.externalLink.title}" class="debate-link-image">`
                        : `<div class="debate-link-placeholder">
                             <span class="icon-link">🔗</span>
                           </div>`
                    }
                    <div class="debate-link-info">
                        <span class="debate-link-source">${debate.externalLink.source}</span>
                        <p class="debate-link-title">${debate.externalLink.title}</p>
                    </div>
                </div>
            `
            : '';

        const timeAgo = this.getTimeAgo(debate.updatedAt);

        return `
            <article class="debate-card" data-debate-id="${debate.id}" data-tilt>
                <div class="card-inner">
                    <div class="debate-card-header">
                        <div class="debate-author">
                            <img src="${debate.author.avatar}" alt="${debate.author.name}" class="author-avatar" onerror="this.src='/assets/img/default-avatar.svg'">
                            <span class="author-name">${debate.author.name}</span>
                        </div>
                    </div>

                    ${externalLinkPreview}

                    <div class="debate-card-content">
                        <h3 class="debate-title">${debate.title}</h3>
                        <p class="debate-description">${debate.description}</p>
                    </div>

                    <div class="debate-card-footer">
                        <div class="debate-stats">
                            <span class="stat">
                                <span class="icon" data-icon="comment"></span>
                                <span class="stat-value">${debate.commentsCount}</span>
                            </span>
                            <span class="stat">
                                <span class="icon" data-icon="users"></span>
                                <span class="stat-value">${debate.participantsCount}</span>
                            </span>
                            <span class="stat">
                                <span class="icon" data-icon="like"></span>
                                <span class="stat-value">${debate.likes || 0}</span>
                            </span>
                        </div>
                        <button class="btn-debate-enter" data-debate-id="${debate.id}">
                            Entrar al debate →
                        </button>
                    </div>
                </div>
            </article>
        `;
    }

    getTimeAgo(dateString) {
        const now = new Date();
        const date = new Date(dateString);
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Ahora mismo';
        if (diffMins < 60) return `Hace ${diffMins} min`;
        if (diffHours < 24) return `Hace ${diffHours}h`;
        if (diffDays === 1) return 'Ayer';
        if (diffDays < 7) return `Hace ${diffDays} días`;

        return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
    }

    attachEventListeners() {
        // Click en las cards de debate
        const debateCards = this.container.querySelectorAll('.debate-card');
        debateCards.forEach(card => {
            card.addEventListener('click', (e) => {
                // Si no se hizo click en un botón específico
                if (!e.target.closest('.btn-debate-enter')) {
                    const debateId = card.dataset.debateId;
                    this.navigateToDebate(debateId);
                }
            });
        });

        // Click en botones "Entrar al debate"
        const enterButtons = this.container.querySelectorAll('.btn-debate-enter');
        enterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const debateId = btn.dataset.debateId;
                this.navigateToDebate(debateId);
            });
        });

        // Botón crear debate
        const createBtn = document.getElementById('btnCreateDebate');
        if (createBtn) {
            createBtn.addEventListener('click', () => {
                this.openCreateDebateModal();
            });
        }

        const createFirstBtn = document.getElementById('btnCreateFirstDebate');
        if (createFirstBtn) {
            createFirstBtn.addEventListener('click', () => {
                this.openCreateDebateModal();
            });
        }
    }

    navigateToDebate(debateId) {
        window.location.href = `/debate/${debateId}`;
    }

    openCreateDebateModal() {
        // Emitir evento para abrir modal
        if (window.eventBus) {
            window.eventBus.emit('debate:create:open');
        }
        console.log('Abrir modal de crear debate');
        // TODO: Implementar modal en siguiente paso
    }

    // Método para actualizar el feed (útil después de crear un debate)
    refresh() {
        this.render();
    }

    // Inicializar efecto 3D tilt en las tarjetas
    initTiltEffect() {
        if (typeof window.initTiltCards === 'function') {
            window.initTiltCards();
            console.log('✅ Tilt effect initialized on debate cards');
        } else {
            console.warn('⚠️ Tilt cards function not available');
        }
    }

    // Crear skeleton loader mientras cargan los debates
    createLoadingSkeleton() {
        const skeletonCards = Array(3).fill(null).map(() => `
            <article class="debate-card-skeleton">
                <div class="skeleton-header">
                    <div class="skeleton-avatar"></div>
                    <div class="skeleton-author"></div>
                </div>
                <div class="skeleton-content">
                    <div class="skeleton-title"></div>
                    <div class="skeleton-description"></div>
                    <div class="skeleton-description"></div>
                    <div class="skeleton-description"></div>
                </div>
                <div class="skeleton-footer">
                    <div class="skeleton-stats">
                        <div class="skeleton-stat"></div>
                        <div class="skeleton-stat"></div>
                        <div class="skeleton-stat"></div>
                    </div>
                    <div class="skeleton-button"></div>
                </div>
            </article>
        `).join('');

        return `
            <div class="debate-header">
                <h2>Debates Activos</h2>
            </div>
            <div class="debates-grid">
                ${skeletonCards}
            </div>
        `;
    }
}

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.DebateFeed = DebateFeed;
}

// Auto-inicialización
let debateFeedComponent = null;

document.addEventListener('DOMContentLoaded', () => {
    const debatesFeedContainer = document.getElementById('debates-feed');
    if (debatesFeedContainer) {
        debateFeedComponent = new DebateFeed('debates-feed', {
            showCreateButton: true,
            limit: null
        });
        console.log('✅ Debate Feed initialized');
    }
});
