/**
 * ==================== 3D TILT CARDS ====================
 * Efecto de inclinación 3D para las tarjetas de noticias
 * Con parallax multi-capa y efecto shine
 */

class TiltCard {
    constructor(element) {
        this.card = element;
        // Soportar tanto .news-card-inner como .hero-card-inner o cualquier .card-inner
        this.cardInner = element.querySelector('.news-card-inner, .hero-card-inner, .card-inner');
        this.layers = element.querySelectorAll('[data-depth]');
        this.shine = element.querySelector('.news-card-shine, .card-shine');

        this.width = 0;
        this.height = 0;
        this.mouseX = 0;
        this.mouseY = 0;
        this.isHovering = false;

        // Configuración
        this.settings = {
            maxTilt: 8,
            perspective: 1200,
            scale: 1.02,
            speed: 400,
            easing: 'cubic-bezier(0.23, 1, 0.32, 1)',
        };

        this.init();
    }

    init() {
        // Aplicar perspectiva al contenedor
        this.card.style.transform = `perspective(${this.settings.perspective}px)`;

        // Event listeners
        this.card.addEventListener('mouseenter', this.handleMouseEnter.bind(this));
        this.card.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.card.addEventListener('mouseleave', this.handleMouseLeave.bind(this));

        // Actualizar dimensiones
        this.updateDimensions();

        // Resize listener
        window.addEventListener('resize', this.updateDimensions.bind(this));
    }

    updateDimensions() {
        this.width = this.card.offsetWidth;
        this.height = this.card.offsetHeight;
    }

    handleMouseEnter(e) {
        this.isHovering = true;
        this.updateDimensions();

        if (this.cardInner) {
            this.cardInner.style.transition = `transform ${this.settings.speed}ms ${this.settings.easing}`;
        }
    }

    handleMouseMove(e) {
        if (!this.isHovering) return;

        // Calcular posición del mouse relativa a la tarjeta
        const rect = this.card.getBoundingClientRect();
        this.mouseX = e.clientX - rect.left;
        this.mouseY = e.clientY - rect.top;

        // Actualizar usando requestAnimationFrame
        requestAnimationFrame(() => this.update());
    }

    handleMouseLeave() {
        this.isHovering = false;

        // Agregar transición para el reset
        if (this.cardInner) {
            this.cardInner.style.transition = `transform ${this.settings.speed}ms ${this.settings.easing}`;
        }

        this.layers.forEach(layer => {
            layer.style.transition = `transform ${this.settings.speed}ms ${this.settings.easing}`;
        });

        // Reset
        setTimeout(() => this.reset(), 50);
    }

    update() {
        // Calcular porcentajes
        const percentX = this.mouseX / this.width;
        const percentY = this.mouseY / this.height;

        // Calcular ángulos de inclinación
        const tiltX = (percentY - 0.5) * -this.settings.maxTilt * 2;
        const tiltY = (percentX - 0.5) * this.settings.maxTilt * 2;

        // Aplicar transformación 3D a la tarjeta
        if (this.cardInner) {
            this.cardInner.style.transform = `
                perspective(${this.settings.perspective}px)
                rotateX(${tiltX}deg)
                rotateY(${tiltY}deg)
                scale3d(${this.settings.scale}, ${this.settings.scale}, ${this.settings.scale})
            `;
        }

        // Aplicar parallax a las capas (si existen)
        this.layers.forEach(layer => {
            const depth = parseFloat(layer.getAttribute('data-depth')) || 0;
            const moveX = (percentX - 0.5) * depth * 40;
            const moveY = (percentY - 0.5) * depth * 40;
            const moveZ = depth * 30;

            layer.style.transform = `
                translateX(${moveX}px)
                translateY(${moveY}px)
                translateZ(${moveZ}px)
            `;
        });

        // Actualizar posición del efecto shine
        if (this.shine) {
            const shineX = percentX * 100;
            const shineY = percentY * 100;

            this.shine.style.background = `
                radial-gradient(
                    circle at ${shineX}% ${shineY}%,
                    rgba(255, 255, 255, 0.15) 0%,
                    rgba(255, 255, 255, 0.05) 30%,
                    transparent 60%
                )
            `;
        }
    }

    reset() {
        // Reset de la tarjeta principal
        if (this.cardInner) {
            this.cardInner.style.transform = `
                perspective(${this.settings.perspective}px)
                rotateX(0deg)
                rotateY(0deg)
                scale3d(1, 1, 1)
            `;
        }

        // Reset de las capas
        this.layers.forEach(layer => {
            layer.style.transform = 'translateX(0) translateY(0) translateZ(0)';
        });

        // Reset del shine
        if (this.shine) {
            this.shine.style.background = `
                radial-gradient(
                    circle at 50% 50%,
                    rgba(255, 255, 255, 0.1) 0%,
                    transparent 60%
                )
            `;
        }

        // Limpiar transiciones después de la animación
        setTimeout(() => {
            if (this.cardInner) this.cardInner.style.transition = '';
            this.layers.forEach(layer => {
                layer.style.transition = '';
            });
        }, this.settings.speed);
    }

    destroy() {
        this.card.removeEventListener('mouseenter', this.handleMouseEnter);
        this.card.removeEventListener('mousemove', this.handleMouseMove);
        this.card.removeEventListener('mouseleave', this.handleMouseLeave);
    }
}

/**
 * Gestor de todas las tarjetas tilt
 */
class TiltCardsManager {
    constructor() {
        this.cards = [];
        this.isMobile = this.checkIfMobile();
        this.init();
    }

    checkIfMobile() {
        return window.innerWidth <= 768 ||
               ('ontouchstart' in window) ||
               (navigator.maxTouchPoints > 0);
    }

    init() {
        // Solo inicializar en desktop
        if (!this.isMobile) {
            this.initializeCards();
            console.log(`✅ ${this.cards.length} 3D Tilt Cards initialized`);
        } else {
            console.log('📱 Mobile detected - 3D tilt disabled');
        }

        // Handle resize
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                this.handleResize();
            }, 250);
        });
    }

    initializeCards() {
        // Buscar cualquier elemento con data-tilt
        const cardElements = document.querySelectorAll('[data-tilt]');
        cardElements.forEach(card => {
            const tiltCard = new TiltCard(card);
            this.cards.push(tiltCard);
        });
    }

    handleResize() {
        const wasMobile = this.isMobile;
        this.isMobile = this.checkIfMobile();

        // Si cambió de mobile a desktop
        if (wasMobile && !this.isMobile && this.cards.length === 0) {
            this.initializeCards();
        }
        // Si cambió de desktop a mobile
        else if (!wasMobile && this.isMobile && this.cards.length > 0) {
            this.destroyCards();
        }
    }

    destroyCards() {
        this.cards.forEach(card => card.destroy());
        this.cards = [];
        console.log('📱 3D tilt cards disabled on mobile');
    }

    // Método para añadir nuevas tarjetas dinámicamente
    addCard(element) {
        if (!this.isMobile && element.hasAttribute('data-tilt')) {
            const tiltCard = new TiltCard(element);
            this.cards.push(tiltCard);
        }
    }
}

// Crear instancia global
let tiltCardsManager = null;

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    tiltCardsManager = new TiltCardsManager();
});

// Exportar función global para reinicializar
window.initTiltCards = function() {
    if (tiltCardsManager && !tiltCardsManager.isMobile) {
        tiltCardsManager.initializeCards();
        console.log('🔄 Tilt cards reinitialized');
    }
};