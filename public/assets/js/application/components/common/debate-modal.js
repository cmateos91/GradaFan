/**
 * Debate Modal Component
 * Modal para crear nuevos debates
 */

class DebateModal {
    constructor() {
        this.modal = null;
        this.isOpen = false;
        this.init();
    }

    init() {
        // Crear el modal en el DOM
        this.createModal();

        // Event listeners
        this.attachEventListeners();

        // Escuchar eventos globales para abrir el modal
        if (window.eventBus) {
            window.eventBus.on('debate:create:open', () => this.open());
        }
    }

    createModal() {
        const modalHTML = `
            <div class="modal-overlay" id="debateModalOverlay">
                <div class="modal-container debate-modal">
                    <div class="modal-header">
                        <h2>Crear Nuevo Debate</h2>
                        <button class="modal-close" id="debateModalClose" aria-label="Cerrar modal">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M18 6L6 18M6 6l12 12"/>
                            </svg>
                        </button>
                    </div>

                    <form class="modal-body" id="debateForm">
                        <div class="form-group">
                            <label for="debateTitle">Título del debate *</label>
                            <input
                                type="text"
                                id="debateTitle"
                                name="title"
                                class="form-input"
                                placeholder="¿Quién ganará LaLiga esta temporada?"
                                required
                                maxlength="200"
                            >
                            <div class="form-hint">Máximo 200 caracteres</div>
                        </div>

                        <div class="form-group">
                            <label for="debateDescription">Descripción (opcional)</label>
                            <textarea
                                id="debateDescription"
                                name="description"
                                class="form-textarea"
                                placeholder="Comparte más detalles sobre tu debate..."
                                rows="4"
                                maxlength="1000"
                            ></textarea>
                            <div class="form-hint">Máximo 1000 caracteres</div>
                        </div>

                        <div class="form-group">
                            <label for="debateCategory">Categoría</label>
                            <select id="debateCategory" name="category" class="form-select">
                                <option value="debates">General</option>
                                <option value="predicciones">Predicciones</option>
                                <option value="analisis">Análisis</option>
                                <option value="rumores">Rumores y Fichajes</option>
                            </select>
                        </div>

                        <div class="form-error" id="debateFormError" style="display: none;">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="10"/>
                                <path d="M12 8v4m0 4h.01"/>
                            </svg>
                            <span id="debateFormErrorMessage"></span>
                        </div>

                        <div class="modal-actions">
                            <button type="button" class="btn-secondary" id="debateCancelBtn">
                                Cancelar
                            </button>
                            <button type="submit" class="btn-primary" id="debateSubmitBtn">
                                <span class="btn-text">Crear Debate</span>
                                <span class="btn-loading" style="display: none;">
                                    <svg class="spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <circle cx="12" cy="12" r="10" opacity="0.25"/>
                                        <path d="M12 2a10 10 0 0 1 10 10" opacity="0.75"/>
                                    </svg>
                                    Creando...
                                </span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        // Insertar el modal al final del body
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        this.modal = document.getElementById('debateModalOverlay');
    }

    attachEventListeners() {
        // Cerrar modal
        const closeBtn = document.getElementById('debateModalClose');
        const cancelBtn = document.getElementById('debateCancelBtn');
        const overlay = document.getElementById('debateModalOverlay');

        closeBtn?.addEventListener('click', () => this.close());
        cancelBtn?.addEventListener('click', () => this.close());

        overlay?.addEventListener('click', (e) => {
            if (e.target === overlay) {
                this.close();
            }
        });

        // Submit form
        const form = document.getElementById('debateForm');
        form?.addEventListener('submit', (e) => this.handleSubmit(e));

        // Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
    }

    async handleSubmit(e) {
        e.preventDefault();

        // Verificar si el usuario está autenticado
        const currentUser = window.AuthService?.currentUser;
        if (!currentUser) {
            this.showError('Debes iniciar sesión para crear un debate');
            // Abrir modal de login
            if (window.eventBus) {
                window.eventBus.emit('auth:login:open');
            }
            return;
        }

        // Obtener datos del formulario
        const formData = new FormData(e.target);
        const title = formData.get('title').trim();
        const description = formData.get('description').trim();
        const category = formData.get('category');

        // Validación
        if (!title) {
            this.showError('El título es obligatorio');
            return;
        }

        if (title.length > 200) {
            this.showError('El título no puede superar los 200 caracteres');
            return;
        }

        if (description.length > 1000) {
            this.showError('La descripción no puede superar los 1000 caracteres');
            return;
        }

        // Deshabilitar botón y mostrar loading
        this.setLoading(true);
        this.hideError();

        try {
            // Crear el debate usando DebatesService
            const newDebate = await window.DebatesService.createDebate({
                title: title,
                description: description || null,
                category: category,
                authorId: currentUser.id
            });

            if (!newDebate) {
                throw new Error('No se pudo crear el debate');
            }

            console.log('✅ Debate creado:', newDebate);

            // Invalidar cache para que se recarguen los debates
            if (window.DebatesCacheService) {
                window.DebatesCacheService.invalidateCache();
            }

            // Cerrar modal
            this.close();

            // Resetear formulario
            e.target.reset();

            // Refrescar el feed si existe
            if (window.debateFeedComponent) {
                window.debateFeedComponent.refresh();
            }

            // Mostrar notificación de éxito
            this.showSuccessNotification('Debate creado exitosamente');

            // Redirigir al debate creado
            setTimeout(() => {
                window.location.href = `/debate/${newDebate.id}`;
            }, 1000);

        } catch (error) {
            console.error('Error al crear debate:', error);
            this.showError(error.message || 'Error al crear el debate. Inténtalo de nuevo.');
            this.setLoading(false);
        }
    }

    open() {
        // Verificar autenticación antes de abrir
        const currentUser = window.AuthService?.currentUser;
        if (!currentUser) {
            // Mostrar modal de login
            if (window.eventBus) {
                window.eventBus.emit('auth:login:open');
            }
            return;
        }

        this.modal.classList.add('active');
        this.isOpen = true;
        document.body.style.overflow = 'hidden';

        // Focus en el primer input
        setTimeout(() => {
            document.getElementById('debateTitle')?.focus();
        }, 100);
    }

    close() {
        this.modal.classList.remove('active');
        this.isOpen = false;
        document.body.style.overflow = '';
        this.hideError();
        this.setLoading(false);
    }

    setLoading(loading) {
        const submitBtn = document.getElementById('debateSubmitBtn');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');

        if (loading) {
            submitBtn.disabled = true;
            btnText.style.display = 'none';
            btnLoading.style.display = 'flex';
        } else {
            submitBtn.disabled = false;
            btnText.style.display = 'block';
            btnLoading.style.display = 'none';
        }
    }

    showError(message) {
        const errorDiv = document.getElementById('debateFormError');
        const errorMessage = document.getElementById('debateFormErrorMessage');

        if (errorDiv && errorMessage) {
            errorMessage.textContent = message;
            errorDiv.style.display = 'flex';
        }
    }

    hideError() {
        const errorDiv = document.getElementById('debateFormError');
        if (errorDiv) {
            errorDiv.style.display = 'none';
        }
    }

    showSuccessNotification(message) {
        // Simple notification (puedes mejorarla después)
        const notification = document.createElement('div');
        notification.className = 'success-notification';
        notification.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 6L9 17l-5-5"/>
            </svg>
            <span>${message}</span>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.DebateModal = DebateModal;
}

// Auto-inicialización
document.addEventListener('DOMContentLoaded', () => {
    new DebateModal();
    console.log('✅ Debate Modal initialized');
});
