/**
 * Utilidad para generar URLs de imágenes de equipos optimizadas por Astro
 */
import { getImage } from 'astro:assets';

// Importar todas las imágenes de equipos
const teamImages = import.meta.glob<{ default: ImageMetadata }>('../assets/img/spain_*.svg', { eager: true });

/**
 * Genera URLs optimizadas para todos los logos de equipos
 * Esto permite que JavaScript acceda a las imágenes optimizadas sin duplicarlas
 */
export async function getTeamLogosMap() {
    const logosMap: Record<string, string> = {};

    for (const [path, module] of Object.entries(teamImages)) {
        // Extraer el slug del nombre del archivo (ej: "spain_real-madrid.svg" -> "real-madrid")
        const match = path.match(/spain_(.+)\.svg$/);
        if (match) {
            const slug = match[1];

            // Generar imagen optimizada
            const optimizedImage = await getImage({
                src: module.default,
                format: 'svg'
            });

            // Guardar URL optimizada
            logosMap[slug] = optimizedImage.src;
        }
    }

    return logosMap;
}

/**
 * Mapeo de nombres de equipos a slugs
 * Usado para convertir nombres de la API a slugs de archivo
 */
export const TEAM_NAME_TO_SLUG: Record<string, string> = {
    // Real Madrid
    'Real Madrid CF': 'real-madrid',
    'Real Madrid': 'real-madrid',

    // Barcelona
    'FC Barcelona': 'barcelona',
    'Barcelona': 'barcelona',

    // Atlético Madrid
    'Club Atlético de Madrid': 'atletico-madrid',
    'Atlético Madrid': 'atletico-madrid',
    'Atlético de Madrid': 'atletico-madrid',
    'Atletico Madrid': 'atletico-madrid',

    // Sevilla
    'Sevilla FC': 'sevilla',
    'Sevilla': 'sevilla',

    // Real Sociedad
    'Real Sociedad de Fútbol': 'real-sociedad',
    'Real Sociedad': 'real-sociedad',

    // Real Betis
    'Real Betis Balompié': 'real-betis',
    'Real Betis': 'real-betis',
    'Betis': 'real-betis',

    // Villarreal
    'Villarreal CF': 'villarreal',
    'Villarreal': 'villarreal',

    // Athletic Club
    'Athletic Club': 'athletic-club',
    'Athletic': 'athletic-club',
    'Athletic Bilbao': 'athletic-club',

    // Valencia
    'Valencia CF': 'valencia',
    'Valencia': 'valencia',

    // Osasuna
    'CA Osasuna': 'osasuna',
    'Osasuna': 'osasuna',

    // Celta Vigo
    'RC Celta de Vigo': 'celta',
    'Celta Vigo': 'celta',
    'Celta de Vigo': 'celta',
    'Celta': 'celta',

    // Rayo Vallecano
    'Rayo Vallecano de Madrid': 'rayo-vallecano',
    'Rayo Vallecano': 'rayo-vallecano',
    'Rayo': 'rayo-vallecano',

    // Mallorca
    'RCD Mallorca': 'mallorca',
    'Mallorca': 'mallorca',

    // Getafe
    'Getafe CF': 'getafe',
    'Getafe': 'getafe',

    // Girona
    'Girona FC': 'girona',
    'Girona': 'girona',

    // Espanyol
    'RCD Espanyol de Barcelona': 'espanyol',
    'RCD Espanyol': 'espanyol',
    'Espanyol': 'espanyol',

    // Deportivo Alavés
    'Deportivo Alavés': 'deportivo',
    'Alavés': 'deportivo',
    'Alaves': 'deportivo',

    // Elche
    'Elche CF': 'elche',
    'Elche': 'elche',

    // Levante
    'Levante UD': 'levante',
    'Levante': 'levante',

    // Real Oviedo
    'Real Oviedo': 'oviedo',
    'Oviedo': 'oviedo'
};
