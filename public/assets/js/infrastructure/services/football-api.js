/**
 * ==================== FOOTBALL DATA API SERVICE ====================
 * Servicio para conectarse a football-data.org API
 * Incluye cache, rate limiting y manejo de errores
 */

class FootballDataAPI {
    constructor() {
        this.config = API_CONFIG.FOOTBALL_DATA;
        this.cache = new Map();
        this.requestCount = 0;
        this.lastRequestMinute = Date.now();
    }

    /**
     * Verificar rate limiting
     */
    checkRateLimit() {
        const now = Date.now();
        const minuteElapsed = now - this.lastRequestMinute;

        // Resetear contador cada minuto
        if (minuteElapsed > 60000) {
            this.requestCount = 0;
            this.lastRequestMinute = now;
        }

        // Verificar límite
        if (this.requestCount >= this.config.MAX_REQUESTS_PER_MINUTE) {
            console.warn('⚠️ Rate limit alcanzado. Espera un momento...');
            return false;
        }

        return true;
    }

    /**
     * Obtener datos de cache si están disponibles
     */
    getFromCache(key) {
        const cached = this.cache.get(key);

        if (!cached) return null;

        const now = Date.now();
        const isExpired = now - cached.timestamp > this.config.CACHE_DURATION;

        if (isExpired) {
            this.cache.delete(key);
            return null;
        }

        console.log(`✅ Datos obtenidos de cache: ${key}`);
        return cached.data;
    }

    /**
     * Guardar datos en cache
     */
    saveToCache(key, data) {
        this.cache.set(key, {
            data,
            timestamp: Date.now()
        });
    }

    /**
     * Realizar petición HTTP a la API
     */
    async request(endpoint) {
        // Validar API key
        if (!validateAPIConfig()) {
            throw new Error('API key no configurada');
        }

        // Verificar rate limiting
        if (!this.checkRateLimit()) {
            throw new Error('Rate limit excedido. Espera 1 minuto.');
        }

        // Verificar cache
        const cached = this.getFromCache(endpoint);
        if (cached) return cached;

        try {
            this.requestCount++;

            const url = `${this.config.BASE_URL}${endpoint}`;
            console.log(`🔄 Fetching via proxy: ${url}`);

            // No enviamos X-Auth-Token porque el proxy lo maneja server-side
            const response = await fetch(url, {
                method: 'GET'
            });

            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();

            // Guardar en cache
            this.saveToCache(endpoint, data);

            console.log(`✅ Datos obtenidos de API: ${endpoint}`);
            return data;

        } catch (error) {
            console.error('❌ Error en API request:', error);
            throw error;
        }
    }

    /**
     * Obtener clasificación de LaLiga
     */
    async getStandings() {
        return await this.request(`/competitions/${this.config.LALIGA_CODE}/standings`);
    }

    /**
     * Obtener partidos de LaLiga
     */
    async getMatches(status = null) {
        let endpoint = `/competitions/${this.config.LALIGA_CODE}/matches`;

        // status puede ser: SCHEDULED, LIVE, IN_PLAY, PAUSED, FINISHED
        if (status) {
            endpoint += `?status=${status}`;
        }

        return await this.request(endpoint);
    }

    /**
     * Obtener partidos en vivo
     * Cache de solo 30 segundos para datos en tiempo real
     */
    async getLiveMatches() {
        const endpoint = `/competitions/${this.config.LALIGA_CODE}/matches?status=IN_PLAY`;

        // Para partidos en vivo, usamos cache más corto
        const cached = this.cache.get(endpoint);
        if (cached && (Date.now() - cached.timestamp < 30000)) { // 30 segundos
            console.log(`✅ Partidos en vivo desde cache`);
            return cached.data;
        }

        // Si no hay cache válido, hacer request
        const data = await this.request(endpoint);
        return data;
    }

    /**
     * Obtener próximos partidos
     */
    async getUpcomingMatches(limit = 5) {
        const data = await this.getMatches('SCHEDULED');

        // Ordenar por fecha y tomar los primeros N
        if (data && data.matches) {
            return {
                ...data,
                matches: data.matches
                    .sort((a, b) => new Date(a.utcDate) - new Date(b.utcDate))
                    .slice(0, limit)
            };
        }

        return data;
    }

    /**
     * Obtener goleadores de LaLiga
     */
    async getScorers() {
        return await this.request(`/competitions/${this.config.LALIGA_CODE}/scorers`);
    }

    /**
     * Obtener equipos de LaLiga
     */
    async getTeams() {
        return await this.request(`/competitions/${this.config.LALIGA_CODE}/teams`);
    }

    /**
     * Obtener información de un equipo específico
     */
    async getTeam(teamId) {
        return await this.request(`/teams/${teamId}`);
    }

    /**
     * Limpiar cache manualmente
     */
    clearCache() {
        this.cache.clear();
        console.log('🗑️ Cache limpiado');
    }
}

// Crear instancia global
if (typeof window !== 'undefined') {
    window.footballAPI = new FootballDataAPI();
}
