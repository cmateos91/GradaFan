/**
 * ==================== PARALLAX EFFECT ====================
 * Efecto parallax en imágenes al hacer scroll
 * Solo se activa en desktop para mejor performance
 */

class ParallaxEffect {
    constructor() {
        this.parallaxElements = [];
        this.isActive = false;
        this.rafId = null;
        this.init();
    }

    init() {
        // Solo activar parallax en desktop
        if (window.innerWidth > 768) {
            this.findParallaxElements();
            this.setupScrollListener();
            this.isActive = true;
            console.log(`✅ Parallax initialized for ${this.parallaxElements.length} elements`);
        } else {
            console.log('📱 Mobile detected - Parallax disabled');
        }

        // Handle resize
        window.addEventListener('resize', this.handleResize.bind(this));
    }

    findParallaxElements() {
        // Buscar elementos con clase parallax-bg o parallax-element
        const bgElements = document.querySelectorAll('.parallax-bg');
        const elements = document.querySelectorAll('.parallax-element');

        // Agregar todos los elementos encontrados
        bgElements.forEach(el => {
            this.parallaxElements.push({
                element: el,
                speed: parseFloat(el.dataset.parallaxSpeed) || 0.15,
                type: 'background'
            });
        });

        elements.forEach(el => {
            this.parallaxElements.push({
                element: el,
                speed: parseFloat(el.dataset.parallaxSpeed) || 0.15,
                type: 'element'
            });
        });
    }

    setupScrollListener() {
        // Usar Lenis si está disponible, sino usar scroll nativo
        if (typeof smoothScroll !== 'undefined' && smoothScroll.isInitialized) {
            smoothScroll.on(({ scroll }) => {
                this.updateParallax(scroll);
            });
        } else {
            window.addEventListener('scroll', () => {
                if (!this.rafId) {
                    this.rafId = requestAnimationFrame(() => {
                        this.updateParallax(window.scrollY);
                        this.rafId = null;
                    });
                }
            }, { passive: true });
        }
    }

    updateParallax(scrollY) {
        if (!this.isActive) return;

        const windowHeight = window.innerHeight;

        this.parallaxElements.forEach(({ element, speed, type }) => {
            const rect = element.getBoundingClientRect();

            // Solo aplicar parallax si el elemento está en el viewport o cerca
            if (rect.top < windowHeight + 200 && rect.bottom > -200) {
                // Calcular offset basado en la posición del elemento
                const centerOffset = (rect.top + rect.height / 2) - (windowHeight / 2);
                const offset = centerOffset * speed;

                // Aplicar transformación
                element.style.transform = `translateY(${offset}px)`;

                // Para imágenes dentro de elementos parallax, aplicar también
                if (type === 'background') {
                    const img = element.querySelector('img');
                    if (img) {
                        img.style.transform = `translateY(${offset}px)`;
                    }
                }
            }
        });
    }

    handleResize() {
        const shouldBeActive = window.innerWidth > 768;

        if (shouldBeActive && !this.isActive) {
            // Activar parallax
            this.parallaxElements = [];
            this.findParallaxElements();
            this.isActive = true;
            console.log('✅ Parallax enabled');
        } else if (!shouldBeActive && this.isActive) {
            // Desactivar parallax y resetear transforms
            this.reset();
            this.isActive = false;
            console.log('📱 Parallax disabled');
        }
    }

    reset() {
        this.parallaxElements.forEach(({ element }) => {
            element.style.transform = '';
            const img = element.querySelector('img');
            if (img) {
                img.style.transform = '';
            }
        });
    }

    destroy() {
        this.reset();
        this.parallaxElements = [];
        this.isActive = false;

        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
            this.rafId = null;
        }
    }
}

// Crear instancia global
let parallaxEffect = null;

document.addEventListener('DOMContentLoaded', () => {
    parallaxEffect = new ParallaxEffect();
});