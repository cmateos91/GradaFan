/**
 * ==================== STORAGE UTILITIES ====================
 * Utilidades para localStorage/sessionStorage
 * Serialización/deserialización automática y manejo de errores
 *
 * @version 1.0.0
 */

const StorageUtils = {
    /**
     * Guardar en localStorage con serialización automática
     * @param {string} key - Clave
     * @param {*} value - Valor (será serializado a JSON)
     * @returns {boolean} true si se guardó exitosamente
     */
    set(key, value) {
        try {
            const serialized = JSON.stringify(value);
            localStorage.setItem(key, serialized);
            return true;
        } catch (e) {
            console.error(`❌ StorageUtils.set: Error guardando "${key}"`, e);
            return false;
        }
    },

    /**
     * Obtener de localStorage con deserialización automática
     * @param {string} key - Clave
     * @param {*} defaultValue - Valor por defecto si no existe o hay error
     * @returns {*} Valor deserializado o defaultValue
     */
    get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);

            if (item === null) {
                return defaultValue;
            }

            return JSON.parse(item);
        } catch (e) {
            console.error(`❌ StorageUtils.get: Error leyendo "${key}"`, e);
            return defaultValue;
        }
    },

    /**
     * Eliminar item de localStorage
     * @param {string} key - Clave a eliminar
     */
    remove(key) {
        try {
            localStorage.removeItem(key);
        } catch (e) {
            console.error(`❌ StorageUtils.remove: Error eliminando "${key}"`, e);
        }
    },

    /**
     * Limpiar todo localStorage
     */
    clear() {
        try {
            localStorage.clear();
        } catch (e) {
            console.error('❌ StorageUtils.clear: Error limpiando storage', e);
        }
    },

    /**
     * Verificar si una clave existe
     * @param {string} key - Clave
     * @returns {boolean}
     */
    has(key) {
        return localStorage.getItem(key) !== null;
    },

    /**
     * Obtener todas las claves
     * @returns {string[]} Array de claves
     */
    keys() {
        return Object.keys(localStorage);
    },

    /**
     * Obtener tamaño aproximado usado (en KB)
     * @returns {number} Tamaño en kilobytes
     */
    getSize() {
        let total = 0;
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                total += localStorage[key].length + key.length;
            }
        }
        return (total / 1024).toFixed(2);
    },

    /**
     * Guardar con expiración
     * @param {string} key - Clave
     * @param {*} value - Valor
     * @param {number} ttl - Time to live en milisegundos
     * @returns {boolean}
     */
    setWithExpiry(key, value, ttl) {
        try {
            const now = Date.now();
            const item = {
                value: value,
                expiry: now + ttl
            };
            localStorage.setItem(key, JSON.stringify(item));
            return true;
        } catch (e) {
            console.error(`❌ StorageUtils.setWithExpiry: Error guardando "${key}"`, e);
            return false;
        }
    },

    /**
     * Obtener con verificación de expiración
     * @param {string} key - Clave
     * @param {*} defaultValue - Valor por defecto
     * @returns {*} Valor o defaultValue si expiró
     */
    getWithExpiry(key, defaultValue = null) {
        try {
            const itemStr = localStorage.getItem(key);

            if (!itemStr) {
                return defaultValue;
            }

            const item = JSON.parse(itemStr);
            const now = Date.now();

            // Verificar si expiró
            if (now > item.expiry) {
                localStorage.removeItem(key);
                return defaultValue;
            }

            return item.value;
        } catch (e) {
            console.error(`❌ StorageUtils.getWithExpiry: Error leyendo "${key}"`, e);
            return defaultValue;
        }
    },

    /**
     * Incrementar un valor numérico
     * @param {string} key - Clave
     * @param {number} amount - Cantidad a incrementar (default: 1)
     * @returns {number} Nuevo valor
     */
    increment(key, amount = 1) {
        const current = this.get(key, 0);
        const newValue = (typeof current === 'number' ? current : 0) + amount;
        this.set(key, newValue);
        return newValue;
    },

    /**
     * Decrementar un valor numérico
     * @param {string} key - Clave
     * @param {number} amount - Cantidad a decrementar (default: 1)
     * @returns {number} Nuevo valor
     */
    decrement(key, amount = 1) {
        return this.increment(key, -amount);
    },

    /**
     * Toggle booleano
     * @param {string} key - Clave
     * @param {boolean} defaultValue - Valor por defecto si no existe
     * @returns {boolean} Nuevo valor
     */
    toggle(key, defaultValue = false) {
        const current = this.get(key, defaultValue);
        const newValue = !current;
        this.set(key, newValue);
        return newValue;
    },

    /**
     * Añadir elemento a un array
     * @param {string} key - Clave
     * @param {*} item - Elemento a añadir
     * @param {boolean} unique - Si true, no añade duplicados
     * @returns {Array} Nuevo array
     */
    pushToArray(key, item, unique = false) {
        const array = this.get(key, []);

        if (!Array.isArray(array)) {
            console.error(`❌ StorageUtils.pushToArray: "${key}" no es un array`);
            return [];
        }

        if (unique && array.includes(item)) {
            return array;
        }

        array.push(item);
        this.set(key, array);
        return array;
    },

    /**
     * Remover elemento de un array
     * @param {string} key - Clave
     * @param {*} item - Elemento a remover
     * @returns {Array} Nuevo array
     */
    removeFromArray(key, item) {
        const array = this.get(key, []);

        if (!Array.isArray(array)) {
            console.error(`❌ StorageUtils.removeFromArray: "${key}" no es un array`);
            return [];
        }

        const newArray = array.filter(el => el !== item);
        this.set(key, newArray);
        return newArray;
    },

    /**
     * Actualizar propiedad de un objeto
     * @param {string} key - Clave del objeto
     * @param {string} prop - Propiedad a actualizar
     * @param {*} value - Nuevo valor
     * @returns {Object} Objeto actualizado
     */
    updateObjectProp(key, prop, value) {
        const obj = this.get(key, {});

        if (typeof obj !== 'object' || Array.isArray(obj)) {
            console.error(`❌ StorageUtils.updateObjectProp: "${key}" no es un objeto`);
            return {};
        }

        obj[prop] = value;
        this.set(key, obj);
        return obj;
    },

    // ===== SESSION STORAGE =====

    /**
     * Guardar en sessionStorage
     * @param {string} key - Clave
     * @param {*} value - Valor
     * @returns {boolean}
     */
    setSession(key, value) {
        try {
            sessionStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error(`❌ StorageUtils.setSession: Error guardando "${key}"`, e);
            return false;
        }
    },

    /**
     * Obtener de sessionStorage
     * @param {string} key - Clave
     * @param {*} defaultValue - Valor por defecto
     * @returns {*}
     */
    getSession(key, defaultValue = null) {
        try {
            const item = sessionStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            console.error(`❌ StorageUtils.getSession: Error leyendo "${key}"`, e);
            return defaultValue;
        }
    },

    /**
     * Eliminar de sessionStorage
     * @param {string} key - Clave
     */
    removeSession(key) {
        sessionStorage.removeItem(key);
    },

    /**
     * Limpiar sessionStorage
     */
    clearSession() {
        sessionStorage.clear();
    }
};

// Exponer globalmente
if (typeof window !== 'undefined') {
    window.StorageUtils = StorageUtils;
}

// Export para módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StorageUtils;
}
