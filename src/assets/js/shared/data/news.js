/**
 * ==================== NEWS DATA ====================
 * Datos de ejemplo de noticias de fútbol
 * En producción, esto vendría de una API
 */

const NEWS_DATA = [
    {
        id: 1,
        title: 'El Real Madrid gana el Clásico con un Hat-Trick de Vinicius Jr.',
        summary: 'El delantero brasileño fue la estrella del partido con tres goles que sentenciaron el encuentro en el Bernabéu.',
        category: 'Partidos',
        team: 'Real Madrid',
        teamId: 1,
        image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=600&fit=crop',
        author: 'Carlos Martínez',
        authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos',
        date: '2025-01-19T14:30:00',
        views: 45672,
        comments: 1234,
        likes: 8543,
        trending: true,
        breaking: true
    },
    {
        id: 2,
        title: 'Lewandowski alcanza los 300 goles en su carrera profesional',
        summary: 'El delantero polaco del Barcelona llega a una cifra histórica tras su doblete contra el Getafe.',
        category: 'Jugadores',
        team: 'Barcelona',
        teamId: 2,
        image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&h=600&fit=crop',
        author: 'María López',
        authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
        date: '2025-01-19T12:15:00',
        views: 32145,
        comments: 856,
        likes: 5234,
        trending: true,
        breaking: false
    },
    {
        id: 3,
        title: 'El Atlético ficha a una joven promesa del fútbol brasileño',
        summary: 'Los colchoneros se adelantan a varios clubes europeos y cierran el fichaje de Gabriel Silva.',
        category: 'Fichajes',
        team: 'Atlético de Madrid',
        teamId: 3,
        image: 'https://images.unsplash.com/photo-1606925797300-0b35e9d1794e?w=800&h=600&fit=crop',
        author: 'Pedro García',
        authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Pedro',
        date: '2025-01-19T10:45:00',
        views: 28934,
        comments: 534,
        likes: 3421,
        trending: true,
        breaking: false
    },
    {
        id: 4,
        title: 'La Real Sociedad presenta su nueva equipación para la Champions',
        summary: 'Un diseño moderno que rinde homenaje a la historia del club y que se estrenará en Europa.',
        category: 'Club',
        team: 'Real Sociedad',
        teamId: 5,
        image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&h=600&fit=crop',
        author: 'Ana Ruiz',
        authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ana',
        date: '2025-01-19T09:20:00',
        views: 15678,
        comments: 234,
        likes: 1890,
        trending: false,
        breaking: false
    },
    {
        id: 5,
        title: 'Betis y Sevilla empatan en un derbi vibrante',
        summary: 'El derbi sevillano termina con un 2-2 tras un partido lleno de emociones y ocasiones para ambos equipos.',
        category: 'Partidos',
        team: 'Sevilla',
        teamId: 4,
        image: 'https://images.unsplash.com/photo-1614632537197-38a17061c2bd?w=800&h=600&fit=crop',
        author: 'Javier Sánchez',
        authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Javier',
        date: '2025-01-18T21:30:00',
        views: 42311,
        comments: 987,
        likes: 6543,
        trending: true,
        breaking: false
    },
    {
        id: 6,
        title: 'Valencia anuncia inversión millonaria para renovar Mestalla',
        summary: 'El club presenta un plan ambicioso de modernización del estadio que estará listo en 2027.',
        category: 'Club',
        team: 'Valencia',
        teamId: 9,
        image: 'https://images.unsplash.com/photo-1459865264687-595d652de67e?w=800&h=600&fit=crop',
        author: 'Laura Fernández',
        authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Laura',
        date: '2025-01-18T18:00:00',
        views: 19845,
        comments: 445,
        likes: 2876,
        trending: false,
        breaking: false
    },
    {
        id: 7,
        title: 'Griezmann renueva con el Atlético hasta 2028',
        summary: 'El delantero francés extiende su contrato con los rojiblancos y se convierte en el jugador mejor pagado.',
        category: 'Fichajes',
        team: 'Atlético de Madrid',
        teamId: 3,
        image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=600&fit=crop',
        author: 'Roberto Díaz',
        authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Roberto',
        date: '2025-01-18T16:30:00',
        views: 35421,
        comments: 756,
        likes: 4890,
        trending: false,
        breaking: false
    },
    {
        id: 8,
        title: 'Villarreal clasifica a octavos de la Europa League',
        summary: 'El submarino amarillo se impone 3-1 al equipo italiano y asegura su pase a la siguiente ronda.',
        category: 'Partidos',
        team: 'Villarreal',
        teamId: 7,
        image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=600&fit=crop',
        author: 'Miguel Ángel Torres',
        authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Miguel',
        date: '2025-01-18T15:00:00',
        views: 22567,
        comments: 389,
        likes: 3211,
        trending: false,
        breaking: false
    },
    {
        id: 9,
        title: 'Lesión de Pedri: Estará fuera 3 semanas',
        summary: 'El centrocampista del Barcelona sufre un esguince que le mantendrá alejado de los terrenos de juego.',
        category: 'Lesiones',
        team: 'Barcelona',
        teamId: 2,
        image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&h=600&fit=crop',
        author: 'Elena Martín',
        authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena',
        date: '2025-01-18T13:45:00',
        views: 31245,
        comments: 678,
        likes: 4123,
        trending: false,
        breaking: false
    },
    {
        id: 10,
        title: 'Athletic Club vence al Mallorca y escala posiciones',
        summary: 'Los leones consiguen una importante victoria que les acerca a puestos europeos.',
        category: 'Partidos',
        team: 'Athletic Club',
        teamId: 8,
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
        author: 'David Pérez',
        authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
        date: '2025-01-18T12:00:00',
        views: 18902,
        comments: 312,
        likes: 2543,
        trending: false,
        breaking: false
    }
];

/**
 * Obtener noticia por ID
 * @param {number} id - ID de la noticia
 * @returns {object|null} - Datos de la noticia o null
 */
function getNewsById(id) {
    return NEWS_DATA.find(news => news.id === id) || null;
}

/**
 * Obtener noticias por equipo
 * @param {string} teamName - Nombre del equipo
 * @returns {array} - Array de noticias del equipo
 */
function getNewsByTeam(teamName) {
    return NEWS_DATA.filter(news =>
        news.team.toLowerCase() === teamName.toLowerCase()
    );
}

/**
 * Obtener noticias trending
 * @param {number} limit - Número máximo de noticias
 * @returns {array} - Array de noticias trending
 */
function getTrendingNews(limit = 5) {
    return NEWS_DATA
        .filter(news => news.trending)
        .sort((a, b) => b.views - a.views)
        .slice(0, limit);
}

/**
 * Obtener noticias breaking
 * @returns {array} - Array de noticias breaking
 */
function getBreakingNews() {
    return NEWS_DATA.filter(news => news.breaking);
}

/**
 * Obtener todas las noticias ordenadas por fecha
 * @param {number} limit - Número máximo de noticias
 * @returns {array} - Array de noticias ordenadas
 */
function getAllNews(limit = 10) {
    return [...NEWS_DATA]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, limit);
}

/**
 * Formatear fecha relativa (hace X minutos/horas)
 * @param {string} dateString - Fecha en formato ISO
 * @returns {string} - Fecha formateada
 */
function formatRelativeTime(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) {
        return 'Hace menos de 1 minuto';
    } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return `Hace ${minutes} minuto${minutes > 1 ? 's' : ''}`;
    } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `Hace ${hours} hora${hours > 1 ? 's' : ''}`;
    } else {
        const days = Math.floor(diffInSeconds / 86400);
        return `Hace ${days} día${days > 1 ? 's' : ''}`;
    }
}

/**
 * Formatear número con K o M
 * @param {number} num - Número a formatear
 * @returns {string} - Número formateado
 */
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

/**
 * Obtener top 3 noticias por likes
 * @returns {array} - Array con las 3 noticias más populares
 */
function getTop3NewsByLikes() {
    return [...NEWS_DATA]
        .sort((a, b) => b.likes - a.likes)
        .slice(0, 3);
}

// Export para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        NEWS_DATA,
        getNewsById,
        getNewsByTeam,
        getTrendingNews,
        getBreakingNews,
        getAllNews,
        formatRelativeTime,
        formatNumber,
        getTop3NewsByLikes
    };
}