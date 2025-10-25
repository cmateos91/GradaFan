/**
 * ==================== DATE UTILITIES ====================
 * Utilidades para manejo de fechas
 * Formato español y operaciones comunes
 *
 * @version 1.0.0
 */

const DateUtils = {
    /**
     * Formatear fecha a string español
     * @param {Date|string|number} date - Fecha a formatear
     * @param {Object} options - Opciones de formato
     * @returns {string} Fecha formateada
     */
    formatDate(date, options = {}) {
        const defaults = {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };

        try {
            return new Date(date).toLocaleDateString('es-ES', {
                ...defaults,
                ...options
            });
        } catch (e) {
            console.error('Error formateando fecha:', e);
            return '';
        }
    },

    /**
     * Formatear fecha y hora
     * @param {Date|string|number} date - Fecha a formatear
     * @returns {string} Fecha y hora formateada
     */
    formatDateTime(date) {
        return this.formatDate(date, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    /**
     * Formatear solo hora
     * @param {Date|string|number} date - Fecha
     * @returns {string} Hora formateada (ej: "14:30")
     */
    formatTime(date) {
        try {
            return new Date(date).toLocaleTimeString('es-ES', {
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (e) {
            console.error('Error formateando hora:', e);
            return '';
        }
    },

    /**
     * Obtener diferencia en minutos
     * @param {Date|string|number} date1 - Fecha inicial
     * @param {Date|string|number} date2 - Fecha final
     * @returns {number} Diferencia en minutos
     */
    minutesDiff(date1, date2) {
        const d1 = new Date(date1);
        const d2 = new Date(date2);
        return Math.floor((d2 - d1) / 60000);
    },

    /**
     * Obtener diferencia en horas
     * @param {Date|string|number} date1 - Fecha inicial
     * @param {Date|string|number} date2 - Fecha final
     * @returns {number} Diferencia en horas
     */
    hoursDiff(date1, date2) {
        return Math.floor(this.minutesDiff(date1, date2) / 60);
    },

    /**
     * Obtener diferencia en días
     * @param {Date|string|number} date1 - Fecha inicial
     * @param {Date|string|number} date2 - Fecha final
     * @returns {number} Diferencia en días
     */
    daysDiff(date1, date2) {
        const d1 = new Date(date1);
        const d2 = new Date(date2);

        // Reset hours to midnight
        d1.setHours(0, 0, 0, 0);
        d2.setHours(0, 0, 0, 0);

        return Math.floor((d2 - d1) / (1000 * 60 * 60 * 24));
    },

    /**
     * Verificar si es hoy
     * @param {Date|string|number} date - Fecha a verificar
     * @returns {boolean}
     */
    isToday(date) {
        const today = new Date();
        const check = new Date(date);

        return check.toDateString() === today.toDateString();
    },

    /**
     * Verificar si es mañana
     * @param {Date|string|number} date - Fecha a verificar
     * @returns {boolean}
     */
    isTomorrow(date) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const check = new Date(date);

        return check.toDateString() === tomorrow.toDateString();
    },

    /**
     * Verificar si es ayer
     * @param {Date|string|number} date - Fecha a verificar
     * @returns {boolean}
     */
    isYesterday(date) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const check = new Date(date);

        return check.toDateString() === yesterday.toDateString();
    },

    /**
     * Obtener fecha relativa (hace 5 minutos, ayer, etc.)
     * @param {Date|string|number} date - Fecha
     * @returns {string} Descripción relativa
     */
    getRelativeTime(date) {
        const now = new Date();
        const past = new Date(date);
        const diffMs = now - past;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 1) return 'Ahora mismo';
        if (diffMins < 60) return `Hace ${diffMins} ${diffMins === 1 ? 'minuto' : 'minutos'}`;
        if (diffHours < 24) return `Hace ${diffHours} ${diffHours === 1 ? 'hora' : 'horas'}`;
        if (diffDays < 7) return `Hace ${diffDays} ${diffDays === 1 ? 'día' : 'días'}`;

        return this.formatDate(date, { month: 'short', day: 'numeric' });
    },

    /**
     * Obtener nombre del día de la semana
     * @param {Date|string|number} date - Fecha
     * @returns {string} Nombre del día (Lunes, Martes, etc.)
     */
    getDayName(date) {
        const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        return days[new Date(date).getDay()];
    },

    /**
     * Obtener nombre del mes
     * @param {Date|string|number} date - Fecha
     * @returns {string} Nombre del mes (Enero, Febrero, etc.)
     */
    getMonthName(date) {
        const months = [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];
        return months[new Date(date).getMonth()];
    },

    /**
     * Añadir días a una fecha
     * @param {Date|string|number} date - Fecha base
     * @param {number} days - Días a añadir
     * @returns {Date} Nueva fecha
     */
    addDays(date, days) {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    },

    /**
     * Obtener rango de fechas (hoy, mañana, fecha específica)
     * @param {Date|string|number} date - Fecha
     * @returns {Object} {text, day, month}
     */
    getDateInfo(date) {
        const d = new Date(date);

        let dayText;
        if (this.isToday(d)) {
            dayText = 'Hoy';
        } else if (this.isTomorrow(d)) {
            dayText = 'Mañana';
        } else if (this.isYesterday(d)) {
            dayText = 'Ayer';
        } else {
            dayText = d.getDate().toString();
        }

        return {
            text: dayText,
            day: d.getDate(),
            month: this.getMonthName(d).slice(0, 3), // Ene, Feb, etc.
            time: this.formatTime(d),
            weekday: this.getDayName(d)
        };
    },

    /**
     * Verificar si una fecha es válida
     * @param {*} date - Valor a verificar
     * @returns {boolean}
     */
    isValidDate(date) {
        const d = new Date(date);
        return d instanceof Date && !isNaN(d);
    },

    /**
     * Obtener timestamp actual
     * @returns {number} Timestamp en milisegundos
     */
    now() {
        return Date.now();
    },

    /**
     * Crear fecha desde componentes
     * @param {number} year - Año
     * @param {number} month - Mes (1-12)
     * @param {number} day - Día
     * @param {number} hour - Hora (opcional)
     * @param {number} minute - Minuto (opcional)
     * @returns {Date}
     */
    create(year, month, day, hour = 0, minute = 0) {
        return new Date(year, month - 1, day, hour, minute);
    }
};

// Exponer globalmente
if (typeof window !== 'undefined') {
    window.DateUtils = DateUtils;
}

// Export para módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DateUtils;
}
