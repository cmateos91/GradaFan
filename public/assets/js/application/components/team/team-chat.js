/**
 * ==================== TEAM CHAT COMPONENT ====================
 * Chat exclusivo para aficionados del equipo
 * Solo usuarios con este equipo como favorito pueden participar
 */

class TeamChat {
    constructor() {
        this.container = document.getElementById('team-chat-container');
        this.teamData = window.TEAM_DATA;
        this.messagesContainer = null;
        this.inputField = null;
        this.sendButton = null;
        this.accessDeniedEl = null;

        // SSE connection
        this.eventSource = null;
        this.isConnected = false;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;

        // User data
        this.currentUser = null;
        this.hasAccess = false;

        this.init();
    }

    async init() {
        if (!this.container || !this.teamData) {
            console.error('⚠️ Team chat container or team data not found');
            return;
        }

        // Esperar a que AuthService esté listo
        await this.waitForAuthService();

        // Verificar acceso del usuario
        await this.checkUserAccess();

        // Renderizar interfaz
        this.render();

        console.log('✅ Team Chat initialized for', this.teamData.name);
    }

    async waitForAuthService() {
        let attempts = 0;
        const maxAttempts = 50;

        while (attempts < maxAttempts) {
            if (window.AuthService) {
                await window.AuthService.waitUntilReady();
                this.currentUser = window.AuthService.currentUser;
                return;
            }
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }
    }

    /**
     * Verificar si el usuario tiene acceso al chat del equipo
     */
    async checkUserAccess() {
        // Si no hay usuario autenticado, no tiene acceso
        if (!window.AuthService || !window.AuthService.isAuthenticated || !window.AuthService.currentUser) {
            this.hasAccess = false;
            this.userTeamName = null;
            console.log('❌ Usuario no autenticado - Sin acceso al chat del equipo');
            return;
        }

        this.currentUser = window.AuthService.currentUser;

        // Verificar que el equipo favorito del usuario coincida
        const userTeamId = this.currentUser.favorite_team_id || this.currentUser.favoriteTeamId;

        if (!userTeamId) {
            this.hasAccess = false;
            this.userTeamName = 'ningún equipo';
            console.log('❌ Usuario sin equipo favorito - Sin acceso al chat');
            return;
        }

        // Obtener el nombre del equipo del usuario desde Supabase
        if (userTeamId) {
            try {
                const { data: teamData } = await window.supabase
                    .from('teams')
                    .select('name')
                    .eq('id', userTeamId)
                    .single();

                this.userTeamName = teamData?.name || 'equipo desconocido';
            } catch (error) {
                console.error('Error obteniendo nombre del equipo:', error);
                this.userTeamName = 'equipo desconocido';
            }
        }

        if (String(userTeamId) === String(this.teamData.id)) {
            this.hasAccess = true;
            console.log(`✅ Usuario tiene acceso al chat del ${this.teamData.name}`);
        } else {
            this.hasAccess = false;
            console.log(`❌ Usuario NO es aficionado del ${this.teamData.name} - Sin acceso`);
            console.log(`El equipo del usuario es: ${this.userTeamName} (ID: ${userTeamId})`);
        }
    }

    /**
     * Renderizar la interfaz del chat
     */
    render() {
        if (!this.hasAccess) {
            this.renderAccessDenied();
            return;
        }

        // Renderizar chat normal
        this.container.innerHTML = `
            <div class="team-chat-box">
                <div class="team-chat-messages" id="team-chat-messages">
                    <!-- Messages will be populated here -->
                </div>
                <div class="team-chat-input-wrapper">
                    <input type="text"
                           class="team-chat-input"
                           placeholder="Escribe un mensaje para tus compañeros..."
                           maxlength="500"
                           id="team-chat-input">
                    <button class="team-chat-send" id="team-chat-send">
                        <span class="icon" data-icon="send"></span>
                        <span>Enviar</span>
                    </button>
                </div>
            </div>
        `;

        // Guardar referencias
        this.messagesContainer = document.getElementById('team-chat-messages');
        this.inputField = document.getElementById('team-chat-input');
        this.sendButton = document.getElementById('team-chat-send');

        // Setup event listeners
        this.setupEventListeners();

        // Conectar al stream SSE
        this.connectToStream();

        // Inicializar iconos
        if (typeof initIcons === 'function') {
            initIcons();
        }
    }

    /**
     * Renderizar mensaje de acceso denegado
     */
    renderAccessDenied() {
        const isAuthenticated = window.AuthService && window.AuthService.isAuthenticated;
        const userTeam = this.userTeamName || 'ningún equipo';

        this.container.innerHTML = `
            <div class="team-chat-access-denied">
                <div class="access-denied-icon">🔒</div>
                <h3>Chat Exclusivo del ${this.teamData.name}</h3>
                <p class="access-denied-message">
                    ${isAuthenticated
                        ? `Este chat es exclusivo para aficionados del ${this.teamData.name}.<br>
                           Tu equipo favorito es <strong>${userTeam}</strong>.`
                        : `Debes iniciar sesión y seleccionar al ${this.teamData.name} como tu equipo favorito para acceder a este chat.`
                    }
                </p>
                ${!isAuthenticated
                    ? '<button class="btn-primary" onclick="document.querySelector(\'.login-btn\')?.click()">Iniciar Sesión</button>'
                    : `<p class="access-denied-hint">Solo puedes acceder al chat de <strong>${userTeam}</strong>.</p>`
                }
            </div>
        `;
    }

    /**
     * Conectar al stream de Server-Sent Events
     */
    connectToStream() {
        if (!this.hasAccess) return;

        try {
            // Cerrar conexión anterior si existe
            if (this.eventSource) {
                this.eventSource.close();
            }

            // Crear nueva conexión SSE
            const streamUrl = `/api/chat/team/${this.teamData.id}/stream`;
            this.eventSource = new EventSource(streamUrl);

            this.eventSource.onopen = () => {
                this.isConnected = true;
                this.reconnectAttempts = 0;
                console.log(`✅ Conectado al chat del ${this.teamData.name}`);
            };

            this.eventSource.onmessage = (event) => {
                try {
                    const message = JSON.parse(event.data);
                    this.addMessage(message);
                } catch (error) {
                    console.error('Error parseando mensaje:', error);
                }
            };

            this.eventSource.onerror = (error) => {
                console.error('❌ Error en conexión SSE del team chat:', error);
                this.isConnected = false;

                // Intentar reconectar
                if (this.reconnectAttempts < this.maxReconnectAttempts) {
                    this.reconnectAttempts++;
                    setTimeout(() => {
                        console.log(`🔄 Reintento ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
                        this.connectToStream();
                    }, 2000 * this.reconnectAttempts);
                }
            };

        } catch (error) {
            console.error('Error conectando al stream del team:', error);
        }
    }

    setupEventListeners() {
        // Enviar mensaje con Enter
        if (this.inputField) {
            this.inputField.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
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

    /**
     * Enviar mensaje al servidor
     */
    async sendMessage() {
        if (!this.inputField || !this.hasAccess) return;

        const messageText = this.inputField.value.trim();

        if (messageText === '') return;

        // Validar longitud
        if (messageText.length > 500) {
            alert('El mensaje es muy largo (máximo 500 caracteres)');
            return;
        }

        // Deshabilitar input mientras se envía
        this.inputField.disabled = true;
        if (this.sendButton) this.sendButton.disabled = true;

        try {
            const userTeamId = this.currentUser.favorite_team_id || this.currentUser.favoriteTeamId;

            const response = await fetch(`/api/chat/team/${this.teamData.id}/stream`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: this.currentUser.id,
                    username: this.currentUser.username || this.currentUser.display_name,
                    avatar: this.currentUser.avatar_url || this.currentUser.avatarUrl,
                    message: messageText,
                    userTeamId: userTeamId
                })
            });

            if (!response.ok) {
                const error = await response.json();

                if (error.code === 'TEAM_MISMATCH') {
                    alert(error.error);
                    // Recargar la página para mostrar el mensaje de acceso denegado
                    window.location.reload();
                    return;
                }

                throw new Error(error.error || 'Error enviando mensaje');
            }

            // Limpiar input
            this.inputField.value = '';

        } catch (error) {
            console.error('Error enviando mensaje:', error);
            alert('No se pudo enviar el mensaje. Intenta de nuevo.');
        } finally {
            // Rehabilitar input
            this.inputField.disabled = false;
            if (this.sendButton) this.sendButton.disabled = false;
            this.inputField.focus();
        }
    }

    /**
     * Añadir mensaje al chat
     */
    addMessage(message) {
        if (!this.messagesContainer) return;

        const messageEl = this.createMessageElement(message);
        this.messagesContainer.appendChild(messageEl);

        // Limitar número de mensajes (mantener los últimos 50)
        const messages = this.messagesContainer.querySelectorAll('.team-chat-message');
        if (messages.length > 50) {
            messages[0].remove();
        }

        // Scroll al final
        this.scrollToBottom();
    }

    /**
     * Crear elemento de mensaje
     */
    createMessageElement(message) {
        const wrapper = document.createElement('div');
        wrapper.className = 'team-chat-message';
        wrapper.dataset.messageId = message.id;

        // Marcar mensajes propios
        const isOwnMessage = this.currentUser && message.userId === this.currentUser.id;
        if (isOwnMessage) {
            wrapper.classList.add('own-message');
        }

        const timeString = this.formatTimestamp(message.timestamp);

        wrapper.innerHTML = `
            <img src="${this.escapeHtml(message.avatar)}"
                 alt="${this.escapeHtml(message.username)}"
                 class="team-message-avatar">
            <div class="team-message-content">
                <div class="team-message-header">
                    <span class="team-message-author">${this.escapeHtml(message.username)}</span>
                    <span class="team-message-time">${timeString}</span>
                </div>
                <div class="team-message-text">${this.escapeHtml(message.message)}</div>
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
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    destroy() {
        if (this.eventSource) {
            this.eventSource.close();
            this.eventSource = null;
        }
        this.isConnected = false;
        console.log('💀 Team Chat destroyed');
    }
}

// Instancia global del team chat
let teamChat = null;

// Inicializar cuando el DOM esté listo
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        teamChat = new TeamChat();
        window.teamChat = teamChat;
    });
}
