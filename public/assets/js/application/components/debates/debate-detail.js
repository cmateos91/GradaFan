class DebateDetail {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.debateId = this.getDebateIdFromURL();
        this.debate = null;
        this.currentUser = {
            id: 1,
            name: "Usuario Actual",
            avatar: "/assets/img/avatar1.jpg"
        };

        if (this.container && this.debateId) {
            this.init();
        } else if (!this.debateId) {
            this.showError('No se especificó un debate');
        }
    }

    getDebateIdFromURL() {
        // Try to get ID from path first (Astro dynamic route: /debate/1)
        const pathParts = window.location.pathname.split('/');
        const idFromPath = pathParts[pathParts.length - 1];

        // If we have a valid ID from path, use it
        if (idFromPath && idFromPath !== 'debate') {
            return idFromPath;
        }

        // Fallback to query params for backwards compatibility
        const params = new URLSearchParams(window.location.search);
        return params.get('id');
    }

    init() {
        this.loadDebate();
    }

    loadDebate() {
        this.debate = window.DebatesData.getById(this.debateId);

        if (!this.debate) {
            this.showError('Debate no encontrado');
            return;
        }

        this.render();
    }

    render() {
        const html = `
            <div class="debate-detail">
                ${this.renderBackButton()}
                ${this.renderDebateHeader()}
                ${this.renderExternalLink()}
                ${this.renderDebateContent()}
                ${this.renderDebateStats()}
                ${this.renderCommentForm()}
                ${this.renderComments()}
            </div>
        `;

        this.container.innerHTML = html;
        this.attachEventListeners();
    }

    renderBackButton() {
        return `
            <div class="debate-back">
                <a href="/" class="btn-back">
                    ← Volver a debates
                </a>
            </div>
        `;
    }

    renderDebateHeader() {
        const categoryBadge = this.debate.category === 'noticias'
            ? '<span class="debate-badge debate-badge-news">Noticia</span>'
            : '<span class="debate-badge debate-badge-debate">Debate</span>';

        const featuredBadge = this.debate.featured
            ? '<span class="debate-badge debate-badge-featured">Destacado</span>'
            : '';

        return `
            <div class="debate-detail-header">
                <div class="debate-badges">
                    ${categoryBadge}
                    ${featuredBadge}
                </div>
                <h1 class="debate-detail-title">${this.debate.title}</h1>
                <p class="debate-detail-description">${this.debate.description}</p>
                <div class="debate-meta">
                    <div class="debate-author-info">
                        <img src="${this.debate.author.avatar}" alt="${this.debate.author.name}" class="author-avatar-large" onerror="this.src='/assets/img/default-avatar.svg'">
                        <div>
                            <div class="author-name-large">${this.debate.author.name}</div>
                            <div class="debate-date">Creado ${this.getTimeAgo(this.debate.createdAt)}</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderExternalLink() {
        if (!this.debate.externalLink) return '';

        return `
            <div class="debate-external-link-detail">
                ${this.debate.externalLink.image
                    ? `<img src="${this.debate.externalLink.image}" alt="${this.debate.externalLink.title}" class="debate-link-image-large">`
                    : `<div class="debate-link-placeholder-large">
                         <span class="icon-link-large">🔗</span>
                       </div>`
                }
                <div class="debate-link-content">
                    <span class="debate-link-source-large">${this.debate.externalLink.source}</span>
                    <h3 class="debate-link-title-large">${this.debate.externalLink.title}</h3>
                    <p class="debate-link-preview">${this.debate.externalLink.preview}</p>
                    <a href="${this.debate.externalLink.url}" target="_blank" rel="noopener noreferrer" class="btn-visit-link">
                        Visitar enlace original →
                    </a>
                </div>
            </div>
        `;
    }

    renderDebateContent() {
        return `
            <div class="debate-content-section">
                <h2 class="section-title-debate">Debate</h2>
                <div class="debate-discussion-intro">
                    <p>Participa en la conversación sobre este tema. Comparte tu opinión y lee lo que otros tienen que decir.</p>
                </div>
            </div>
        `;
    }

    renderDebateStats() {
        return `
            <div class="debate-stats-detail">
                <div class="stat-item-detail">
                    <span class="stat-icon-detail">💬</span>
                    <div>
                        <div class="stat-value-detail">${this.debate.commentsCount}</div>
                        <div class="stat-label-detail">Comentarios</div>
                    </div>
                </div>
                <div class="stat-item-detail">
                    <span class="stat-icon-detail">👥</span>
                    <div>
                        <div class="stat-value-detail">${this.debate.participantsCount}</div>
                        <div class="stat-label-detail">Participantes</div>
                    </div>
                </div>
                <div class="stat-item-detail">
                    <span class="stat-icon-detail">🕐</span>
                    <div>
                        <div class="stat-value-detail">${this.getTimeAgo(this.debate.updatedAt)}</div>
                        <div class="stat-label-detail">Última actividad</div>
                    </div>
                </div>
            </div>
        `;
    }

    renderCommentForm() {
        return `
            <div class="comment-form-section">
                <h3 class="comment-form-title">Añadir comentario</h3>
                <form class="comment-form" id="commentForm">
                    <div class="comment-input-wrapper">
                        <img src="${this.currentUser.avatar}" alt="${this.currentUser.name}" class="comment-user-avatar" onerror="this.src='/assets/img/default-avatar.svg'">
                        <textarea
                            id="commentText"
                            class="comment-textarea"
                            placeholder="Escribe tu comentario..."
                            rows="3"
                            required
                        ></textarea>
                    </div>
                    <div class="comment-form-actions">
                        <button type="submit" class="btn-submit-comment">
                            Publicar comentario
                        </button>
                    </div>
                </form>
            </div>
        `;
    }

    renderComments() {
        if (this.debate.comments.length === 0) {
            return `
                <div class="comments-section">
                    <h3 class="comments-title">Comentarios (0)</h3>
                    <div class="no-comments">
                        <p>Sé el primero en comentar este debate</p>
                    </div>
                </div>
            `;
        }

        return `
            <div class="comments-section">
                <h3 class="comments-title">Comentarios (${this.debate.commentsCount})</h3>
                <div class="comments-list">
                    ${this.debate.comments.map(comment => this.renderComment(comment)).join('')}
                </div>
            </div>
        `;
    }

    renderComment(comment) {
        const hasReplies = comment.replies && comment.replies.length > 0;

        return `
            <div class="comment-item" data-comment-id="${comment.id}">
                <div class="comment-avatar">
                    <img src="${comment.userAvatar}" alt="${comment.userName}" onerror="this.src='/assets/img/default-avatar.svg'">
                </div>
                <div class="comment-content">
                    <div class="comment-header">
                        <span class="comment-author">${comment.userName}</span>
                        <span class="comment-time">${this.getTimeAgo(comment.createdAt)}</span>
                    </div>
                    <p class="comment-text">${comment.text}</p>
                    <div class="comment-actions">
                        <button class="comment-action-btn btn-like-comment" data-comment-id="${comment.id}">
                            <span class="icon-like-small">👍</span>
                            <span class="like-count-small">${comment.likes}</span>
                        </button>
                        <button class="comment-action-btn btn-reply-comment" data-comment-id="${comment.id}">
                            <span class="icon-reply-small">↩️</span>
                            Responder
                        </button>
                    </div>
                    ${hasReplies ? this.renderReplies(comment.replies) : ''}
                </div>
            </div>
        `;
    }

    renderReplies(replies) {
        return `
            <div class="comment-replies">
                ${replies.map(reply => `
                    <div class="comment-reply" data-comment-id="${reply.id}">
                        <div class="comment-avatar">
                            <img src="${reply.userAvatar}" alt="${reply.userName}" onerror="this.src='/assets/img/default-avatar.svg'">
                        </div>
                        <div class="comment-content">
                            <div class="comment-header">
                                <span class="comment-author">${reply.userName}</span>
                                <span class="comment-time">${this.getTimeAgo(reply.createdAt)}</span>
                            </div>
                            <p class="comment-text">${reply.text}</p>
                            <div class="comment-actions">
                                <button class="comment-action-btn btn-like-comment" data-comment-id="${reply.id}">
                                    <span class="icon-like-small">👍</span>
                                    <span class="like-count-small">${reply.likes}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    attachEventListeners() {
        // Form de comentario
        const commentForm = document.getElementById('commentForm');
        if (commentForm) {
            commentForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleCommentSubmit();
            });
        }

        // Botones de like
        const likeButtons = this.container.querySelectorAll('.btn-like-comment');
        likeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.handleLikeComment(btn);
            });
        });

        // Botones de responder
        const replyButtons = this.container.querySelectorAll('.btn-reply-comment');
        replyButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.handleReplyComment(btn);
            });
        });
    }

    handleCommentSubmit() {
        const textarea = document.getElementById('commentText');
        const text = textarea.value.trim();

        if (!text) return;

        const newComment = window.DebatesData.addComment(this.debateId, {
            userId: this.currentUser.id,
            userName: this.currentUser.name,
            userAvatar: this.currentUser.avatar,
            text: text
        });

        if (newComment) {
            // Recargar el debate actualizado
            this.debate = window.DebatesData.getById(this.debateId);
            this.render();

            // Scroll al nuevo comentario
            setTimeout(() => {
                const commentsSection = this.container.querySelector('.comments-section');
                if (commentsSection) {
                    commentsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            }, 100);
        }
    }

    handleLikeComment(button) {
        const likeCount = button.querySelector('.like-count-small');
        const currentCount = parseInt(likeCount.textContent);

        if (button.classList.contains('liked')) {
            button.classList.remove('liked');
            likeCount.textContent = currentCount - 1;
        } else {
            button.classList.add('liked');
            likeCount.textContent = currentCount + 1;
            button.style.animation = 'bounce-in 0.3s ease-out';
        }
    }

    handleReplyComment(button) {
        const commentId = button.dataset.commentId;
        console.log('Responder al comentario:', commentId);
        // TODO: Implementar formulario de respuesta inline
        alert('Funcionalidad de respuesta en desarrollo');
    }

    getTimeAgo(dateString) {
        const now = new Date();
        const date = new Date(dateString);
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'ahora mismo';
        if (diffMins < 60) return `hace ${diffMins} min`;
        if (diffHours < 24) return `hace ${diffHours}h`;
        if (diffDays === 1) return 'ayer';
        if (diffDays < 7) return `hace ${diffDays} días`;

        return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
    }

    showError(message) {
        this.container.innerHTML = `
            <div class="debate-error">
                <h2>Error</h2>
                <p>${message}</p>
                <a href="index.html" class="btn-primary">Volver al inicio</a>
            </div>
        `;
    }
}

// Auto-inicialización
let debateDetailComponent = null;

document.addEventListener('DOMContentLoaded', () => {
    const debateDetailContainer = document.getElementById('debate-detail-container');
    if (debateDetailContainer) {
        debateDetailComponent = new DebateDetail('debate-detail-container');
        console.log('✅ Debate Detail initialized');
    }
});

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.DebateDetail = DebateDetail;
}
