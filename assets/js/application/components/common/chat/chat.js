/**
 * ==================== CHAT COMPONENT ====================
 * Sistema de chat en vivo
 * Mensajes simulados en tiempo real
 */

class LiveChat {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.messagesContainer = null;
        this.inputField = null;
        this.sendButton = null;
        this.messages = [];
        this.isActive = false;
        this.messageInterval = null;

        this.init();
    }

    init() {
        if (!this.container) return;

        // Obtener elementos del DOM
        this.messagesContainer = this.container.querySelector('.chat-messages');
        this.inputField = this.container.querySelector('.chat-input');
        this.sendButton = this.container.querySelector('.chat-send');

        if (!this.messagesContainer) return;

        // Cargar mensajes iniciales
        this.loadInitialMessages();

        // Configurar event listeners
        this.setupEventListeners();

        // Iniciar simulación de mensajes
        this.startMessageSimulation();

        this.isActive = true;
        console.log('✅ Live Chat initialized');
    }

    loadInitialMessages() {
        // Obtener mensajes de ejemplo del data
        const initialMessages = typeof getRecentChatMessages !== 'undefined'
            ? getRecentChatMessages(5)
            : [];

        initialMessages.reverse().forEach(msg => {
            this.addMessage(msg, false);
        });

        // Scroll al final
        this.scrollToBottom();
    }

    setupEventListeners() {
        // Enviar mensaje con Enter
        if (this.inputField) {
            this.inputField.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendMessage();
                }
            });
        }

        // Enviar mensaje con botón
        if (this.sendButton) {
            this.sendButton.addEventListener('click', () => {
                this.sendMessage();
            });
        }
    }

    sendMessage() {
        if (!this.inputField) return;

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
        this.addMessage(message, true);

        // Limpiar input
        this.inputField.value = '';

        // Scroll al final
        this.scrollToBottom();
    }

    addMessage(message, animate = true) {
        const messageEl = this.createMessageElement(message);

        if (animate) {
            messageEl.classList.add('chat-message');
        }

        this.messagesContainer.appendChild(messageEl);

        // Limitar número de mensajes (mantener los últimos 50)
        const messages = this.messagesContainer.querySelectorAll('.chat-message, .message-wrapper');
        if (messages.length > 50) {
            messages[0].remove();
        }

        this.messages.push(message);
    }

    createMessageElement(message) {
        const wrapper = document.createElement('div');
        wrapper.className = 'chat-message';

        const timeString = typeof formatMessageTime !== 'undefined'
            ? formatMessageTime(message.timestamp)
            : 'Ahora';

        wrapper.innerHTML = `
            <img src="${message.avatar}"
                 alt="${message.username}"
                 class="message-avatar">
            <div class="message-content">
                <div class="message-header">
                    <span class="message-author">${message.username}</span>
                    <span class="message-time">${timeString}</span>
                </div>
                <div class="message-text">${this.escapeHtml(message.message)}</div>
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
            this.addMessage(newMessage, true);
            this.scrollToBottom();
        }
    }

    scrollToBottom() {
        if (this.messagesContainer) {
            this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
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
        this.isActive = false;
    }
}

// Inicializar chats
let heroChat = null;

document.addEventListener('DOMContentLoaded', () => {
    heroChat = new LiveChat('hero-chat');
});