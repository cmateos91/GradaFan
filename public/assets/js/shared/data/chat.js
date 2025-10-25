/**
 * ==================== CHAT DATA ====================
 * Datos de mensajes del chat en vivo
 *
 * ⚠️ SOLO PARA DESARROLLO/FALLBACK ⚠️
 *
 * USO:
 * - Desarrollo: Se usa cuando no hay WebSocket/Supabase Realtime disponible
 * - Producción: Sirve como fallback si hay error de conexión
 *
 * En producción normal, los mensajes vienen de:
 * - Supabase Realtime (chat en tiempo real)
 * - WebSocket server (alternativa)
 */

// Evitar redeclaración si ya existe
window.CHAT_MESSAGES = window.CHAT_MESSAGES || [
    {
        id: 1,
        userId: 1,
        username: 'Usuario Ejemplo',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Example',
        message: 'Este es un mensaje de ejemplo del chat en vivo',
        timestamp: new Date(),
        likes: 0,
        teamId: 1
    }
];

// Alias global para compatibilidad
var CHAT_MESSAGES = window.CHAT_MESSAGES;

// Mensajes de ejemplo para simulación
window.EXAMPLE_MESSAGES = window.EXAMPLE_MESSAGES || [
    '¡Vaya golazo!',
    'Increíble jugada',
    'Qué pase más preciso',
    'El portero está en modo bestia',
    'Partidazo el de hoy',
    'Este jugador es de otro nivel',
    'Vamos equipo, se puede! 💪'
];

// Alias global para compatibilidad
var EXAMPLE_MESSAGES = window.EXAMPLE_MESSAGES;

/**
 * Obtener mensajes recientes del chat
 * @param {number} count - Número de mensajes a obtener
 * @returns {Array} - Array de mensajes
 */
function getRecentChatMessages(count = 10) {
    return CHAT_MESSAGES.slice(-count);
}

/**
 * Generar un mensaje aleatorio del chat
 * @returns {Object} - Objeto de mensaje
 */
function generateRandomChatMessage() {
    const randomUser = Math.floor(Math.random() * 20) + 1;
    const randomMessage = EXAMPLE_MESSAGES[Math.floor(Math.random() * EXAMPLE_MESSAGES.length)];
    const randomTeam = Math.floor(Math.random() * 20) + 1;

    return {
        id: Date.now() + Math.random(),
        userId: randomUser,
        username: `Usuario${randomUser}`,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=User${randomUser}`,
        message: randomMessage,
        timestamp: new Date(),
        likes: Math.floor(Math.random() * 30),
        teamId: randomTeam
    };
}

/**
 * Formatear timestamp del mensaje
 * DEPRECATED: Usar DateUtils.getRelativeTime() en su lugar
 * Se mantiene temporalmente para compatibilidad con componentes que lo usan
 */
function formatMessageTime(timestamp) {
    // Redirigir a DateUtils si está disponible
    if (typeof window.DateUtils !== 'undefined' && window.DateUtils.getRelativeTime) {
        return window.DateUtils.getRelativeTime(timestamp);
    }

    // Fallback si DateUtils no está cargado aún
    const now = new Date();
    const diff = Math.floor((now - new Date(timestamp)) / 1000);

    if (diff < 60) return 'Ahora mismo';
    if (diff < 3600) return `Hace ${Math.floor(diff / 60)} minutos`;
    if (diff < 86400) return `Hace ${Math.floor(diff / 3600)} horas`;
    return `Hace ${Math.floor(diff / 86400)} días`;
}
