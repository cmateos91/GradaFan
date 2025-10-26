/**
 * ==================== NAVBAR COMPONENT ====================
 * Maneja la funcionalidad de la barra de navegación
 * Autenticación, dropdown de usuario, scroll effects
 */

class Navbar {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.authButtons = document.getElementById('authButtons');
        this.userInfo = document.getElementById('userInfo');
        this.userPoints = document.getElementById('user-points');
        this.userAvatar = document.getElementById('userAvatarImg');
        this.userName = document.getElementById('userName');
        this.userLevel = document.getElementById('userLevel');
        this.lastScrollY = 0;

        this.init();
    }

    async init() {
        if (!this.navbar) return;

        // Setup auth buttons
        this.setupAuthButtons();

        // Setup user dropdown
        this.setupUserDropdown();

        // Escuchar cambios de usuario
        window.addEventListener('userChanged', (e) => {
            this.handleUserChanged(e.detail);
        });

        // Esperar a que AuthService esté listo y haya cargado la sesión
        await this.waitForAuthService();

        // Cargar estado inicial
        this.updateUIForCurrentUser();

        // Scroll effect
        this.setupScrollEffect();

        console.log('✅ Navbar initialized');
    }

    async waitForAuthService() {
        // Esperar hasta que AuthService esté disponible
        let attempts = 0;
        const maxAttempts = 50; // 5 segundos máximo

        while (attempts < maxAttempts) {
            if (window.AuthService) {
                // Esperar a que AuthService termine de inicializarse completamente
                await window.AuthService.waitUntilReady();
                console.log('✅ AuthService ready and session loaded');
                return;
            }
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }

        console.warn('⚠️ AuthService timeout');
    }

    setupAuthButtons() {
        const btnLogin = document.getElementById('btnLogin');
        const btnRegister = document.getElementById('btnRegister');

        if (btnLogin) {
            btnLogin.addEventListener('click', () => {
                window.dispatchEvent(new CustomEvent('showAuthModal', {
                    detail: { mode: 'login' }
                }));
            });
        }

        if (btnRegister) {
            btnRegister.addEventListener('click', () => {
                window.dispatchEvent(new CustomEvent('showAuthModal', {
                    detail: { mode: 'register' }
                }));
            });
        }
    }

    setupUserDropdown() {
        const userAvatar = document.getElementById('user-avatar');
        const dropdown = document.querySelector('.user-dropdown');

        if (userAvatar && dropdown) {
            userAvatar.addEventListener('click', (e) => {
                e.stopPropagation();
                dropdown.classList.toggle('active');
            });

            // Cerrar dropdown al hacer click fuera
            document.addEventListener('click', () => {
                dropdown.classList.remove('active');
            });

            dropdown.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }

        // Logout button
        const btnLogout = document.getElementById('btnLogout');
        if (btnLogout) {
            btnLogout.addEventListener('click', async (e) => {
                e.preventDefault();
                if (window.AuthService) {
                    await window.AuthService.logout();
                }
            });
        }
    }

    handleUserChanged(detail) {
        console.log('📢 Evento userChanged recibido:', detail);
        const { user, isAuthenticated } = detail;

        if (isAuthenticated && user) {
            // Usuario autenticado - mostrar info
            console.log('👤 Actualizando UI para usuario:', user.username);
            this.showUserInfo(user);
        } else {
            // Usuario NO autenticado - mostrar botones
            console.log('🚪 Usuario no autenticado, mostrando botones');
            this.showAuthButtons();
        }
    }

    updateUIForCurrentUser() {
        console.log('🔍 Verificando estado de autenticación...', {
            AuthService: !!window.AuthService,
            isAuth: window.AuthService?.isAuth(),
            currentUser: window.AuthService?.getCurrentUser()
        });

        if (window.AuthService && window.AuthService.isAuth()) {
            const user = window.AuthService.getCurrentUser();
            console.log('✅ Usuario autenticado, mostrando info:', user?.username);
            this.showUserInfo(user);
        } else {
            console.log('❌ Usuario NO autenticado, mostrando botones');
            this.showAuthButtons();
        }
    }

    showUserInfo(user) {
        console.log('👁️ showUserInfo llamado:', {
            user: user?.username,
            authButtons: !!this.authButtons,
            userInfo: !!this.userInfo
        });

        // Ocultar botones de auth
        if (this.authButtons) {
            this.authButtons.classList.add('hidden');
            console.log('✅ Botones de auth ocultos');
        } else {
            console.warn('⚠️ authButtons no encontrado');
        }

        // Mostrar info de usuario
        if (this.userInfo) {
            this.userInfo.classList.remove('hidden');
            console.log('✅ Info de usuario mostrada');
        } else {
            console.warn('⚠️ userInfo no encontrado');
        }

        // Actualizar datos
        if (this.userName) {
            this.userName.textContent = user.username;
        }

        if (this.userLevel) {
            this.userLevel.textContent = user.level || 'Aficionado';
        }

        if (this.userPoints) {
            this.userPoints.textContent = this.formatPoints(user.points || 0);
        }

        if (this.userAvatar) {
            this.userAvatar.src = user.avatarUrl;
            this.userAvatar.alt = user.username;
        }
    }

    showAuthButtons() {
        console.log('🚪 showAuthButtons llamado:', {
            authButtons: !!this.authButtons,
            userInfo: !!this.userInfo
        });

        // Mostrar botones de auth
        if (this.authButtons) {
            this.authButtons.classList.remove('hidden');
            console.log('✅ Botones de auth mostrados');
        } else {
            console.warn('⚠️ authButtons no encontrado');
        }

        // Ocultar info de usuario
        if (this.userInfo) {
            this.userInfo.classList.add('hidden');
            console.log('✅ Info de usuario ocultada');
        } else {
            console.warn('⚠️ userInfo no encontrado');
        }
    }

    setupScrollEffect() {
        // Listener para el scroll
        if (typeof smoothScroll !== 'undefined' && smoothScroll.isInitialized) {
            smoothScroll.on(({ scroll }) => {
                this.handleScroll(scroll);
            });
        } else {
            window.addEventListener('scroll', () => {
                this.handleScroll(window.scrollY);
            }, { passive: true });
        }
    }

    handleScroll(scrollY) {
        // Añadir clase 'scrolled' cuando se hace scroll
        if (scrollY > 100) {
            this.navbar.classList.add('scrolled');
        } else {
            this.navbar.classList.remove('scrolled');
        }

        this.lastScrollY = scrollY;
    }

    formatPoints(points) {
        return points.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    updateUserPoints(newPoints) {
        if (this.userPoints) {
            this.userPoints.textContent = this.formatPoints(newPoints);

            // Añadir efecto visual
            this.userPoints.parentElement.classList.add('bounce-in');
            setTimeout(() => {
                this.userPoints.parentElement.classList.remove('bounce-in');
            }, 500);
        }
    }
}

// Inicializar cuando el DOM esté listo
let navbarComponent = null;

// Esperar a que los componentes se carguen antes de inicializar
document.addEventListener('componentsLoaded', () => {
    navbarComponent = new Navbar();
});

// Fallback por si acaso el evento ya se disparó
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (!navbarComponent && document.getElementById('navbar')) {
            navbarComponent = new Navbar();
        }
    }, 500);
});
