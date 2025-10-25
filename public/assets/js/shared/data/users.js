/**
 * ==================== USERS DATA ====================
 * Datos de ejemplo de usuarios y comentarios
 * Sistema de gamificación y ranking
 *
 * ⚠️ SOLO PARA DESARROLLO/FALLBACK ⚠️
 *
 * USO:
 * - Desarrollo: Se usa cuando Supabase no está disponible
 * - Producción: Sirve como fallback si hay error de conexión a BD
 *
 * En producción normal, los usuarios vienen de Supabase (tabla profiles)
 */

window.USERS_DATA = window.USERS_DATA || [
    {
        id: 1,
        username: 'UsuarioEjemplo',
        displayName: 'Usuario Demo',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Demo',
        team: 'LaLiga',
        teamId: 1,
        points: 100,
        level: 'Aficionado',
        badges: [],
        stats: {
            comments: 0,
            likes: 0,
            correctPredictions: 0
        },
        joinedDate: new Date().toISOString().split('T')[0]
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

// Export para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        USERS_DATA,
        getUserById,
        getTopUsers,
        getUserLevel
    };
}
