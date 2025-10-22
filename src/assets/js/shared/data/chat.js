/**
 * ==================== CHAT DATA ====================
 * Datos de mensajes del chat en vivo
 */

// Evitar redeclaración si ya existe
window.CHAT_MESSAGES = window.CHAT_MESSAGES || [
    {
        id: 1,
        userId: 1,
        username: 'MadridFan23',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MadridFan23',
        message: '¡Qué partidazo el de ayer! 🔥',
        timestamp: new Date(Date.now() - 2 * 60000),
        likes: 12,
        teamId: 1
    },
    {
        id: 2,
        userId: 2,
        username: 'Culé4Ever',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Cule4Ever',
        message: 'El Barça está en su mejor momento',
        timestamp: new Date(Date.now() - 5 * 60000),
        likes: 8,
        teamId: 2
    },
    {
        id: 3,
        userId: 3,
        username: 'ColchoneroLoco',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ColchoneroLoco',
        message: 'Menudo gol de Antoine 😍',
        timestamp: new Date(Date.now() - 8 * 60000),
        likes: 15,
        teamId: 3
    },
    {
        id: 4,
        userId: 4,
        username: 'SevillistaTotal',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SevillistaTotal',
        message: 'Necesitamos refuerzos en enero',
        timestamp: new Date(Date.now() - 12 * 60000),
        likes: 5,
        teamId: 4
    },
    {
        id: 5,
        userId: 5,
        username: 'ValencianistaPride',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ValencianistaPride',
        message: 'Amunt Valencia! 🦇',
        timestamp: new Date(Date.now() - 15 * 60000),
        likes: 10,
        teamId: 5
    },
    {
        id: 6,
        userId: 6,
        username: 'BilbaoZale',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=BilbaoZale',
        message: 'Nico Williams es espectacular',
        timestamp: new Date(Date.now() - 18 * 60000),
        likes: 20,
        teamId: 6
    },
    {
        id: 7,
        userId: 7,
        username: 'RealSociedadFan',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=RealSociedadFan',
        message: 'La Real jugando muy bien',
        timestamp: new Date(Date.now() - 22 * 60000),
        likes: 7,
        teamId: 7
    },
    {
        id: 8,
        userId: 8,
        username: 'BeticoLoco',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=BeticoLoco',
        message: 'Viva er Beti manque pierda! 💚',
        timestamp: new Date(Date.now() - 25 * 60000),
        likes: 14,
        teamId: 8
    },
    {
        id: 9,
        userId: 9,
        username: 'VillarrealSupporter',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=VillarrealSupporter',
        message: 'Gran temporada del submarino amarillo',
        timestamp: new Date(Date.now() - 30 * 60000),
        likes: 6,
        teamId: 9
    },
    {
        id: 10,
        userId: 10,
        username: 'CeltaFan',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CeltaFan',
        message: 'Aspas es una leyenda',
        timestamp: new Date(Date.now() - 35 * 60000),
        likes: 18,
        teamId: 10
    }
];

// Alias global para compatibilidad
var CHAT_MESSAGES = window.CHAT_MESSAGES;

// Mensajes de ejemplo para simulación
window.EXAMPLE_MESSAGES = window.EXAMPLE_MESSAGES || [
    '¡Vaya golazo!',
    'Increíble jugada',
    'No puedo creer lo que acabo de ver',
    'El árbitro está fatal hoy',
    'Menuda defensa',
    'Esto se pone emocionante',
    'Mi equipo va a ganar seguro',
    'Qué pase más preciso',
    'El portero está en modo bestia',
    'Necesitamos cambios ya',
    'La afición está encendida 🔥',
    'Partidazo el de hoy',
    'El VAR tiene que revisar eso',
    'Qué ambiente en el estadio',
    'Este jugador es de otro nivel',
    'Vamos equipo, se puede! 💪',
    'La táctica está funcionando',
    'Increíble remontada',
    'El entrenador lo está haciendo muy bien',
    'Esto va para largo'
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
 * @param {Date} timestamp - Fecha del mensaje
 * @returns {string} - Tiempo formateado
 */
function formatMessageTime(timestamp) {
    const now = new Date();
    const diff = Math.floor((now - new Date(timestamp)) / 1000); // diferencia en segundos

    if (diff < 60) {
        return 'Ahora';
    } else if (diff < 3600) {
        const minutes = Math.floor(diff / 60);
        return `Hace ${minutes}m`;
    } else if (diff < 86400) {
        const hours = Math.floor(diff / 3600);
        return `Hace ${hours}h`;
    } else {
        const days = Math.floor(diff / 86400);
        return `Hace ${days}d`;
    }
}
