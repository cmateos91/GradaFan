/**
 * ==================== API CONFIGURATION ====================
 * Configuración de APIs externas
 *
 * INSTRUCCIONES:
 * 1. Reemplaza 'TU_API_KEY_AQUI' con tu API key de football-data.org
 * 2. NO subas este archivo a GitHub si tu repositorio es público
 * 3. Añade este archivo a .gitignore si es necesario
 */

const API_CONFIG = {
    // Football Data API
    // Obtén tu API key gratis en: https://www.football-data.org/
    FOOTBALL_DATA: {
        API_KEY: 'bc92b948c6a34800be3be7be9eedb93c', // 👈 PON TU API KEY AQUÍ
        BASE_URL: 'https://api.football-data.org/v4',
        LALIGA_CODE: 'PD', // Primera División
        LALIGA_ID: 2014,

        // Configuración de cache
        CACHE_DURATION: 5 * 60 * 1000, // 5 minutos en milisegundos

        // Rate limiting
        MAX_REQUESTS_PER_MINUTE: 10
    }
};

// Validar que la API key está configurada
function validateAPIConfig() {
    if (API_CONFIG.FOOTBALL_DATA.API_KEY === 'TU_API_KEY_AQUI') {
        console.warn('⚠️ API Key no configurada. Por favor configura tu API key en assets/js/config/api-config.js');
        return false;
    }
    return true;
}

// Export para uso global
if (typeof window !== 'undefined') {
    window.API_CONFIG = API_CONFIG;
    window.validateAPIConfig = validateAPIConfig;
}
