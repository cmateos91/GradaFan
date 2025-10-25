/**
 * ==================== DEBATES CACHE SERVICE ====================
 * Servicio de caché para optimizar llamadas a Supabase
 *
 * OPTIMIZACIÓN: En lugar de hacer múltiples requests a Supabase,
 * cargamos todos los debates UNA VEZ y los cacheamos en memoria
 *
 * BENEFICIO:
 * - De 2-3 requests → 1 request
 * - Tiempo ahorrado: ~300-600ms
 * - Menos carga en Supabase
 */

window.DebatesCacheService = {
    // Caché en memoria
    _cache: null,
    _cacheTimestamp: null,
    _cacheDuration: 5 * 60 * 1000, // 5 minutos
    _loading: false,
    _loadPromise: null,

    /**
     * Obtener todos los debates (con caché)
     * @param {boolean} forceRefresh - Forzar recarga
     * @returns {Promise<Array>}
     */
    async getAllDebates(forceRefresh = false) {
        // Si ya está cargando, esperar a la promesa existente
        if (this._loading && this._loadPromise) {
            return this._loadPromise;
        }

        // Verificar si el caché es válido
        const now = Date.now();
        const cacheValid = this._cache &&
                          this._cacheTimestamp &&
                          (now - this._cacheTimestamp) < this._cacheDuration;

        if (cacheValid && !forceRefresh) {
            console.log('✅ Debates loaded from cache');
            return Promise.resolve(this._cache);
        }

        // Cargar debates desde Supabase
        this._loading = true;
        this._loadPromise = this._fetchDebates();

        try {
            const debates = await this._loadPromise;
            this._cache = debates;
            this._cacheTimestamp = now;
            console.log(`✅ Debates cached: ${debates.length} debates`);
            return debates;
        } finally {
            this._loading = false;
            this._loadPromise = null;
        }
    },

    /**
     * Fetch debates desde Supabase (método privado)
     */
    async _fetchDebates() {
        if (typeof window.DebatesService === 'undefined') {
            console.warn('⚠️ DebatesService not available');
            return [];
        }

        try {
            // Una sola llamada que obtiene TODOS los debates necesarios
            const debates = await window.DebatesService.getDebates(100);
            return debates;
        } catch (error) {
            console.error('Error fetching debates:', error);
            return [];
        }
    },

    /**
     * Obtener top debates por likes
     * @param {number} limit
     * @returns {Promise<Array>}
     */
    async getTopDebates(limit = 3) {
        const allDebates = await this.getAllDebates();

        // Ordenar por likes y tomar top N
        return allDebates
            .sort((a, b) => (b.likes || 0) - (a.likes || 0))
            .slice(0, limit);
    },

    /**
     * Obtener debates destacados
     * @param {number} limit
     * @returns {Promise<Array>}
     */
    async getFeaturedDebates(limit = 5) {
        const allDebates = await this.getAllDebates();

        // Filtrar por featured y tomar top N
        return allDebates
            .filter(d => d.featured)
            .slice(0, limit);
    },

    /**
     * Obtener debates recientes
     * @param {number} limit
     * @returns {Promise<Array>}
     */
    async getRecentDebates(limit = 10) {
        const allDebates = await this.getAllDebates();

        // Ya vienen ordenados por createdAt descendente
        return allDebates.slice(0, limit);
    },

    /**
     * Invalidar caché (forzar recarga en próxima petición)
     */
    invalidateCache() {
        this._cache = null;
        this._cacheTimestamp = null;
        console.log('🗑️ Debates cache invalidated');
    },

    /**
     * Obtener estado del caché
     */
    getCacheStatus() {
        const now = Date.now();
        const age = this._cacheTimestamp ? now - this._cacheTimestamp : null;

        return {
            cached: !!this._cache,
            count: this._cache ? this._cache.length : 0,
            age: age ? Math.round(age / 1000) : null, // segundos
            valid: age && age < this._cacheDuration
        };
    }
};

console.log('✅ Debates Cache Service loaded');
