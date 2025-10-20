/**
 * ==================== USERS DATA ====================
 * Datos de ejemplo de usuarios y comentarios
 * Sistema de gamificación y ranking
 */

window.USERS_DATA = window.USERS_DATA || [
    {
        id: 1,
        username: 'MadridFan92',
        displayName: 'Carlos M.',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MadridFan92',
        team: 'Real Madrid',
        teamId: 1,
        points: 15420,
        level: 'Leyenda',
        badges: ['Hincha de Oro', 'Visionario', 'Comentarista del Mes'],
        stats: {
            comments: 2345,
            likes: 8901,
            correctPredictions: 145
        },
        joinedDate: '2023-08-15'
    },
    {
        id: 2,
        username: 'CuleBarca10',
        displayName: 'María L.',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CuleBarca10',
        team: 'Barcelona',
        teamId: 2,
        points: 12890,
        level: 'Fanático',
        badges: ['Hincha de Oro', 'Top Participante'],
        stats: {
            comments: 1987,
            likes: 6543,
            correctPredictions: 98
        },
        joinedDate: '2023-09-20'
    },
    {
        id: 3,
        username: 'AtletiForever',
        displayName: 'Pedro G.',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AtletiForever',
        team: 'Atlético de Madrid',
        teamId: 3,
        points: 9876,
        level: 'Seguidor',
        badges: ['Comentarista Activo'],
        stats: {
            comments: 1432,
            likes: 4567,
            correctPredictions: 67
        },
        joinedDate: '2024-01-10'
    },
    {
        id: 4,
        username: 'SevillaFC_Ana',
        displayName: 'Ana R.',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SevillaFC_Ana',
        team: 'Sevilla',
        teamId: 4,
        points: 8234,
        level: 'Seguidor',
        badges: ['Hincha Fiel'],
        stats: {
            comments: 1123,
            likes: 3890,
            correctPredictions: 54
        },
        joinedDate: '2024-02-05'
    },
    {
        id: 5,
        username: 'RealSociedadJavi',
        displayName: 'Javier S.',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=RealSociedadJavi',
        team: 'Real Sociedad',
        teamId: 5,
        points: 6543,
        level: 'Aficionado',
        badges: [],
        stats: {
            comments: 876,
            likes: 2345,
            correctPredictions: 42
        },
        joinedDate: '2024-03-12'
    }
];

// Alias global para compatibilidad
var USERS_DATA = window.USERS_DATA;

/**
 * Obtener usuario por ID
 * @param {number} id - ID del usuario
 * @returns {object|null} - Datos del usuario o null
 */
function getUserById(id) {
    return USERS_DATA.find(user => user.id === id) || null;
}

/**
 * Obtener top usuarios por puntos
 * @param {number} limit - Número de usuarios a retornar
 * @returns {array} - Array de usuarios ordenados por puntos
 */
function getTopUsers(limit = 5) {
    return [...USERS_DATA]
        .sort((a, b) => b.points - a.points)
        .slice(0, limit);
}

/**
 * Obtener nivel del usuario según puntos
 * @param {number} points - Puntos del usuario
 * @returns {string} - Nivel del usuario
 */
function getUserLevel(points) {
    if (points >= 10000) return 'Leyenda';
    if (points >= 5000) return 'Fanático';
    if (points >= 2000) return 'Seguidor';
    return 'Aficionado';
}

/**
 * Formatear tiempo transcurrido
 * @param {Date} date - Fecha del mensaje
 * @returns {string} - Tiempo formateado
 */
function formatMessageTime(date) {
    const seconds = Math.floor((new Date() - date) / 1000);

    if (seconds < 60) return 'Ahora';
    if (seconds < 3600) return `Hace ${Math.floor(seconds / 60)}m`;
    if (seconds < 86400) return `Hace ${Math.floor(seconds / 3600)}h`;
    return `Hace ${Math.floor(seconds / 86400)}d`;
}

// Export para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        USERS_DATA,
        getUserById,
        getTopUsers,
        getUserLevel,
        formatMessageTime
    };
}
