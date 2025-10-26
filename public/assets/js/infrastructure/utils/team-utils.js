/**
 * ==================== TEAM UTILITIES ====================
 * Utilidades centralizadas para manejo de equipos de LaLiga
 * NUEVA VERSIÓN: Usa URLs optimizadas por Astro desde window.TEAM_LOGOS_MAP
 */

/**
 * Mapeo de nombres de equipos a slugs
 * Los slugs se usan para obtener URLs optimizadas de window.TEAM_LOGOS_MAP
 */
const TEAM_NAME_TO_SLUG = {
    'Real Madrid CF': 'real-madrid',
    'Real Madrid': 'real-madrid',
    'FC Barcelona': 'barcelona',
    'Barcelona': 'barcelona',
    'Club Atlético de Madrid': 'atletico-madrid',
    'Atlético Madrid': 'atletico-madrid',
    'Atlético de Madrid': 'atletico-madrid',
    'Atletico Madrid': 'atletico-madrid',
    'Sevilla FC': 'sevilla',
    'Sevilla': 'sevilla',
    'Real Sociedad de Fútbol': 'real-sociedad',
    'Real Sociedad': 'real-sociedad',
    'Real Betis Balompié': 'real-betis',
    'Real Betis': 'real-betis',
    'Betis': 'real-betis',
    'Villarreal CF': 'villarreal',
    'Villarreal': 'villarreal',
    'Athletic Club': 'athletic-club',
    'Athletic': 'athletic-club',
    'Athletic Bilbao': 'athletic-club',
    'Valencia CF': 'valencia',
    'Valencia': 'valencia',
    'CA Osasuna': 'osasuna',
    'Osasuna': 'osasuna',
    'RC Celta de Vigo': 'celta',
    'Celta Vigo': 'celta',
    'Celta de Vigo': 'celta',
    'Celta': 'celta',
    'Rayo Vallecano de Madrid': 'rayo-vallecano',
    'Rayo Vallecano': 'rayo-vallecano',
    'Rayo': 'rayo-vallecano',
    'RCD Mallorca': 'mallorca',
    'Mallorca': 'mallorca',
    'Getafe CF': 'getafe',
    'Getafe': 'getafe',
    'Girona FC': 'girona',
    'Girona': 'girona',
    'RCD Espanyol de Barcelona': 'espanyol',
    'RCD Espanyol': 'espanyol',
    'Espanyol': 'espanyol',
    'Deportivo Alavés': 'deportivo',
    'Alavés': 'deportivo',
    'Alaves': 'deportivo',
    'Elche CF': 'elche',
    'Elche': 'elche',
    'Levante UD': 'levante',
    'Levante': 'levante',
    'Real Oviedo': 'oviedo',
    'Oviedo': 'oviedo'
};

class TeamUtils {
    static getTeamBadge(teamName, apiCrest = null) {
        const slug = TEAM_NAME_TO_SLUG[teamName];
        
        if (slug && window.TEAM_LOGOS_MAP && window.TEAM_LOGOS_MAP[slug]) {
            return window.TEAM_LOGOS_MAP[slug];
        }
        
        if (apiCrest) {
            return apiCrest;
        }
        
        return '/assets/img/default-team.svg';
    }

    static getTeamSlug(teamName) {
        return TEAM_NAME_TO_SLUG[teamName] || null;
    }

    static isKnownTeam(teamName) {
        return teamName in TEAM_NAME_TO_SLUG;
    }
}

window.TeamUtils = TeamUtils;
