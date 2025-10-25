/**
 * ==================== CHAT MODAL COMPONENT (SSE) ====================
 * Modal flotante de chat en tiempo real con Server-Sent Events
 */

class ChatModal {
    constructor() {
        this.overlay = null;
        this.modal = null;
        this.messagesContainer = null;
        this.inputField = null;
        this.sendButton = null;
        this.floatingButton = null;
        this.closeButton = null;
        this.badge = null;
        this.unreadCount = 0;
        this.isOpen = false;

        // SSE connection
        this.eventSource = null;
        this.isConnected = false;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;

        this.init();
    }

    init() {
        // Crear estructura del modal
        this.createModalStructure();

        // Configurar event listeners
        this.setupEventListeners();

        // Conectar al stream SSE
        this.connectToStream();

        // Sincronizar con chat del hero si existe
        this.syncWithHeroChat();

        console.log('✅ Chat Modal (SSE) initialized');
    }

    /**
     * Sincronizar con el chat del hero (si existe)
     */
    syncWithHeroChat() {
        const heroChat = document.getElementById('hero-chat');
        if (!heroChat) return;

        const heroMessages = heroChat.querySelector('.chat-messages');
        const heroInput = heroChat.querySelector('.chat-input');
        const heroSend = heroChat.querySelector('.chat-send');

        if (!heroMessages || !heroInput || !heroSend) return;

        // Guardar referencia al hero chat
        this.heroMessagesContainer = heroMessages;

        // Conectar input del hero al sistema SSE
        const handleHeroSend = () => {
            const messageText = heroInput.value.trim();
            if (messageText === '') return;

            // Usar el mismo método de envío
            this.sendMessageText(messageText);
            heroInput.value = '';
        };

        heroInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleHeroSend();
            }
        });

        heroSend.addEventListener('click', handleHeroSend);

        console.log('✅ Hero chat sincronizado con SSE');
    }

    /**
     * Crear elemento de mensaje para el hero chat
     */
    createHeroMessageElement(message) {
        const div = document.createElement('div');
        div.className = 'chat-message';
        div.dataset.messageId = message.id;

        const timeStr = this.formatTimestamp(message.timestamp);

        div.innerHTML = `
            <img src="${message.avatar}" alt="${this.escapeHtml(message.username)}" class="message-avatar">
            <div class="message-content">
                <div class="message-header">
                    <span class="message-author">${this.escapeHtml(message.username)}</span>
                    <span class="message-time">${timeStr}</span>
                </div>
                <div class="message-text">${this.escapeHtml(message.message)}</div>
            </div>
        `;

        return div;
    }

    createModalStructure() {
        // Crear botón flotante
        this.floatingButton = document.createElement('button');
        this.floatingButton.className = 'floating-chat-button';
        this.floatingButton.innerHTML = `
            <span class="icon" data-icon="chat"></span>
            <span class="floating-chat-badge" style="display: none;">0</span>
        `;
        document.body.appendChild(this.floatingButton);

        this.badge = this.floatingButton.querySelector('.floating-chat-badge');

        // Crear overlay del modal
        this.overlay = document.createElement('div');
        this.overlay.className = 'chat-modal-overlay';
        this.overlay.innerHTML = `
            <div class="chat-modal">
                <div class="chat-modal-header">
                    <h3 class="chat-modal-title">
                        <span class="icon" data-icon="chat"></span>
                        Chat en Vivo
                        <span class="connection-status" style="font-size: 12px; opacity: 0.7;"></span>
                    </h3>
                    <button class="chat-modal-close">
                        <span class="icon" data-icon="close"></span>
                    </button>
                </div>
                <div class="chat-modal-body" id="modal-chat-messages">
                    <!-- Los mensajes se insertan aquí -->
                </div>
                <div class="chat-modal-footer">
                    <div class="modal-chat-input-wrapper">
                        <input type="text"
                               class="modal-chat-input"
                               placeholder="Escribe un mensaje..."
                               maxlength="500"
                               id="modal-chat-input">
                        <button class="modal-chat-send">
                            <span class="icon" data-icon="send"></span>
                            <span>Enviar</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(this.overlay);

        // Guardar referencias
        this.modal = this.overlay.querySelector('.chat-modal');
        this.messagesContainer = this.overlay.querySelector('.chat-modal-body');
        this.inputField = this.overlay.querySelector('.modal-chat-input');
        this.sendButton = this.overlay.querySelector('.modal-chat-send');
        this.closeButton = this.overlay.querySelector('.chat-modal-close');
        this.connectionStatus = this.overlay.querySelector('.connection-status');

        // Inicializar iconos si están disponibles
        if (typeof initIcons === 'function') {
            initIcons();
        }
    }

    /**
     * Conectar al stream de Server-Sent Events
     */
    connectToStream() {
        try {
            // Cerrar conexión anterior si existe
            if (this.eventSource) {
                this.eventSource.close();
            }

            // Crear nueva conexión SSE
            this.eventSource = new EventSource('/api/chat/stream');

            this.eventSource.onopen = () => {
                this.isConnected = true;
                this.reconnectAttempts = 0;
                console.log('✅ Chat modal conectado al stream');
                this.updateConnectionStatus('Conectado');
            };

            this.eventSource.onmessage = (event) => {
                try {
                    const message = JSON.parse(event.data);
                    this.addMessage(message, true);
                } catch (error) {
                    console.error('Error parseando mensaje:', error);
                }
            };

            this.eventSource.onerror = (error) => {
                console.error('❌ Error en conexión SSE:', error);
                this.isConnected = false;
                this.updateConnectionStatus('Reconectando...');

                // Intentar reconectar
                if (this.reconnectAttempts < this.maxReconnectAttempts) {
                    this.reconnectAttempts++;
                    setTimeout(() => {
                        console.log(`🔄 Reintento ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
                        this.connectToStream();
                    }, 2000 * this.reconnectAttempts); // Backoff exponencial
                } else {
                    this.updateConnectionStatus('Desconectado');
                }
            };

        } catch (error) {
            console.error('Error conectando al stream:', error);
        }
    }

    updateConnectionStatus(status) {
        if (this.connectionStatus) {
            this.connectionStatus.textContent = status;
        }
    }

    setupEventListeners() {
        // Abrir modal con botón flotante
        this.floatingButton.addEventListener('click', () => {
            this.open();
        });

        // Cerrar panel con botón X
        this.closeButton.addEventListener('click', () => {
            this.close();
        });

        // Cerrar con ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });

        // Enviar mensaje con Enter
        this.inputField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Enviar mensaje con botón
        this.sendButton.addEventListener('click', () => {
            this.sendMessage();
        });
    }

    open() {
        this.isOpen = true;
        this.overlay.classList.add('active');
        this.floatingButton.style.display = 'none';

        // Resetear contador de no leídos
        this.unreadCount = 0;
        this.updateBadge();

        // Focus en input
        setTimeout(() => {
            this.inputField.focus();
        }, 300);

        // Scroll al final
        this.scrollToBottom();
    }

    close() {
        this.isOpen = false;
        this.overlay.classList.remove('active');
        this.floatingButton.style.display = 'flex';
    }

    /**
     * Enviar mensaje al servidor (desde el modal)
     */
    async sendMessage() {
        if (!this.inputField) return;

        const messageText = this.inputField.value.trim();

        if (messageText === '') return;

        // Deshabilitar input mientras se envía
        this.inputField.disabled = true;
        if (this.sendButton) this.sendButton.disabled = true;

        try {
            await this.sendMessageText(messageText);
            // Limpiar input
            this.inputField.value = '';
        } finally {
            // Rehabilitar input
            this.inputField.disabled = false;
            if (this.sendButton) this.sendButton.disabled = false;
            this.inputField.focus();
        }
    }

    /**
     * Enviar texto de mensaje al servidor (usado por modal y hero)
     */
    async sendMessageText(messageText) {
        if (!messageText || messageText.trim() === '') return;

        messageText = messageText.trim();

        // Validar longitud
        if (messageText.length > 500) {
            alert('El mensaje es muy largo (máximo 500 caracteres)');
            return;
        }

        try {
            // Obtener datos del usuario
            const userId = this.getCurrentUserId();
            const username = this.getCurrentUsername();
            const avatar = this.getCurrentAvatar();

            const response = await fetch('/api/chat/stream', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId,
                    username,
                    avatar,
                    message: messageText
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Error enviando mensaje');
            }

            const result = await response.json();
            console.log('✅ Mensaje enviado:', result);

        } catch (error) {
            console.error('Error enviando mensaje:', error);
            alert('No se pudo enviar el mensaje. Intenta de nuevo.');
            throw error;
        }
    }

    addMessage(message, incrementUnread = true) {
        // Añadir al modal
        const messageEl = this.createMessageElement(message);
        messageEl.style.animation = 'slideInMessage 0.3s ease-out';

        this.messagesContainer.appendChild(messageEl);

        // Limitar número de mensajes (mantener los últimos 50)
        const messages = this.messagesContainer.querySelectorAll('.modal-chat-message');
        if (messages.length > 50) {
            messages[0].remove();
        }

        // Añadir también al hero chat si existe
        if (this.heroMessagesContainer) {
            const heroMessageEl = this.createHeroMessageElement(message);
            this.heroMessagesContainer.appendChild(heroMessageEl);

            // Limitar mensajes en hero
            const heroMsgs = this.heroMessagesContainer.querySelectorAll('.chat-message');
            if (heroMsgs.length > 50) {
                heroMsgs[0].remove();
            }

            // Auto-scroll en hero
            this.heroMessagesContainer.scrollTop = this.heroMessagesContainer.scrollHeight;
        }

        // Incrementar contador si el modal está cerrado
        if (!this.isOpen && incrementUnread) {
            // Solo incrementar si no es nuestro mensaje
            const currentUserId = this.getCurrentUserId();
            if (message.userId !== currentUserId) {
                this.unreadCount++;
                this.updateBadge();
            }
        }

        // Scroll al final si está abierto
        if (this.isOpen) {
            this.scrollToBottom();
        }
    }

    createMessageElement(message) {
        const wrapper = document.createElement('div');
        wrapper.className = 'modal-chat-message';
        wrapper.dataset.messageId = message.id;

        const timeString = this.formatTimestamp(message.timestamp);

        wrapper.innerHTML = `
            <img src="${message.avatar}"
                 alt="${this.escapeHtml(message.username)}"
                 class="modal-message-avatar">
            <div class="modal-message-content">
                <div class="modal-message-header">
                    <span class="modal-message-author">${this.escapeHtml(message.username)}</span>
                    <span class="modal-message-time">${timeString}</span>
                </div>
                <div class="modal-message-text">${this.escapeHtml(message.message)}</div>
            </div>
        `;

        return wrapper;
    }

    /**
     * Formatear timestamp
     */
    formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = Math.floor((now - date) / 1000); // segundos

        if (diff < 60) return 'Ahora';
        if (diff < 3600) return `Hace ${Math.floor(diff / 60)}min`;
        if (diff < 86400) return `Hace ${Math.floor(diff / 3600)}h`;

        return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    }

    updateBadge() {
        if (this.unreadCount > 0) {
            this.badge.textContent = this.unreadCount > 99 ? '99+' : this.unreadCount;
            this.badge.style.display = 'flex';
        } else {
            this.badge.style.display = 'none';
        }
    }

    scrollToBottom() {
        if (this.messagesContainer) {
            setTimeout(() => {
                this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
            }, 100);
        }
    }

    /**
     * Escapar HTML para prevenir XSS
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Obtener ID del usuario actual
     */
    getCurrentUserId() {
        // TODO: Obtener de Supabase auth
        return sessionStorage.getItem('chatUserId') || this.generateTempUserId();
    }

    /**
     * Obtener nombre del usuario actual
     */
    getCurrentUsername() {
        // TODO: Obtener de Supabase auth
        return sessionStorage.getItem('chatUsername') || 'Anónimo';
    }

    /**
     * Obtener avatar del usuario actual
     */
    getCurrentAvatar() {
        // TODO: Obtener de Supabase auth
        const userId = this.getCurrentUserId();
        return sessionStorage.getItem('chatAvatar') || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`;
    }

    /**
     * Generar ID temporal de usuario
     */
    generateTempUserId() {
        const tempId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        sessionStorage.setItem('chatUserId', tempId);
        return tempId;
    }

    destroy() {
        if (this.eventSource) {
            this.eventSource.close();
            this.eventSource = null;
        }

        if (this.overlay) {
            this.overlay.remove();
        }

        if (this.floatingButton) {
            this.floatingButton.remove();
        }

        this.isConnected = false;
        console.log('💀 Chat Modal destroyed');
    }
}

// Instancia global del chat modal
let chatModal = null;

// Inicializar cuando el DOM esté listo
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        chatModal = new ChatModal();

        // Hacer accesible globalmente
        window.chatModal = chatModal;
    });
}
