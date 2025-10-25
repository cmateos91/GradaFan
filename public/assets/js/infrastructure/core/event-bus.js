/**
 * ==================== EVENT BUS ====================
 * Sistema Pub/Sub para comunicación entre componentes
 * Basado en el patrón Observer con broker centralizado
 *
 * @see https://djaytechdiary.com/observer-and-pubsub-design-pattern
 * @version 1.0.0
 */

class EventBus {
    constructor() {
        this.events = {};
        this.debug = true; // Cambiar a false en producción
    }

    /**
     * Suscribirse a un evento
     * @param {string} event - Nombre del evento
     * @param {Function} callback - Función a ejecutar cuando el evento se emita
     * @param {Object|null} context - Contexto (this) para la función callback
     * @returns {Function} Función para desuscribirse
     */
    on(event, callback, context = null) {
        if (!event || typeof event !== 'string') {
            console.error('❌ EventBus.on: nombre de evento inválido');
            return () => {};
        }

        if (typeof callback !== 'function') {
            console.error('❌ EventBus.on: callback debe ser una función');
            return () => {};
        }

        if (!this.events[event]) {
            this.events[event] = [];
        }

        const subscriber = { callback, context };
        this.events[event].push(subscriber);

        if (this.debug) {
            console.log(`📡 EventBus: Suscrito a "${event}"`, {
                totalSubscribers: this.events[event].length
            });
        }

        // Retornar función para desuscribirse
        return () => this.off(event, callback);
    }

    /**
     * Desuscribirse de un evento
     * @param {string} event - Nombre del evento
     * @param {Function} callback - Función original que fue registrada
     */
    off(event, callback) {
        if (!this.events[event]) {
            if (this.debug) {
                console.warn(`⚠️ EventBus.off: evento "${event}" no existe`);
            }
            return;
        }

        const originalLength = this.events[event].length;
        this.events[event] = this.events[event].filter(
            subscriber => subscriber.callback !== callback
        );

        if (this.debug && this.events[event].length !== originalLength) {
            console.log(`📡 EventBus: Desuscrito de "${event}"`, {
                remainingSubscribers: this.events[event].length
            });
        }

        // Limpiar evento si no hay suscriptores
        if (this.events[event].length === 0) {
            delete this.events[event];
        }
    }

    /**
     * Emitir un evento
     * @param {string} event - Nombre del evento
     * @param {*} data - Datos a pasar a los suscriptores
     */
    emit(event, data) {
        if (!this.events[event]) {
            if (this.debug) {
                console.log(`📤 EventBus: Emitiendo "${event}" (sin suscriptores)`, data);
            }
            return;
        }

        if (this.debug) {
            console.log(`📤 EventBus: Emitiendo "${event}"`, {
                data,
                subscribers: this.events[event].length
            });
        }

        // Clonar array para evitar problemas si un subscriber se desuscribe durante la emisión
        const subscribers = [...this.events[event]];

        subscribers.forEach(subscriber => {
            const { callback, context } = subscriber;
            try {
                callback.call(context, data);
            } catch (error) {
                console.error(`❌ EventBus: Error en callback de "${event}"`, error);
            }
        });
    }

    /**
     * Suscribirse una sola vez (se desuscribe automáticamente después de la primera emisión)
     * @param {string} event - Nombre del evento
     * @param {Function} callback - Función a ejecutar
     * @param {Object|null} context - Contexto (this)
     * @returns {Function} Función para desuscribirse manualmente
     */
    once(event, callback, context = null) {
        const onceCallback = (data) => {
            callback.call(context, data);
            this.off(event, onceCallback);
        };

        return this.on(event, onceCallback, context);
    }

    /**
     * Obtener todos los eventos registrados
     * @returns {string[]} Array con nombres de eventos
     */
    getEvents() {
        return Object.keys(this.events);
    }

    /**
     * Obtener número de suscriptores de un evento
     * @param {string} event - Nombre del evento
     * @returns {number} Número de suscriptores
     */
    getSubscriberCount(event) {
        return this.events[event] ? this.events[event].length : 0;
    }

    /**
     * Limpiar todos los eventos y suscriptores
     */
    clear() {
        if (this.debug) {
            console.log('🧹 EventBus: Limpiando todos los eventos');
        }
        this.events = {};
    }

    /**
     * Activar/desactivar modo debug
     * @param {boolean} enabled - true para activar, false para desactivar
     */
    setDebug(enabled) {
        this.debug = enabled;
        console.log(`🐛 EventBus: Debug ${enabled ? 'activado' : 'desactivado'}`);
    }
}

// Crear instancia global singleton
if (typeof window !== 'undefined') {
    window.eventBus = new EventBus();

    // Exponer también como módulo para compatibilidad
    window.EventBus = EventBus;
}

// Export para uso con módulos ES6
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EventBus;
}
