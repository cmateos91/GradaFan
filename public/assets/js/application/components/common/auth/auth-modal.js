/**
 * ==================== AUTH MODAL ====================
 * Modal de autenticación con registro y login
 */

class AuthModal {
    constructor() {
        this.overlay = null;
        this.modal = null;
        this.currentMode = 'login'; // 'login' o 'register'

        this.init();
    }

    init() {
        // Crear estructura del modal
        this.createModalStructure();

        // Escuchar evento de solicitud de auth
        window.addEventListener('showAuthModal', (e) => {
            this.show(e.detail?.mode || 'login');
        });

        console.log('✅ AuthModal initialized');
    }

    createModalStructure() {
        // Crear overlay
        this.overlay = document.createElement('div');
        this.overlay.className = 'auth-modal-overlay';
        this.overlay.innerHTML = `
            <div class="auth-modal">
                <button class="auth-modal-close">✕</button>

                <!-- Tabs -->
                <div class="auth-tabs">
                    <button class="auth-tab active" data-tab="login">Iniciar Sesión</button>
                    <button class="auth-tab" data-tab="register">Registrarse</button>
                </div>

                <!-- Login Form -->
                <div class="auth-form-container" id="loginForm">
                    <h2 class="auth-title">Bienvenido de vuelta</h2>
                    <form class="auth-form" id="loginFormElement">
                        <div class="form-group">
                            <label for="loginUsername">Nombre de usuario</label>
                            <input
                                type="text"
                                id="loginUsername"
                                name="username"
                                placeholder="tu_usuario"
                                required
                                autocomplete="username"
                                pattern="[a-zA-Z0-9_\-]+"
                            />
                        </div>
                        <div class="form-group">
                            <label for="loginPassword">Contraseña</label>
                            <input
                                type="password"
                                id="loginPassword"
                                name="password"
                                placeholder="••••••••"
                                required
                                autocomplete="current-password"
                            />
                        </div>
                        <div class="auth-error" id="loginError"></div>
                        <button type="submit" class="btn-auth-submit">
                            Iniciar Sesión
                        </button>
                    </form>
                </div>

                <!-- Register Form -->
                <div class="auth-form-container hidden" id="registerForm">
                    <h2 class="auth-title">Únete a LaLiga Social</h2>
                    <form class="auth-form" id="registerFormElement">
                        <div class="form-group">
                            <label for="registerUsername">Nombre de usuario</label>
                            <input
                                type="text"
                                id="registerUsername"
                                name="username"
                                placeholder="tu_usuario"
                                required
                                minlength="3"
                                maxlength="20"
                                pattern="[a-zA-Z0-9_\-]+"
                                autocomplete="username"
                            />
                            <small>3-20 caracteres. Solo letras, números, _ y -</small>
                        </div>
                        <div class="form-group">
                            <label for="registerPassword">Contraseña</label>
                            <input
                                type="password"
                                id="registerPassword"
                                name="password"
                                placeholder="••••••••"
                                required
                                minlength="6"
                                autocomplete="new-password"
                            />
                            <small>Mínimo 6 caracteres</small>
                        </div>
                        <div class="form-group">
                            <label for="teamSelect">Tu equipo favorito ⚽</label>
                            <select name="team" required id="teamSelect">
                                <option value="">Selecciona tu equipo</option>
                            </select>
                            <small>⚠️ No podrás cambiar tu equipo después</small>
                        </div>
                        <div class="auth-error" id="registerError"></div>
                        <button type="submit" class="btn-auth-submit">
                            Registrarse
                        </button>
                    </form>
                </div>
            </div>
        `;

        document.body.appendChild(this.overlay);

        // Poblar equipos
        this.populateTeams();

        // Event listeners
        this.setupEventListeners();
    }

    async populateTeams() {
        const teamSelect = document.getElementById('teamSelect');
        if (!teamSelect) return;

        try {
            // Obtener equipos desde la API
            const response = await fetch('/api/teams/list');
            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error('Error cargando equipos');
            }

            const teams = data.teams;

            teams.forEach(team => {
                const option = document.createElement('option');
                option.value = JSON.stringify({ id: team.id, name: team.name });
                option.textContent = team.name;
                teamSelect.appendChild(option);
            });

            console.log(`✅ ${teams.length} equipos cargados`);

        } catch (error) {
            console.error('Error cargando equipos:', error);
            // Fallback: agregar opción de error
            teamSelect.innerHTML = '<option value="">Error cargando equipos</option>';
        }
    }

    setupEventListeners() {
        // Cerrar modal
        const closeBtn = this.overlay.querySelector('.auth-modal-close');
        closeBtn?.addEventListener('click', () => this.hide());

        // Cerrar al hacer click fuera
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) {
                this.hide();
            }
        });

        // Tabs
        const tabs = this.overlay.querySelectorAll('.auth-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                this.switchTab(tab.dataset.tab);
            });
        });

        // Forms
        const loginForm = document.getElementById('loginFormElement');
        loginForm?.addEventListener('submit', (e) => this.handleLogin(e));

        const registerForm = document.getElementById('registerFormElement');
        registerForm?.addEventListener('submit', (e) => this.handleRegister(e));
    }

    switchTab(mode) {
        this.currentMode = mode;

        // Actualizar tabs
        const tabs = this.overlay.querySelectorAll('.auth-tab');
        tabs.forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === mode);
        });

        // Mostrar formulario correcto
        const loginContainer = document.getElementById('loginForm');
        const registerContainer = document.getElementById('registerForm');

        if (mode === 'login') {
            loginContainer.classList.remove('hidden');
            registerContainer.classList.add('hidden');
        } else {
            loginContainer.classList.add('hidden');
            registerContainer.classList.remove('hidden');
        }

        // Limpiar errores
        this.clearErrors();
    }

    async handleLogin(e) {
        e.preventDefault();

        const formData = new FormData(e.target);
        const username = formData.get('username');
        const password = formData.get('password');

        // Limpiar error anterior
        this.clearErrors();

        try {
            // Deshabilitar botón
            const submitBtn = e.target.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Iniciando sesión...';

            await window.AuthService.login(username, password);

            // Login exitoso
            this.hide();
            this.showSuccessMessage('¡Bienvenido de nuevo!');

        } catch (error) {
            this.showError('loginError', error.message);
        } finally {
            // Rehabilitar botón
            const submitBtn = e.target.querySelector('button[type="submit"]');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Iniciar Sesión';
        }
    }

    async handleRegister(e) {
        e.preventDefault();

        const formData = new FormData(e.target);
        const username = formData.get('username');
        const password = formData.get('password');
        const teamData = JSON.parse(formData.get('team'));

        // Limpiar error anterior
        this.clearErrors();

        try {
            // Deshabilitar botón
            const submitBtn = e.target.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Registrando...';

            await window.AuthService.register(
                username,
                password,
                teamData.name,
                teamData.id
            );

            // Registro exitoso
            this.hide();
            this.showSuccessMessage(`¡Bienvenido a LaLiga Social! Eres hincha de ${teamData.name} 🎉`);

        } catch (error) {
            this.showError('registerError', error.message);
        } finally {
            // Rehabilitar botón
            const submitBtn = e.target.querySelector('button[type="submit"]');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Registrarse';
        }
    }

    showError(elementId, message) {
        const errorEl = document.getElementById(elementId);
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.style.display = 'block';
        }
    }

    clearErrors() {
        const errors = this.overlay.querySelectorAll('.auth-error');
        errors.forEach(error => {
            error.textContent = '';
            error.style.display = 'none';
        });
    }

    showSuccessMessage(message) {
        // Crear toast temporal
        const toast = document.createElement('div');
        toast.className = 'auth-success-toast';
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('show');
        }, 100);

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    show(mode = 'login') {
        this.switchTab(mode);
        this.overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    hide() {
        this.overlay.classList.remove('active');
        document.body.style.overflow = '';
        this.clearErrors();
    }
}

// Auto-inicialización
document.addEventListener('DOMContentLoaded', () => {
    window.authModal = new AuthModal();
});
