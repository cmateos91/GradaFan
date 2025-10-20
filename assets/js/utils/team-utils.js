/**
 * ==================== TEAM UTILITIES ====================
 * Utilidades centralizadas para manejo de equipos de LaLiga
 * Evita duplicación de código de mapeo de badges
 */

/**
 * Mapeo de nombres de equipos a rutas de badges SVG locales
 * Incluye variaciones de nombres que puede devolver la API
 */
const TEAM_BADGE_MAP = {
    // Real Madrid
    'Real Madrid CF': 'assets/img/spain_real-madrid.svg',
    'Real Madrid': 'assets/img/spain_real-madrid.svg',

    // Barcelona
    'FC Barcelona': 'assets/img/spain_barcelona.svg',
    'Barcelona': 'assets/img/spain_barcelona.svg',

    // Atlético Madrid
    'Club Atlético de Madrid': 'assets/img/spain_atletico-madrid.svg',
    'Atlético Madrid': 'assets/img/spain_atletico-madrid.svg',
    'Atlético de Madrid': 'assets/img/spain_atletico-madrid.svg',

    // Sevilla
    'Sevilla FC': 'assets/img/spain_sevilla.svg',
    'Sevilla': 'assets/img/spain_sevilla.svg',

    // Real Sociedad
    'Real Sociedad de Fútbol': 'assets/img/spain_real-sociedad.svg',
    'Real Sociedad': 'assets/img/spain_real-sociedad.svg',

    // Real Betis
    'Real Betis Balompié': 'assets/img/spain_real-betis.svg',
    'Real Betis': 'assets/img/spain_real-betis.svg',

    // Villarreal
    'Villarreal CF': 'assets/img/spain_villarreal.svg',
    'Villarreal': 'assets/img/spain_villarreal.svg',

    // Athletic Club
    'Athletic Club': 'assets/img/spain_athletic-club.svg',

    // Valencia
    'Valencia CF': 'assets/img/spain_valencia.svg',
    'Valencia': 'assets/img/spain_valencia.svg',

    // Osasuna
    'CA Osasuna': 'assets/img/spain_osasuna.svg',
    'Osasuna': 'assets/img/spain_osasuna.svg',

    // Celta Vigo
    'RC Celta de Vigo': 'assets/img/spain_celta.svg',
    'Celta Vigo': 'assets/img/spain_celta.svg',
    'Celta de Vigo': 'assets/img/spain_celta.svg',

    // Rayo Vallecano
    'Rayo Vallecano de Madrid': 'assets/img/spain_rayo-vallecano.svg',
    'Rayo Vallecano': 'assets/img/spain_rayo-vallecano.svg',

    // Mallorca
    'RCD Mallorca': 'assets/img/spain_mallorca.svg',
    'Mallorca': 'assets/img/spain_mallorca.svg',

    // Getafe
    'Getafe CF': 'assets/img/spain_getafe.svg',
    'Getafe': 'assets/img/spain_getafe.svg',

    // Girona
    'Girona FC': 'assets/img/spain_girona.svg',
    'Girona': 'assets/img/spain_girona.svg',

    // Espanyol
    'RCD Espanyol de Barcelona': 'assets/img/spain_espanyol.svg',
    'Espanyol': 'assets/img/spain_espanyol.svg',

    // Alavés (deportivo)
    'Deportivo Alavés': 'assets/img/spain_deportivo.svg',
    'Alavés': 'assets/img/spain_deportivo.svg',

    // Elche
    'Elche CF': 'assets/img/spain_elche.svg',
    'Elche': 'assets/img/spain_elche.svg',

    // Levante
    'Levante UD': 'assets/img/spain_levante.svg',
    'Levante': 'assets/img/spain_levante.svg',

    // Valladolid
    'Real Valladolid CF': 'assets/img/spain_valladolid.svg',
    'Valladolid': 'assets/img/spain_valladolid.svg',

    // Las Palmas
    'UD Las Palmas': 'assets/img/spain_las-palmas.svg',
    'Las Palmas': 'assets/img/spain_las-palmas.svg'
};

/**
 * Obtener la ruta del badge SVG de un equipo
 * @param {string} teamName - Nombre del equipo (puede ser completo o abreviado)
 * @returns {string} Ruta al archivo SVG del badge
 */
function getTeamBadge(teamName) {
    if (!teamName) {
        console.warn('⚠️ getTeamBadge: nombre de equipo vacío');
        return 'assets/img/spain_la-liga-v2.svg';
    }

    const badge = TEAM_BADGE_MAP[teamName];

    if (!badge) {
        console.warn(`⚠️ getTeamBadge: badge no encontrado para "${teamName}"`);
        return 'assets/img/spain_la-liga-v2.svg'; // Fallback al logo de LaLiga
    }

    return badge;
}

/**
 * Obtener equipo por nombre desde TEAMS_DATA
 * @param {string} teamName - Nombre del equipo
 * @returns {Object|null} Objeto del equipo o null si no se encuentra
 */
function getTeamByName(teamName) {
    if (typeof TEAMS_DATA === 'undefined') {
        console.error('❌ TEAMS_DATA no está definido. Asegúrate de cargar teams.js primero');
        return null;
    }

    return TEAMS_DATA.find(team =>
        team.name === teamName ||
        team.shortName === teamName
    ) || null;
}

/**
 * Validar que un badge existe en el sistema
 * @param {string} teamName - Nombre del equipo
 * @returns {boolean} true si el badge está mapeado
 */
function hasTeamBadge(teamName) {
    return !!TEAM_BADGE_MAP[teamName];
}

/**
 * Obtener lista de todos los nombres de equipos mapeados
 * @returns {string[]} Array con todos los nombres de equipos
 */
function getAllTeamNames() {
    return Object.keys(TEAM_BADGE_MAP);
}

// Exportar utilidades (para uso moderno)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getTeamBadge,
        getTeamByName,
        hasTeamBadge,
        getAllTeamNames,
        TEAM_BADGE_MAP
    };
}

// Disponible globalmente para uso inmediato en el proyecto
window.TeamUtils = {
    getTeamBadge,
    getTeamByName,
    hasTeamBadge,
    getAllTeamNames,
    TEAM_BADGE_MAP
};
