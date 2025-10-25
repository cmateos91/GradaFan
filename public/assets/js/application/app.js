/**
 * ==================== MAIN APP ====================
 * Punto de entrada principal de la aplicación
 * Coordina todos los componentes y módulos
 */

(function() {
    'use strict';

    /**
     * Aplicación Principal
     */
    class LaLigaSocialApp {
        constructor() {
            this.isInitialized = false;
            this.components = {};

            // Prevenir scroll automático del navegador
            this.preventAutoScroll();

            this.init();
        }

        /**
         * Prevenir que el navegador restaure la posición del scroll
         */
        preventAutoScroll() {
            // Desactivar restauración automática del scroll
            if ('scrollRestoration' in history) {
                history.scrollRestoration = 'manual';
            }

            // Forzar scroll al top antes de que el DOM cargue
            window.scrollTo(0, 0);

            // También al cargar la página
            window.addEventListener('beforeunload', () => {
                window.scrollTo(0, 0);
            });
        }

        /**
         * Inicializar la aplicación
         */
        async init() {
            console.log('🚀 Initializing LaLiga Social...');

            // Forzar posición inicial
            window.scrollTo(0, 0);

            // Esperar a que el DOM esté listo
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.start());
            } else {
                this.start();
            }
        }

        /**
         * Iniciar la aplicación
         */
        start() {
            // Asegurar que estamos en el top
            window.scrollTo(0, 0);

            // Verificar dependencias
            this.checkDependencies();

            // Configurar event listeners globales
            this.setupGlobalListeners();

            // Inicializar reveal animations
            this.initRevealAnimations();

            // Marcar como inicializado
            this.isInitialized = true;

            console.log('✅ LaLiga Social initialized successfully!');
            this.showWelcomeMessage();
        }

        /**
         * Verificar que las dependencias estén cargadas
         */
        checkDependencies() {
            const dependencies = [
                // Lenis removido - no se usa (smooth scroll nativo)
                { name: 'Teams Data', check: () => typeof TEAMS_DATA !== 'undefined' },
                { name: 'Users Data', check: () => typeof USERS_DATA !== 'undefined' },
                { name: 'DateUtils', check: () => typeof DateUtils !== 'undefined' },
                { name: 'Supabase', check: () => typeof window.supabase !== 'undefined' }
            ];

            dependencies.forEach(dep => {
                if (dep.check()) {
                    console.log(`✅ ${dep.name} loaded`);
                } else {
                    console.warn(`⚠️  ${dep.name} not loaded`);
                }
            });
        }

        /**
         * Configurar listeners globales
         */
        setupGlobalListeners() {
            // Team selection
            document.addEventListener('teamSelected', (e) => {
                console.log('Team selected event:', e.detail);
                // Aquí se puede añadir lógica adicional
            });

            // News click
            document.addEventListener('newsClicked', (e) => {
                console.log('News clicked event:', e.detail);
                // Aquí se puede navegar a la página de detalle
            });

            // Trending click
            document.addEventListener('trendingClicked', (e) => {
                console.log('Trending clicked event:', e.detail);
            });

            // Match click
            document.addEventListener('matchClicked', (e) => {
                console.log('Match clicked event:', e.detail);
            });

            // User click
            document.addEventListener('userClicked', (e) => {
                console.log('User clicked event:', e.detail);
            });

            // Handle performance warnings
            this.setupPerformanceMonitoring();
        }

        /**
         * Inicializar animaciones de reveal
         */
        initRevealAnimations() {
            const revealElements = document.querySelectorAll('.reveal, .reveal-scale');

            if (revealElements.length === 0) return;

            const observerOptions = {
                root: null,
                rootMargin: '0px 0px -10% 0px',
                threshold: 0.1
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const delay = parseFloat(entry.target.dataset.delay) || 0;

                        setTimeout(() => {
                            entry.target.classList.add('is-visible');
                        }, delay * 1000);

                        observer.unobserve(entry.target);
                    }
                });
            }, observerOptions);

            revealElements.forEach(el => observer.observe(el));

            console.log(`✅ Reveal animations initialized for ${revealElements.length} elements`);
        }

        /**
         * Monitoreo de performance
         */
        setupPerformanceMonitoring() {
            // Monitor FPS (solo en desarrollo)
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                let lastTime = performance.now();
                let frames = 0;

                const measureFPS = () => {
                    frames++;
                    const currentTime = performance.now();

                    if (currentTime >= lastTime + 1000) {
                        const fps = Math.round((frames * 1000) / (currentTime - lastTime));

                        if (fps < 30) {
                            console.warn(`⚠️  Low FPS detected: ${fps}`);
                        }

                        frames = 0;
                        lastTime = currentTime;
                    }

                    requestAnimationFrame(measureFPS);
                };

                requestAnimationFrame(measureFPS);
            }
        }

        /**
         * Mostrar mensaje de bienvenida
         */
        showWelcomeMessage() {
            const styles = [
                'color: #00ff88',
                'background: #0a0a0a',
                'font-size: 16px',
                'font-weight: bold',
                'padding: 10px',
                'border: 2px solid #00ff88'
            ].join(';');

            console.log('%c⚽ LaLiga Social - Red Social de Fútbol', styles);
            console.log('%cVersión: 1.0.0', 'color: #00ff88');
            console.log('%cDesarrollado con efectos modernos de portfolio', 'color: #a0a0a0');
            console.log(' ');
            console.log('Características:');
            console.log('• Smooth Scroll con Lenis');
            console.log('• 3D Tilt Cards');
            console.log('• Chat en Vivo');
            console.log('• Sistema de Puntos');
            console.log('• Noticias en Tiempo Real');
        }

        /**
         * Utility: Formatear número
         */
        static formatNumber(num) {
            if (num >= 1000000) {
                return (num / 1000000).toFixed(1) + 'M';
            } else if (num >= 1000) {
                return (num / 1000).toFixed(1) + 'K';
            }
            return num.toString();
        }

        /**
         * Utility: Formatear fecha relativa
         */
        static formatRelativeTime(dateString) {
            const date = new Date(dateString);
            const now = new Date();
            const diffInSeconds = Math.floor((now - date) / 1000);

            if (diffInSeconds < 60) return 'Hace menos de 1 minuto';
            if (diffInSeconds < 3600) {
                const minutes = Math.floor(diffInSeconds / 60);
                return `Hace ${minutes} minuto${minutes > 1 ? 's' : ''}`;
            }
            if (diffInSeconds < 86400) {
                const hours = Math.floor(diffInSeconds / 3600);
                return `Hace ${hours} hora${hours > 1 ? 's' : ''}`;
            }
            const days = Math.floor(diffInSeconds / 86400);
            return `Hace ${days} día${days > 1 ? 's' : ''}`;
        }
    }

    // Crear e iniciar la aplicación
    window.laLigaSocialApp = new LaLigaSocialApp();

    // Exponer utilidades globalmente si son necesarias
    window.LaLigaSocial = {
        formatNumber: LaLigaSocialApp.formatNumber,
        formatRelativeTime: LaLigaSocialApp.formatRelativeTime
    };

})();