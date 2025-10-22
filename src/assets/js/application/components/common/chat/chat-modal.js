/**
 * ==================== CHAT MODAL COMPONENT ====================
 * Modal flotante de chat compartido entre todas las páginas
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
        this.messages = [];
        this.unreadCount = 0;
        this.isOpen = false;
        this.messageInterval = null;

        this.init();
    }

    init() {
        // Crear estructura del modal
        this.createModalStructure();

        // Configurar event listeners
        this.setupEventListeners();

        // Cargar mensajes iniciales
        this.loadInitialMessages();

        // Iniciar simulación de mensajes
        this.startMessageSimulation();

        console.log('✅ Chat Modal initialized');
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

        // Inicializar iconos si están disponibles
        if (typeof initIcons === 'function') {
            initIcons();
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
            if (e.key === 'Enter') {
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

    loadInitialMessages() {
        // Obtener mensajes de ejemplo del data
        const initialMessages = typeof getRecentChatMessages !== 'undefined'
            ? getRecentChatMessages(10)
            : [];

        initialMessages.reverse().forEach(msg => {
            this.addMessage(msg, false, false);
        });

        // Scroll al final
        this.scrollToBottom();
    }

    sendMessage() {
        const messageText = this.inputField.value.trim();

        if (messageText === '') return;

        // Crear mensaje del usuario actual
        const message = {
            id: Date.now(),
            userId: 1,
            username: 'Tú',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CurrentUser',
            message: messageText,
            timestamp: new Date(),
            likes: 0,
            teamId: 1
        };

        // Añadir mensaje
        this.addMessage(message, true, false);

        // Limpiar input
        this.inputField.value = '';

        // Scroll al final
        this.scrollToBottom();
    }

    addMessage(message, animate = true, incrementUnread = true) {
        const messageEl = this.createMessageElement(message);

        if (animate) {
            messageEl.style.animation = 'slideInMessage 0.3s ease-out';
        }

        this.messagesContainer.appendChild(messageEl);

        // Limitar número de mensajes (mantener los últimos 50)
        const messages = this.messagesContainer.querySelectorAll('.modal-chat-message');
        if (messages.length > 50) {
            messages[0].remove();
        }

        this.messages.push(message);

        // Incrementar contador si el modal está cerrado
        if (!this.isOpen && incrementUnread && message.username !== 'Tú') {
            this.unreadCount++;
            this.updateBadge();
        }

        // Scroll al final si está abierto
        if (this.isOpen) {
            this.scrollToBottom();
        }
    }

    createMessageElement(message) {
        const wrapper = document.createElement('div');
        wrapper.className = 'modal-chat-message';

        const timeString = typeof formatMessageTime !== 'undefined'
            ? formatMessageTime(message.timestamp)
            : 'Ahora';

        wrapper.innerHTML = `
            <img src="${message.avatar}"
                 alt="${message.username}"
                 class="modal-message-avatar">
            <div class="modal-message-content">
                <div class="modal-message-header">
                    <span class="modal-message-author">${message.username}</span>
                    <span class="modal-message-time">${timeString}</span>
                </div>
                <div class="modal-message-text">${this.escapeHtml(message.message)}</div>
            </div>
        `;

        return wrapper;
    }

    startMessageSimulation() {
        // Simular nuevos mensajes cada 5-15 segundos
        this.messageInterval = setInterval(() => {
            if (Math.random() > 0.3) { // 70% de probabilidad
                this.simulateNewMessage();
            }
        }, Math.random() * 10000 + 5000);
    }

    simulateNewMessage() {
        const newMessage = typeof generateRandomChatMessage !== 'undefined'
            ? generateRandomChatMessage()
            : null;

        if (newMessage) {
            this.addMessage(newMessage, true, true);
        }
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

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    destroy() {
        if (this.messageInterval) {
            clearInterval(this.messageInterval);
        }

        if (this.overlay) {
            this.overlay.remove();
        }

        if (this.floatingButton) {
            this.floatingButton.remove();
        }
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
