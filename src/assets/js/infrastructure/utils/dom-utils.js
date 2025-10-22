/**
 * ==================== DOM UTILITIES ====================
 * Utilidades para manipulación del DOM
 * Simplifica operaciones comunes del DOM
 *
 * @version 1.0.0
 */

const DOMUtils = {
    /**
     * Query selector simplificado (retorna primer elemento)
     * @param {string} selector - Selector CSS
     * @param {Element|Document} context - Contexto de búsqueda (default: document)
     * @returns {Element|null} Elemento encontrado o null
     */
    $(selector, context = document) {
        return context.querySelector(selector);
    },

    /**
     * Query selector all (retorna array)
     * @param {string} selector - Selector CSS
     * @param {Element|Document} context - Contexto de búsqueda
     * @returns {Element[]} Array de elementos encontrados
     */
    $$(selector, context = document) {
        return Array.from(context.querySelectorAll(selector));
    },

    /**
     * Crear elemento con atributos y hijos
     * @param {string} tag - Tag HTML
     * @param {Object} attrs - Atributos del elemento
     * @param {Array<string|Element>} children - Hijos (texto o elementos)
     * @returns {Element} Elemento creado
     */
    createElement(tag, attrs = {}, children = []) {
        const el = document.createElement(tag);

        // Aplicar atributos
        Object.entries(attrs).forEach(([key, value]) => {
            if (key === 'className' || key === 'class') {
                el.className = value;
            } else if (key.startsWith('data')) {
                // data-foo -> dataset.foo
                const dataKey = key.slice(5).replace(/-([a-z])/g, (g) => g[1].toUpperCase());
                el.dataset[dataKey] = value;
            } else if (key === 'style' && typeof value === 'object') {
                Object.assign(el.style, value);
            } else {
                el.setAttribute(key, value);
            }
        });

        // Añadir hijos
        children.forEach(child => {
            if (typeof child === 'string') {
                el.appendChild(document.createTextNode(child));
            } else if (child instanceof Element) {
                el.appendChild(child);
            }
        });

        return el;
    },

    /**
     * Toggle clase con estado opcional
     * @param {Element} el - Elemento
     * @param {string} className - Clase a toggle
     * @param {boolean} force - true = añadir, false = remover, undefined = toggle
     */
    toggleClass(el, className, force) {
        if (!el) return;
        el.classList.toggle(className, force);
    },

    /**
     * Añadir clase(s)
     * @param {Element} el - Elemento
     * @param {...string} classNames - Clases a añadir
     */
    addClass(el, ...classNames) {
        if (!el) return;
        el.classList.add(...classNames);
    },

    /**
     * Remover clase(s)
     * @param {Element} el - Elemento
     * @param {...string} classNames - Clases a remover
     */
    removeClass(el, ...classNames) {
        if (!el) return;
        el.classList.remove(...classNames);
    },

    /**
     * Verificar si tiene clase
     * @param {Element} el - Elemento
     * @param {string} className - Clase a verificar
     * @returns {boolean}
     */
    hasClass(el, className) {
        return el ? el.classList.contains(className) : false;
    },

    /**
     * Obtener/establecer atributo data
     * @param {Element} el - Elemento
     * @param {string} key - Nombre del data attribute (sin 'data-')
     * @param {*} value - Valor (si se proporciona, establece; sino, obtiene)
     * @returns {*} Valor del atributo o undefined
     */
    data(el, key, value) {
        if (!el) return undefined;

        if (value !== undefined) {
            el.dataset[key] = value;
            return value;
        }

        return el.dataset[key];
    },

    /**
     * Mostrar elemento (display: block)
     * @param {Element} el - Elemento a mostrar
     */
    show(el) {
        if (!el) return;
        el.style.display = '';
        el.removeAttribute('hidden');
    },

    /**
     * Ocultar elemento (display: none)
     * @param {Element} el - Elemento a ocultar
     */
    hide(el) {
        if (!el) return;
        el.style.display = 'none';
    },

    /**
     * Toggle visibilidad
     * @param {Element} el - Elemento
     * @param {boolean} force - true = mostrar, false = ocultar
     */
    toggle(el, force) {
        if (!el) return;

        const shouldShow = force !== undefined ? force : el.style.display === 'none';

        if (shouldShow) {
            this.show(el);
        } else {
            this.hide(el);
        }
    },

    /**
     * Vaciar contenido de un elemento
     * @param {Element} el - Elemento a vaciar
     */
    empty(el) {
        if (!el) return;
        while (el.firstChild) {
            el.removeChild(el.firstChild);
        }
    },

    /**
     * Remover elemento del DOM
     * @param {Element} el - Elemento a remover
     */
    remove(el) {
        if (el && el.parentNode) {
            el.parentNode.removeChild(el);
        }
    },

    /**
     * Scroll suave a un elemento
     * @param {Element|string} target - Elemento o selector
     * @param {Object} options - Opciones de scroll
     */
    scrollTo(target, options = {}) {
        const el = typeof target === 'string' ? this.$(target) : target;

        if (!el) return;

        el.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
            ...options
        });
    },

    /**
     * Obtener posición de un elemento
     * @param {Element} el - Elemento
     * @returns {Object} {top, left, width, height}
     */
    getPosition(el) {
        if (!el) return null;
        const rect = el.getBoundingClientRect();
        return {
            top: rect.top + window.scrollY,
            left: rect.left + window.scrollX,
            width: rect.width,
            height: rect.height
        };
    },

    /**
     * Verificar si elemento está visible en viewport
     * @param {Element} el - Elemento
     * @returns {boolean}
     */
    isInViewport(el) {
        if (!el) return false;

        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },

    /**
     * Delegación de eventos
     * @param {Element} parent - Elemento padre
     * @param {string} event - Nombre del evento
     * @param {string} selector - Selector de hijos
     * @param {Function} handler - Manejador del evento
     */
    delegate(parent, event, selector, handler) {
        if (!parent) return;

        parent.addEventListener(event, (e) => {
            const target = e.target.closest(selector);
            if (target && parent.contains(target)) {
                handler.call(target, e);
            }
        });
    }
};

// Exponer globalmente
if (typeof window !== 'undefined') {
    window.DOMUtils = DOMUtils;
}

// Export para módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DOMUtils;
}
