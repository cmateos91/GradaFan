/**
 * ==================== DEBATES DATA ====================
 * Datos de ejemplo de debates de la comunidad
 *
 * ⚠️ SOLO PARA DESARROLLO/FALLBACK ⚠️
 *
 * USO:
 * - Desarrollo: Se usa cuando Supabase no está disponible
 * - Producción: Sirve como fallback si hay error de conexión a BD
 *
 * En producción normal, los debates vienen de Supabase
 * Ver: debates-service-global.js
 */

const DEBATES_DATA = [
    {
        id: 1,
        title: "Ejemplo: ¿Cuál es tu opinión sobre la temporada actual de LaLiga?",
        description: "Este es un debate de ejemplo. Conecta tu base de datos para permitir debates reales de usuarios.",
        author: {
            id: 1,
            name: "Admin",
            avatar: "/assets/img/default-avatar.svg"
        },
        externalLink: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        commentsCount: 2,
        participantsCount: 2,
        likes: 5,
        category: "debates",
        featured: true,
        comments: [
            {
                id: 1,
                userId: 1,
                userName: "Usuario Ejemplo 1",
                userAvatar: "/assets/img/default-avatar.svg",
                text: "Este es un comentario de ejemplo. Los debates reales vendrían de tu base de datos.",
                createdAt: new Date().toISOString(),
                likes: 2,
                replies: [
                    {
                        id: 2,
                        userId: 2,
                        userName: "Usuario Ejemplo 2",
                        userAvatar: "/assets/img/default-avatar.svg",
                        text: "Esta es una respuesta de ejemplo.",
                        createdAt: new Date().toISOString(),
                        likes: 1
                    }
                ]
            }
        ]
    }
];

/**
 * Clase para gestionar datos de debates
 */
class DebatesData {
    constructor() {
        this.debates = DEBATES_DATA;
    }

    /**
     * Obtener todos los debates
     */
    getAll() {
        return this.debates;
    }

    /**
     * Obtener un debate por ID
     * @param {string|number} id - ID del debate
     */
    getById(id) {
        return this.debates.find(debate => debate.id == id);
    }

    /**
     * Obtener debates destacados
     */
    getFeatured() {
        return this.debates.filter(debate => debate.featured);
    }

    /**
     * Obtener debates por categoría
     * @param {string} category - Categoría ("debates" o "noticias")
     */
    getByCategory(category) {
        return this.debates.filter(debate => debate.category === category);
    }

    /**
     * Obtener debates ordenados por popularidad
     * @param {number} limit - Número máximo de debates
     */
    getTopDebates(limit = 5) {
        return [...this.debates]
            .sort((a, b) => b.likes - a.likes)
            .slice(0, limit);
    }

    /**
     * Obtener debates ordenados por actividad reciente
     * @param {number} limit - Número máximo de debates
     */
    getRecentDebates(limit = 5) {
        return [...this.debates]
            .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
            .slice(0, limit);
    }
}

// Instancia global
if (typeof window !== 'undefined') {
    window.DebatesData = new DebatesData();
}

// Export para Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DEBATES_DATA, DebatesData };
}
