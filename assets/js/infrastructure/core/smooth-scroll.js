/**
 * ==================== SMOOTH SCROLL ====================
 * Implementación de Lenis Smooth Scroll
 * Proporciona un scroll suave y natural
 */

class SmoothScroll {
    constructor() {
        this.lenis = null;
        this.isInitialized = false;
        this.init();
    }

    /**
     * Inicializar Lenis Smooth Scroll
     */
    init() {
        // DESACTIVADO: El smooth scroll añade demasiada latencia
        // Usamos scroll nativo para mejor rendimiento
        console.log('⚠️ Smooth Scroll desactivado - usando scroll nativo');

        // Configurar scroll suave solo para enlaces ancla
        this.setupSmoothLinks();

        // Marcar como inicializado (aunque no usamos Lenis)
        this.isInitialized = false;

        return;

        // CÓDIGO ORIGINAL COMENTADO:
        /*
        // Verificar si Lenis está disponible
        if (typeof Lenis === 'undefined') {
            console.error('Lenis library not loaded');
            return;
        }

        // Configuración de Lenis
        this.lenis = new Lenis({
            duration: 0.8,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1.2,
            smoothTouch: false,
            touchMultiplier: 2,
            infinite: false,
        });

        // Iniciar el loop de animación
        this.startAnimationLoop();

        // Configurar listeners
        this.setupListeners();

        // Marcar como inicializado
        this.isInitialized = true;

        console.log('✅ Smooth Scroll initialized');
        */
    }

    /**
     * Loop de animación usando requestAnimationFrame
     */
    startAnimationLoop() {
        const raf = (time) => {
            this.lenis.raf(time);
            requestAnimationFrame(raf);
        };

        requestAnimationFrame(raf);
    }

    /**
     * Configurar event listeners
     */
    setupListeners() {
        // Parar scroll cuando la pestaña no está visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.lenis.stop();
            } else {
                this.lenis.start();
            }
        });

        // Recalcular al cambiar tamaño de ventana
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                this.lenis.resize();
            }, 250);
        });

        // Smooth scroll para enlaces internos
        this.setupSmoothLinks();
    }

    /**
     * Configurar scroll suave para enlaces ancla
     */
    setupSmoothLinks() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const targetId = anchor.getAttribute('href');

                if (targetId === '#') {
                    e.preventDefault();
                    return;
                }

                const target = document.querySelector(targetId);

                if (target) {
                    e.preventDefault();
                    // Usar scroll nativo con comportamiento suave
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    /**
     * Scroll a un elemento específico
     * @param {HTMLElement|string} target - Elemento o selector
     * @param {object} options - Opciones de scroll
     */
    scrollTo(target, options = {}) {
        if (!this.lenis) return;

        const defaultOptions = {
            offset: 0,
            duration: 1,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        };

        this.lenis.scrollTo(target, { ...defaultOptions, ...options });
    }

    /**
     * Detener el scroll
     */
    stop() {
        if (this.lenis) {
            this.lenis.stop();
        }
    }

    /**
     * Iniciar el scroll
     */
    start() {
        if (this.lenis) {
            this.lenis.start();
        }
    }

    /**
     * Destruir la instancia
     */
    destroy() {
        if (this.lenis) {
            this.lenis.destroy();
            this.lenis = null;
            this.isInitialized = false;
        }
    }

    /**
     * Obtener la posición actual del scroll
     * @returns {number} - Posición Y del scroll
     */
    getScrollY() {
        return window.scrollY || window.pageYOffset;
    }

    /**
     * Listener personalizado para eventos de scroll
     * @param {function} callback - Función a ejecutar en cada scroll
     */
    on(callback) {
        if (typeof callback === 'function') {
            // Usar evento nativo de scroll
            window.addEventListener('scroll', () => {
                callback({ scroll: this.getScrollY() });
            }, { passive: true });
        }
    }
}

// Crear instancia global
const smoothScroll = new SmoothScroll();