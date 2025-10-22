const DEBATES_DATA = [
    {
        id: 1,
        title: "¿Es Bellingham el mejor fichaje del Real Madrid en los últimos años?",
        description: "Debate sobre el impacto de Jude Bellingham en el Real Madrid esta temporada",
        author: {
            id: 1,
            name: "Carlos M.",
            avatar: "/assets/img/default-avatar.svg"
        },
        externalLink: null, // Sin enlace externo, debate libre
        createdAt: "2025-10-18T10:30:00",
        updatedAt: "2025-10-20T15:45:00",
        commentsCount: 47,
        participantsCount: 23,
        likes: 156,
        category: "debates", // "debates" o "noticias"
        featured: true,
        comments: [
            {
                id: 1,
                userId: 2,
                userName: "Ana G.",
                userAvatar: "/assets/img/default-avatar.svg",
                text: "Sin duda, ha cambiado completamente el mediocampo. Goles, asistencias y liderazgo.",
                createdAt: "2025-10-18T11:00:00",
                likes: 12,
                replies: [
                    {
                        id: 2,
                        userId: 3,
                        userName: "Miguel R.",
                        userAvatar: "/assets/img/default-avatar.svg",
                        text: "Totalmente de acuerdo, además se ha adaptado increíblemente rápido",
                        createdAt: "2025-10-18T11:15:00",
                        likes: 5
                    }
                ]
            },
            {
                id: 3,
                userId: 4,
                userName: "Laura P.",
                userAvatar: "/assets/img/default-avatar.svg",
                text: "Es muy pronto para decirlo, pero va por muy buen camino",
                createdAt: "2025-10-18T12:30:00",
                likes: 8,
                replies: []
            }
        ]
    },
    {
        id: 2,
        title: "Análisis: ¿Puede el Barcelona mantener el liderazgo toda la temporada?",
        description: "Discusión sobre las posibilidades del Barça de ganar LaLiga",
        author: {
            id: 5,
            name: "Pedro S.",
            avatar: "/assets/img/default-avatar.svg"
        },
        externalLink: {
            url: "https://www.marca.com/futbol/barcelona.html",
            title: "Barcelona lidera LaLiga con autoridad",
            source: "Marca",
            image: "https://phantom-marca.unidadeditorial.es/d5f5e3d5e8f9a1b2c3d4e5f6a7b8c9d0/resize/660/f/webp/assets/multimedia/imagenes/2024/01/15/sample.jpg",
            preview: "El FC Barcelona ha comenzado la temporada con un juego brillante y resultados contundentes..."
        },
        createdAt: "2025-10-19T09:15:00",
        updatedAt: "2025-10-20T14:20:00",
        commentsCount: 89,
        participantsCount: 45,
        likes: 234,
        category: "noticias",
        featured: true,
        comments: [
            {
                id: 4,
                userId: 6,
                userName: "Javier L.",
                userAvatar: "/assets/img/default-avatar.svg",
                text: "Depende mucho de las lesiones. Si mantienen la plantilla sana, sí pueden.",
                createdAt: "2025-10-19T10:00:00",
                likes: 23,
                replies: []
            }
        ]
    },
    {
        id: 3,
        title: "¿Debería LaLiga adoptar el VAR semi-automático de la Champions?",
        description: "Debate sobre la tecnología arbitral en LaLiga",
        author: {
            id: 7,
            name: "Sofía M.",
            avatar: "/assets/img/default-avatar.svg"
        },
        externalLink: null,
        createdAt: "2025-10-20T08:00:00",
        updatedAt: "2025-10-20T16:30:00",
        commentsCount: 34,
        participantsCount: 19,
        likes: 87,
        category: "debates",
        featured: false,
        comments: []
    },
    {
        id: 4,
        title: "Griezmann anuncia su retirada de la selección francesa",
        description: "Reacciones y análisis sobre la decisión del delantero francés",
        author: {
            id: 8,
            name: "Roberto F.",
            avatar: "/assets/img/default-avatar.svg"
        },
        externalLink: {
            url: "https://twitter.com/AntoGriezmann/status/1234567890",
            title: "Griezmann: 'Es el momento de dar paso a la nueva generación'",
            source: "Twitter",
            image: null,
            preview: "Antoine Griezmann ha anunciado su retirada de la selección francesa tras años de servicio..."
        },
        createdAt: "2025-10-17T14:20:00",
        updatedAt: "2025-10-20T11:00:00",
        commentsCount: 156,
        participantsCount: 78,
        likes: 412,
        category: "noticias",
        featured: true,
        comments: []
    },
    {
        id: 5,
        title: "¿Quién es el mejor lateral derecho de LaLiga actualmente?",
        description: "Comparación entre Carvajal, Koundé, Nacho Vidal y otros laterales",
        author: {
            id: 9,
            name: "Elena T.",
            avatar: "/assets/img/default-avatar.svg"
        },
        externalLink: null,
        createdAt: "2025-10-19T16:45:00",
        updatedAt: "2025-10-20T13:15:00",
        commentsCount: 62,
        participantsCount: 31,
        likes: 143,
        category: "debates",
        featured: false,
        comments: []
    },
    {
        id: 6,
        title: "El Atlético ficha a un joven talento brasileño",
        description: "Debate sobre el nuevo fichaje y sus posibilidades en el equipo",
        author: {
            id: 10,
            name: "David K.",
            avatar: "/assets/img/avatar10.jpg"
        },
        externalLink: {
            url: "https://as.com/futbol/atletico-madrid/fichajes",
            title: "El Atlético cierra el fichaje de una joven promesa",
            source: "AS",
            image: null,
            preview: "El Atlético de Madrid ha cerrado la incorporación de un joven talento brasileño..."
        },
        createdAt: "2025-10-20T07:30:00",
        updatedAt: "2025-10-20T17:00:00",
        commentsCount: 28,
        participantsCount: 15,
        likes: 56,
        category: "noticias",
        featured: false,
        comments: []
    }
];

// Función para obtener todos los debates
function getAllDebates() {
    return DEBATES_DATA.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
}

// Función para obtener debates destacados
function getFeaturedDebates() {
    return DEBATES_DATA.filter(debate => debate.featured)
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
}

// Función para obtener un debate por ID
function getDebateById(id) {
    return DEBATES_DATA.find(debate => debate.id === parseInt(id));
}

// Función para obtener debates por categoría
function getDebatesByCategory(category) {
    return DEBATES_DATA.filter(debate => debate.category === category)
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
}

// Función para añadir un nuevo debate
function addDebate(debateData) {
    const newDebate = {
        id: Math.max(...DEBATES_DATA.map(d => d.id)) + 1,
        ...debateData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        commentsCount: 0,
        participantsCount: 0,
        likes: 0,
        comments: []
    };
    DEBATES_DATA.unshift(newDebate);
    return newDebate;
}

// Función para añadir un comentario a un debate
function addCommentToDebate(debateId, commentData) {
    const debate = getDebateById(debateId);
    if (!debate) return null;

    const newComment = {
        id: debate.comments.length + 1,
        ...commentData,
        createdAt: new Date().toISOString(),
        likes: 0,
        replies: []
    };

    debate.comments.push(newComment);
    debate.commentsCount++;
    debate.updatedAt = new Date().toISOString();

    // Actualizar participantes únicos
    const uniqueUsers = new Set(debate.comments.map(c => c.userId));
    debate.participantsCount = uniqueUsers.size;

    return newComment;
}

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.DebatesData = {
        getAll: getAllDebates,
        getFeatured: getFeaturedDebates,
        getById: getDebateById,
        getByCategory: getDebatesByCategory,
        add: addDebate,
        addComment: addCommentToDebate
    };
}
