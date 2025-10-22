/**
 * ==================== TEAMS DATA ====================
 * Datos de los 20 equipos de La Liga 2025-2026
 * Incluye: nombre, escudo, colores, estadísticas básicas
 */

const TEAMS_DATA = [
    {
        id: 1,
        name: 'Real Madrid',
        shortName: 'Real Madrid',
        logo: '/assets/img/spain_real-madrid.svg',
        colors: {
            primary: '#ffffff',
            secondary: '#000000'
        },
        stats: {
            position: 1,
            points: 45,
            wins: 14,
            draws: 3,
            losses: 2
        }
    },
    {
        id: 2,
        name: 'FC Barcelona',
        shortName: 'Barcelona',
        logo: '/assets/img/spain_barcelona.svg',
        colors: {
            primary: '#004d98',
            secondary: '#a50044'
        },
        stats: {
            position: 2,
            points: 42,
            wins: 13,
            draws: 3,
            losses: 3
        }
    },
    {
        id: 3,
        name: 'Atlético de Madrid',
        shortName: 'Atlético',
        logo: '/assets/img/spain_atletico-madrid.svg',
        colors: {
            primary: '#ce3524',
            secondary: '#ffffff'
        },
        stats: {
            position: 3,
            points: 40,
            wins: 12,
            draws: 4,
            losses: 3
        }
    },
    {
        id: 4,
        name: 'Sevilla FC',
        shortName: 'Sevilla',
        logo: '/assets/img/spain_sevilla.svg',
        colors: {
            primary: '#d81f26',
            secondary: '#ffffff'
        },
        stats: {
            position: 4,
            points: 38,
            wins: 11,
            draws: 5,
            losses: 3
        }
    },
    {
        id: 5,
        name: 'Real Sociedad',
        shortName: 'Real Sociedad',
        logo: '/assets/img/spain_real-sociedad.svg',
        colors: {
            primary: '#0050a8',
            secondary: '#ffffff'
        },
        stats: {
            position: 5,
            points: 36,
            wins: 11,
            draws: 3,
            losses: 5
        }
    },
    {
        id: 6,
        name: 'Real Betis',
        shortName: 'Betis',
        logo: '/assets/img/spain_real-betis.svg',
        colors: {
            primary: '#00954d',
            secondary: '#ffffff'
        },
        stats: {
            position: 6,
            points: 34,
            wins: 10,
            draws: 4,
            losses: 5
        }
    },
    {
        id: 7,
        name: 'Villarreal CF',
        shortName: 'Villarreal',
        logo: '/assets/img/spain_villarreal.svg',
        colors: {
            primary: '#ffe667',
            secondary: '#005187'
        },
        stats: {
            position: 7,
            points: 32,
            wins: 9,
            draws: 5,
            losses: 5
        }
    },
    {
        id: 8,
        name: 'Athletic Club',
        shortName: 'Athletic',
        logo: '/assets/img/spain_athletic-club.svg',
        colors: {
            primary: '#ee2524',
            secondary: '#ffffff'
        },
        stats: {
            position: 8,
            points: 30,
            wins: 8,
            draws: 6,
            losses: 5
        }
    },
    {
        id: 9,
        name: 'Valencia CF',
        shortName: 'Valencia',
        logo: '/assets/img/spain_valencia.svg',
        colors: {
            primary: '#ee7a34',
            secondary: '#000000'
        },
        stats: {
            position: 9,
            points: 28,
            wins: 8,
            draws: 4,
            losses: 7
        }
    },
    {
        id: 10,
        name: 'Osasuna',
        shortName: 'Osasuna',
        logo: '/assets/img/spain_osasuna.svg',
        colors: {
            primary: '#d31145',
            secondary: '#14275d'
        },
        stats: {
            position: 10,
            points: 26,
            wins: 7,
            draws: 5,
            losses: 7
        }
    },
    {
        id: 11,
        name: 'Getafe CF',
        shortName: 'Getafe',
        logo: '/assets/img/spain_getafe.svg',
        colors: {
            primary: '#005999',
            secondary: '#ffffff'
        },
        stats: {
            position: 11,
            points: 24,
            wins: 6,
            draws: 6,
            losses: 7
        }
    },
    {
        id: 12,
        name: 'Girona FC',
        shortName: 'Girona',
        logo: '/assets/img/spain_girona.svg',
        colors: {
            primary: '#cc0000',
            secondary: '#ffffff'
        },
        stats: {
            position: 12,
            points: 22,
            wins: 6,
            draws: 4,
            losses: 9
        }
    },
    {
        id: 13,
        name: 'RCD Mallorca',
        shortName: 'Mallorca',
        logo: '/assets/img/spain_mallorca.svg',
        colors: {
            primary: '#e20613',
            secondary: '#000000'
        },
        stats: {
            position: 13,
            points: 20,
            wins: 5,
            draws: 5,
            losses: 9
        }
    },
    {
        id: 14,
        name: 'Rayo Vallecano',
        shortName: 'Rayo',
        logo: '/assets/img/spain_rayo-vallecano.svg',
        colors: {
            primary: '#ee2737',
            secondary: '#ffffff'
        },
        stats: {
            position: 14,
            points: 18,
            wins: 4,
            draws: 6,
            losses: 9
        }
    },
    {
        id: 15,
        name: 'RC Celta',
        shortName: 'Celta',
        logo: '/assets/img/spain_celta.svg',
        colors: {
            primary: '#87cdee',
            secondary: '#ffffff'
        },
        stats: {
            position: 15,
            points: 16,
            wins: 4,
            draws: 4,
            losses: 11
        }
    },
    {
        id: 16,
        name: 'Deportivo Alavés',
        shortName: 'Alavés',
        logo: '/assets/img/spain_deportivo.svg',
        colors: {
            primary: '#005ca9',
            secondary: '#ffffff'
        },
        stats: {
            position: 16,
            points: 14,
            wins: 3,
            draws: 5,
            losses: 11
        }
    },
    {
        id: 17,
        name: 'RCD Espanyol',
        shortName: 'Espanyol',
        logo: '/assets/img/spain_espanyol.svg',
        colors: {
            primary: '#0078af',
            secondary: '#ffffff'
        },
        stats: {
            position: 17,
            points: 12,
            wins: 3,
            draws: 3,
            losses: 13
        }
    },
    {
        id: 18,
        name: 'Real Oviedo',
        shortName: 'Oviedo',
        logo: '/assets/img/spain_oviedo.svg',
        colors: {
            primary: '#0033a0',
            secondary: '#ffffff'
        },
        stats: {
            position: 18,
            points: 10,
            wins: 2,
            draws: 4,
            losses: 13
        }
    },
    {
        id: 19,
        name: 'Levante UD',
        shortName: 'Levante',
        logo: '/assets/img/spain_levante.svg',
        colors: {
            primary: '#004170',
            secondary: '#c1272d'
        },
        stats: {
            position: 19,
            points: 8,
            wins: 2,
            draws: 2,
            losses: 15
        }
    },
    {
        id: 20,
        name: 'Elche CF',
        shortName: 'Elche',
        logo: '/assets/img/spain_elche.svg',
        colors: {
            primary: '#00703c',
            secondary: '#ffffff'
        },
        stats: {
            position: 20,
            points: 6,
            wins: 1,
            draws: 3,
            losses: 15
        }
    }
];

/**
 * Obtener equipo por ID
 * @param {number} id - ID del equipo
 * @returns {object|null} - Datos del equipo o null si no existe
 */
function getTeamById(id) {
    return TEAMS_DATA.find(team => team.id === id) || null;
}

/**
 * Obtener equipo por nombre
 * @param {string} name - Nombre del equipo
 * @returns {object|null} - Datos del equipo o null si no existe
 */
function getTeamByName(name) {
    return TEAMS_DATA.find(team =>
        team.name.toLowerCase() === name.toLowerCase() ||
        team.shortName.toLowerCase() === name.toLowerCase()
    ) || null;
}

/**
 * Obtener tabla de clasificación ordenada
 * @returns {array} - Array de equipos ordenados por posición
 */
function getStandings() {
    return [...TEAMS_DATA].sort((a, b) => a.stats.position - b.stats.position);
}

/**
 * Obtener top N equipos
 * @param {number} n - Número de equipos a retornar
 * @returns {array} - Array de los top N equipos
 */
function getTopTeams(n = 4) {
    return getStandings().slice(0, n);
}

// Export para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TEAMS_DATA, getTeamById, getTeamByName, getStandings, getTopTeams };
}