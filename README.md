# ⚽ GradaFan - Red Social de Noticias de Fútbol

Una plataforma moderna de noticias de fútbol español que combina información en tiempo real con interacción comunitaria, creando una experiencia única tipo "red social" para aficionados de La Liga.

## 🎯 Concepto

LaLiga Social no es solo un portal de noticias deportivas - es una **comunidad interactiva** donde los fans pueden:

- 📰 Seguir noticias de los 20 equipos de 1ª División
- 💬 Participar en chats en vivo durante partidos
- ⭐ Ganar puntos según los likes en sus comentarios
- 👑 Competir en rankings de usuarios
- 🔥 Descubrir trending topics en tiempo real
- ⚽ Ver partidos en vivo y estadísticas actualizadas

**Diferenciador clave:** Mientras otros sitios se centran solo en las noticias, LaLiga Social pone el foco en **la comunidad y la interacción entre usuarios**.

---

## ✨ Características Principales

### 🎮 Gamificación
- **Sistema de Puntos**: Los usuarios ganan puntos según los likes en sus comentarios
- **Niveles y Badges**: Leyenda, Experto, Aficionado con badges personalizados
- **Ranking Global**: Leaderboard de top usuarios en la sidebar

### 💬 Interacción Social
- **Chat en Vivo**: Conversaciones en tiempo real durante partidos
- **Comentarios**: Sistema de comentarios con likes/respuestas
- **Comunidad por Equipos**: Filtra noticias de tu equipo favorito

### 📊 Contenido Dinámico
- **Noticias Trending**: Algoritmo que destaca lo más popular
- **Partidos en Vivo**: Marcadores actualizados en tiempo real
- **Estadísticas**: Clasificación, goleadores, asistencias

### 🎨 Efectos Modernos
- **Smooth Scroll**: Navegación fluida con Lenis
- **3D Tilt Cards**: Tarjetas interactivas con efecto parallax
- **Reveal Animations**: Elementos que aparecen al hacer scroll
- **Parallax Images**: Movimiento sutil en imágenes de fondo

---

## 📁 Estructura del Proyecto

```
LaLiga-Social/
│
├── src/                                # Código fuente
│   ├── pages/                          # Páginas HTML
│   │   ├── index.html                  # Página principal
│   │   ├── clasificacion.html          # Tabla de posiciones
│   │   ├── en-vivo.html                # Partidos en vivo
│   │   └── debate.html                 # Vista de debate
│   │
│   ├── components/                     # Componentes reutilizables
│   │   ├── navbar.html                 # Barra de navegación
│   │   ├── footer.html                 # Pie de página
│   │   └── teams-bar.html              # Barra de equipos
│   │
│   └── assets/                         # Assets del proyecto
│       ├── css/                        # Estilos (SMACSS)
│       │   ├── base/                   # Reset y fundamentos
│       │   ├── layout/                 # Layouts principales
│       │   ├── modules/                # Componentes modulares
│       │   ├── pages/                  # Estilos por página
│       │   ├── state/                  # Estados y utilidades
│       │   └── main.css                # Punto de entrada
│       │
│       ├── js/                         # JavaScript (DDD)
│       │   ├── application/            # Capa de aplicación
│       │   │   ├── components/        # Componentes UI
│       │   │   ├── config/            # Configuración
│       │   │   └── app.js             # Bootstrap
│       │   │
│       │   ├── infrastructure/         # Capa de infraestructura
│       │   │   ├── core/              # Funcionalidades core
│       │   │   ├── services/          # Servicios externos
│       │   │   └── utils/             # Utilidades
│       │   │
│       │   └── shared/                 # Capa compartida
│       │       └── data/               # Datos mock
│       │
│       └── img/                        # Imágenes
│
├── docs/                               # Documentación
│   ├── ARCHITECTURE.md                 # Arquitectura detallada
│   └── API_SETUP.md                    # Configuración de API
│
├── scripts/                            # Scripts de utilidad
│   └── INICIAR_SERVIDOR.bat           # Iniciar dev server
│
├── public/                             # Assets estáticos públicos
│   └── robots.txt
│
├── dist/                               # Build de producción (generado)
│
├── package.json                        # Configuración npm
├── vite.config.js                      # Configuración Vite
└── README.md                           # Este archivo
```

> **Nota:** Ver [ARCHITECTURE.md](docs/ARCHITECTURE.md) para documentación completa de la arquitectura.

---

## 🏗️ Arquitectura

### CSS Modular

El CSS está dividido en **6 archivos** para mejor organización:

1. **variables.css**: Sistema de diseño centralizado
   - Colores (primarios, secundarios, equipos)
   - Espaciado (xs, sm, md, lg, xl, 2xl, 3xl, 4xl)
   - Tipografía (tamaños, pesos, line-heights)
   - Transiciones y easings
   - Sombras y efectos
   - Z-index hierarchy

2. **base.css**: Fundamentos
   - CSS Reset (normalize)
   - Tipografía base
   - Utilidades (sr-only, skip-to-content)
   - Scrollbar personalizado
   - Accesibilidad (prefers-reduced-motion)

3. **layout.css**: Estructura
   - Navbar sticky
   - Hero section
   - Grid principal (sidebar + feed)
   - Footer

4. **components.css**: Componentes reutilizables
   - Botones (primary, secondary, icon)
   - Chat (mensajes, input, header)
   - Hero (stats, badges, meta)
   - Widgets de sidebar
   - News cards

5. **effects.css**: Efectos visuales
   - 3D Tilt Cards (preserve-3d, rotateX/Y)
   - Reveal animations (fade, slide, scale)
   - Parallax wrappers
   - Pulse animations (live badges)
   - Optimizaciones (will-change, backface-visibility)

6. **responsive.css**: Adaptabilidad
   - Mobile (< 768px)
   - Tablet (768px - 1024px)
   - Desktop (> 1024px)
   - Print styles

### JavaScript Modular

El JavaScript está organizado en **módulos independientes**:

#### 📊 Data Layer (`data/`)
- **teams.js**: Datos de equipos + helpers (getTeamById, getStandings)
- **news.js**: Noticias + utilities (formatRelativeTime, getTrendingNews)
- **users.js**: Usuarios + chat (generateRandomChatMessage)

#### ⚙️ Core Layer (`core/`)
- **smooth-scroll.js**: Wrapper de Lenis con anchor scrolling
- **tilt-cards.js**: Sistema completo de 3D tilt con parallax multi-capa
- **parallax.js**: Scroll parallax para imágenes

#### 🧩 Components Layer (`components/`)
- **navbar.js**: Navegación + dropdown de equipos + scroll effects
- **chat.js**: Chat en vivo con simulación de mensajes
- **news-feed.js**: Renderizado de noticias + filtros + paginación
- **sidebar.js**: Trending, matches, top users

#### 🚀 Application Layer
- **app.js**: Orquestador principal
  - Inicialización de componentes
  - Event listeners globales
  - Reveal animations
  - Performance monitoring

---

## 🎨 Sistema de Diseño

### Colores Principales

```css
--color-primary: #00ff88;      /* Verde neón - Interacciones sociales */
--color-secondary: #0066ff;    /* Azul - Links y botones */
--color-accent: #ff0066;       /* Rosa/Rojo - Destacados */
--color-live: #ff0033;         /* Rojo vivo - Partidos en directo */
--color-trending: #ff6b35;     /* Naranja - Trending topics */
```

### Colores de Equipos

Cada equipo tiene su color oficial almacenado en `TEAMS_DATA`:

```javascript
{
    name: 'Real Madrid',
    colors: {
        primary: '#ffffff',
        secondary: '#00529f'
    }
}
```

### Espaciado Consistente

```css
--spacing-xs:   4px
--spacing-sm:   8px
--spacing-md:   16px
--spacing-lg:   24px
--spacing-xl:   32px
--spacing-2xl:  48px
--spacing-3xl:  64px
--spacing-4xl:  96px
```

---

## 🔧 Tecnologías Utilizadas

### Stack Principal
- **HTML5**: Estructura semántica
- **CSS3**: Variables, Grid, Flexbox, 3D Transforms
- **Vanilla JavaScript**: Clases ES6, módulos
- **Lenis**: Smooth scroll (única dependencia externa)

### Técnicas Avanzadas
- **IntersectionObserver**: Lazy animations y performance
- **requestAnimationFrame**: 60fps animations
- **Custom Events**: Comunicación entre componentes
- **CSS Custom Properties**: Theming dinámico
- **3D CSS Transforms**: preserve-3d, perspective
- **CSS Grid**: Layouts complejos
- **Event Delegation**: Optimización de listeners

### Performance
- ✅ GPU-accelerated animations (transform, opacity)
- ✅ `will-change` en elementos animados
- ✅ Conditional 3D effects (desktop only)
- ✅ Lazy loading de animaciones
- ✅ Debounced resize handlers
- ✅ Pause animations en tab hidden
- ✅ Respeta `prefers-reduced-motion`

---

## 🚀 Instalación y Uso

### Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/laliga-social.git
cd laliga-social

# 2. Instalar dependencias
npm install
```

### Desarrollo

```bash
# Iniciar servidor de desarrollo (puerto 3000)
npm run dev

# O usar el script de Windows
scripts/INICIAR_SERVIDOR.bat
```

El navegador se abrirá automáticamente en `http://localhost:3000`

### Build de Producción

```bash
# Generar build optimizado
npm run build

# Preview del build
npm run preview
```

Los archivos se generarán en la carpeta `dist/`

---

## 📖 Cómo Extender el Proyecto

### Añadir Nuevos Equipos

Edita `assets/js/data/teams.js`:

```javascript
{
    id: 21,
    name: 'Nuevo Equipo CF',
    shortName: 'Nuevo',
    logo: 'https://url-del-escudo.svg',
    colors: {
        primary: '#FF0000',
        secondary: '#000000'
    },
    stats: {
        position: 10,
        points: 30,
        played: 20,
        won: 8,
        drawn: 6,
        lost: 6,
        goalsFor: 25,
        goalsAgainst: 22
    }
}
```

### Añadir Nuevas Noticias

Edita `assets/js/data/news.js`:

```javascript
{
    id: 100,
    title: 'Título de la noticia',
    excerpt: 'Resumen breve...',
    image: 'https://imagen-noticia.jpg',
    category: 'Partidos', // o 'Fichajes', 'Entrevistas', 'Análisis'
    team: 'Real Madrid',
    teamId: 1,
    author: 'NombreAutor',
    date: '2025-01-15T10:30:00',
    comments: 50,
    likes: 200,
    shares: 30,
    trending: false,
    breaking: false,
    live: false
}
```

### Conectar con API Real

Reemplaza las funciones en `data/` con llamadas fetch:

```javascript
// Antes (mock data)
function getNews() {
    return NEWS_DATA;
}

// Después (API real)
async function getNews() {
    const response = await fetch('https://api.laligasocial.com/news');
    return await response.json();
}
```

### Añadir Nuevos Widgets en Sidebar

En `assets/js/components/sidebar.js`:

```javascript
class Sidebar {
    renderCustomWidget() {
        const widget = document.createElement('div');
        widget.className = 'sidebar-widget';
        widget.innerHTML = `
            <h3 class="widget-title">🎯 Mi Widget</h3>
            <div class="widget-content">
                <!-- Contenido del widget -->
            </div>
        `;
        this.sidebar.appendChild(widget);
    }
}
```

### Personalizar Efectos 3D

En `assets/js/core/tilt-cards.js`:

```javascript
this.settings = {
    maxTilt: 8,        // Grados de inclinación (aumentar para más efecto)
    perspective: 1200, // Perspectiva 3D (menor = más dramático)
    scale: 1.02,       // Escala en hover (1.05 = 5% más grande)
    speed: 400,        // Velocidad transición (ms)
};
```

### Cambiar Velocidad de Smooth Scroll

En `assets/js/core/smooth-scroll.js`:

```javascript
this.lenis = new Lenis({
    duration: 1.2,  // Aumentar para más lento (1.5, 2.0)
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
});
```

---

## 🎯 Características Avanzadas

### Sistema de Eventos Personalizados

El proyecto usa custom events para comunicación entre componentes:

```javascript
// Componente A emite evento
document.dispatchEvent(new CustomEvent('teamSelected', {
    detail: { teamId: 1, teamName: 'Real Madrid' }
}));

// Componente B escucha evento
document.addEventListener('teamSelected', (e) => {
    console.log('Team selected:', e.detail);
    // Actualizar UI según el equipo
});
```

**Eventos disponibles:**
- `teamSelected`: Usuario selecciona equipo
- `newsClicked`: Click en noticia
- `trendingClicked`: Click en trending topic
- `matchClicked`: Click en partido
- `userClicked`: Click en usuario

### 3D Tilt Multi-Layer Parallax

Las tarjetas soportan múltiples capas con profundidad:

```html
<div class="news-card" data-tilt>
    <div class="card-inner">
        <div class="card-bg" data-depth="0.5">
            <img src="fondo.jpg">
        </div>
        <div class="card-content" data-depth="1">
            <!-- Contenido en primer plano -->
        </div>
    </div>
    <div class="card-shine"></div>
</div>
```

**data-depth values:**
- `0.2` - Muy sutil (fondo lejano)
- `0.5` - Medio (imágenes de fondo)
- `1.0` - Fuerte (contenido principal)
- `1.5` - Muy fuerte (elementos destacados)

### Scroll Reveal con Delays

```html
<div class="reveal-fade" data-delay="0">    <!-- Sin delay -->
<div class="reveal-left" data-delay="0.1">  <!-- 100ms delay -->
<div class="reveal-right" data-delay="0.2"> <!-- 200ms delay -->
```

**Tipos de reveal:**
- `.reveal-fade`: Aparece con fade-in
- `.reveal-left`: Entra desde la izquierda
- `.reveal-right`: Entra desde la derecha
- `.reveal-scale`: Escala desde pequeño

---

## 📱 Responsive Design

### Breakpoints

```css
/* Mobile First */
@media (max-width: 767px) {
    /* Mobile */
    - Stack vertical
    - Sidebar oculta (mostrar con botón)
    - 3D effects disabled
    - Chat reducido
}

@media (min-width: 768px) and (max-width: 1023px) {
    /* Tablet */
    - Grid 2 columnas
    - Sidebar colapsable
    - 3D effects simplificados
}

@media (min-width: 1024px) {
    /* Desktop */
    - Experiencia completa
    - 3D tilt activado
    - Parallax activado
}
```

### Mobile Optimizations

```javascript
// Detectar mobile
const isMobile = window.innerWidth <= 768 || ('ontouchstart' in window);

if (isMobile) {
    // Deshabilitar efectos pesados
    // Simplificar animaciones
    // Reducir carga de datos
}
```

---

## ⚡ Performance Tips

### GPU Acceleration

```css
.animated-element {
    will-change: transform, opacity;
    transform: translateZ(0); /* Force GPU layer */
}
```

### Debounced Resize

```javascript
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // Código que se ejecuta después del resize
    }, 250);
});
```

### Lazy Loading de Animaciones

```javascript
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Activar animación solo cuando es visible
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target); // Dejar de observar
        }
    });
});
```

---

## 🎮 Gamificación - Sistema de Puntos

### Niveles de Usuario

```javascript
const USER_LEVELS = {
    'Novato': { min: 0, max: 999 },
    'Aficionado': { min: 1000, max: 4999 },
    'Experto': { min: 5000, max: 9999 },
    'Leyenda': { min: 10000, max: Infinity }
};
```

### Badges Disponibles

- 🥇 **Hincha de Oro**: 10,000+ puntos
- 👁️ **Visionario**: Primera predicción correcta
- 💬 **Comentarista Pro**: 100+ comentarios
- 🔥 **Trendsetter**: Trending topic iniciado
- ⚡ **Rayo**: Respuesta en menos de 1 minuto
- 🎯 **Preciso**: 10 predicciones correctas seguidas

### Ganar Puntos

- 👍 Like en comentario: +10 puntos
- 💬 Comentario con 10+ likes: +50 puntos
- 🔥 Trending topic: +100 puntos
- 🎯 Predicción correcta: +200 puntos
- 👑 Top 10 semanal: +500 puntos

---

## 🌐 Futuras Mejoras (Roadmap)

### Versión 2.0
- [ ] Backend con Node.js + Express
- [ ] Base de datos (MongoDB/PostgreSQL)
- [ ] Autenticación de usuarios (OAuth, JWT)
- [ ] API REST para noticias/comentarios
- [ ] WebSockets para chat en tiempo real
- [ ] Sistema de notificaciones push

### Versión 3.0
- [ ] App móvil (React Native)
- [ ] Modo oscuro/claro (toggle)
- [ ] Personalización de temas por equipo
- [ ] Predicciones de partidos
- [ ] Quinielas comunitarias
- [ ] Insignias y logros gamificados

### Integraciones
- [ ] API de La Liga (datos oficiales)
- [ ] Twitter API (trending topics)
- [ ] YouTube API (highlights)
- [ ] Twitch API (streams en vivo)

---

## 🐛 Troubleshooting

### Los efectos 3D no funcionan

**Problema**: Las tarjetas no tienen efecto tilt.

**Solución**:
1. Verifica que estás en desktop (los efectos se deshabilitan en mobile)
2. Comprueba la consola: `3D Tilt Cards initialized` debe aparecer
3. Asegúrate de que las tarjetas tienen el atributo `data-tilt`

### El smooth scroll no funciona

**Problema**: El scroll es normal, no suave.

**Solución**:
1. Verifica que Lenis está cargado: `https://unpkg.com/@studio-freight/lenis@1.0.42/dist/lenis.min.js`
2. Revisa la consola por errores
3. Comprueba que `smooth-scroll.js` se ejecuta después de cargar Lenis

### Las noticias no aparecen

**Problema**: El feed está vacío.

**Solución**:
1. Abre la consola y busca: `✅ Teams Data loaded`, `✅ News Data loaded`
2. Si ves `⚠️ News Data not loaded`, verifica que `news.js` está cargado en `index.html`
3. Orden correcto: data files → core → components → app.js

### Chat no simula mensajes

**Problema**: No aparecen nuevos mensajes automáticamente.

**Solución**:
1. Revisa que `users.js` está cargado
2. Comprueba que `chat.js` inicializa correctamente
3. Verifica en consola: `✅ Live chat initialized`

---

## 📄 Licencia

Este proyecto es un **prototipo de demostración educativa**.

- ✅ Libre para uso personal y aprendizaje
- ✅ Libre para portfolios
- ❌ No usar comercialmente sin permiso
- ❌ No usar logos/marcas oficiales de La Liga sin licencia

---

## 👨‍💻 Desarrollo

### Estructura de Commits (Recomendado)

```bash
feat: añadir sistema de predicciones
fix: corregir bug en chat en vivo
style: mejorar diseño de tarjetas
perf: optimizar animaciones 3D
docs: actualizar README con nuevas features
```

### Testing

```javascript
// Verificar que todos los componentes cargan
console.log(window.laLigaSocialApp.isInitialized); // true

// Verificar datos
console.log(TEAMS_DATA.length);  // 20
console.log(NEWS_DATA.length);   // 15
console.log(USERS_DATA.length);  // 10
```

---

## 🙏 Agradecimientos

- **Lenis**: Por el excelente smooth scroll
- **Unsplash**: Imágenes de alta calidad
- **La Liga**: Inspiración y datos de equipos

---

## ⚖️ Aviso Legal y Disclaimer

### Proyecto de Demostración

Este es un **proyecto de demostración técnica sin fines comerciales ni lucrativos**, creado únicamente con propósitos educativos y de portfolio profesional.

### Propiedad Intelectual

- El logo de **LaLiga** y los escudos de los equipos son **marcas registradas** propiedad de sus respectivos titulares.
- Este proyecto **NO está afiliado, patrocinado, respaldado ni asociado** con LaLiga, sus equipos participantes o cualquier entidad relacionada.
- Todos los datos, noticias y contenidos son **ficticios** y generados únicamente para demostración de funcionalidades técnicas.

### Solicitud de Autorización

El uso de marcas registradas se realizará **previa solicitud de autorización** a los titulares correspondientes antes de cualquier publicación pública del proyecto.

Si eres titular de derechos y tienes alguna preocupación sobre el uso de marcas en este proyecto de demostración, por favor contacta para resolver cualquier problema de manera amistosa.

---

## 📞 Contacto

Para preguntas, sugerencias o colaboraciones, puedes:
- Abrir un issue en el repositorio
- Contribuir con pull requests
- Compartir mejoras y extensiones

---

**Creado con ⚽ y 💻 para la comunidad futbolera**

*LaLiga Social - Proyecto de demostración técnica y educativa*
