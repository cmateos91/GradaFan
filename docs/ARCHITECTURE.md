# 🏗️ Arquitectura del Proyecto - LaLiga Social

## 📁 Estructura de Directorios

```
LaLiga-Social/
│
├── public/                          # Assets estáticos públicos
│   ├── robots.txt                   # Configuración de robots de búsqueda
│   └── .gitkeep                     # Mantener carpeta en git
│
├── src/                             # Código fuente
│   ├── pages/                       # Páginas HTML
│   │   ├── index.html              # Página principal
│   │   ├── clasificacion.html      # Tabla de posiciones
│   │   ├── en-vivo.html            # Partidos en vivo
│   │   └── debate.html             # Vista de debate individual
│   │
│   ├── components/                  # Componentes HTML reutilizables
│   │   ├── navbar.html             # Barra de navegación
│   │   ├── footer.html             # Pie de página
│   │   └── teams-bar.html          # Barra de equipos
│   │
│   └── assets/                      # Assets del proyecto
│       ├── css/                     # Estilos (Arquitectura SMACSS)
│       │   ├── base/               # Estilos base y reset
│       │   ├── layout/             # Layouts principales
│       │   ├── modules/            # Componentes modulares
│       │   ├── pages/              # Estilos específicos de página
│       │   ├── state/              # Estados y utilidades
│       │   └── main.css            # Punto de entrada CSS
│       │
│       ├── js/                      # JavaScript (Arquitectura DDD)
│       │   ├── application/        # Capa de aplicación
│       │   │   ├── components/    # Componentes de UI
│       │   │   │   ├── common/    # Componentes compartidos
│       │   │   │   ├── news/      # Componentes de noticias
│       │   │   │   ├── matches/   # Componentes de partidos
│       │   │   │   ├── debates/   # Componentes de debates
│       │   │   │   └── standings/ # Componentes de clasificación
│       │   │   ├── config/        # Configuración de la app
│       │   │   └── app.js         # Punto de entrada de la app
│       │   │
│       │   ├── infrastructure/     # Capa de infraestructura
│       │   │   ├── core/          # Funcionalidades core
│       │   │   │   ├── event-bus.js        # Sistema de eventos
│       │   │   │   ├── component-loader.js # Cargador de componentes
│       │   │   │   ├── smooth-scroll.js    # Scroll suave
│       │   │   │   ├── tilt-cards.js       # Efecto 3D
│       │   │   │   └── parallax.js         # Efecto parallax
│       │   │   ├── services/      # Servicios externos
│       │   │   │   └── football-api.js     # API de fútbol
│       │   │   └── utils/         # Utilidades
│       │   │       ├── team-utils.js
│       │   │       ├── dom-utils.js
│       │   │       ├── date-utils.js
│       │   │       └── storage-utils.js
│       │   │
│       │   └── shared/             # Capa compartida
│       │       └── data/           # Datos mock
│       │           ├── teams.js
│       │           ├── news.js
│       │           ├── users.js
│       │           ├── debates.js
│       │           └── chat.js
│       │
│       └── img/                     # Imágenes del proyecto
│
├── docs/                            # Documentación
│   ├── ARCHITECTURE.md             # Este archivo
│   └── API_SETUP.md                # Configuración de API
│
├── scripts/                         # Scripts de utilidad
│   └── INICIAR_SERVIDOR.bat       # Script para iniciar servidor
│
├── dist/                            # Build de producción (generado)
│
├── node_modules/                    # Dependencias (generado)
│
├── .gitignore                      # Archivos ignorados por git
├── package.json                    # Configuración de npm
├── vite.config.js                  # Configuración de Vite
└── README.md                       # Documentación principal
```

---

## 🎨 Arquitectura CSS - SMACSS

El proyecto utiliza **SMACSS** (Scalable and Modular Architecture for CSS):

### Capas de SMACSS:

1. **Base** (`base/`): Reset, variables CSS, tipografía base
2. **Layout** (`layout/`): Estructura principal (grid, containers, sections)
3. **Modules** (`modules/`): Componentes reutilizables (cards, buttons, forms)
4. **Pages** (`pages/`): Estilos específicos de cada página
5. **State** (`state/`): Estados (hover, active, loading) y utilidades

### Convenciones:
- Variables CSS para colores, espaciados y tipografía
- Nomenclatura BEM cuando sea apropiado
- Mobile-first responsive design
- Custom properties para temas y variantes

---

## 🧩 Arquitectura JavaScript - DDD

El proyecto sigue principios de **Domain-Driven Design** (DDD) con 3 capas:

### 1. **Application Layer** (Capa de Aplicación)
Orquesta la lógica de la interfaz de usuario:
- **Components**: Componentes UI específicos del dominio
- **Config**: Configuración de la aplicación
- **App.js**: Punto de entrada y bootstrap

### 2. **Infrastructure Layer** (Capa de Infraestructura)
Implementaciones técnicas y servicios:
- **Core**: Funcionalidades fundamentales (eventos, loaders, efectos)
- **Services**: Integraciones con APIs externas
- **Utils**: Utilidades helpers reutilizables

### 3. **Shared Layer** (Capa Compartida)
Código compartido entre capas:
- **Data**: Datos mock y constantes
- **Types**: Definiciones de tipos (futuro)
- **Contracts**: Interfaces y contratos (futuro)

### Principios:
- **Separation of Concerns**: Cada capa tiene responsabilidades claras
- **Dependency Rule**: Las dependencias apuntan hacia adentro
- **Event-Driven**: Comunicación basada en eventos custom
- **Component Isolation**: Componentes independientes y reutilizables

---

## ⚡ Sistema de Build - Vite

### Configuración:
- **Dev Server**: Puerto 3000 con hot reload
- **Root**: `src/pages/` para desarrollo
- **Output**: `dist/` para producción
- **Multi-page**: Soporte para múltiples HTML

### Scripts NPM:
```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build de producción
npm run preview  # Preview del build
```

### Características de Vite:
- ⚡ Hot Module Replacement (HMR)
- 📦 Optimización automática de assets
- 🔨 Build optimizado con Rollup
- 🗺️ Source maps para debugging
- 🎯 Tree shaking automático

---

## 🔄 Flujo de Carga de la Aplicación

1. **HTML se carga** → `index.html`
2. **CSS se importa** → `main.css` (incluye toda la arquitectura SMACSS)
3. **Scripts se cargan en orden**:
   - Librerías externas (Lenis para smooth scroll)
   - Shared data (teams, news, users, debates)
   - Application config (api-config.js)
   - Infrastructure services (football-api.js)
   - Infrastructure utils (team, dom, date, storage)
   - Infrastructure core (event-bus, component-loader, scroll, tilt, parallax)
   - Application components (icons, navbar, teams-bar, chat, hero, etc.)
   - Application main (app.js)

4. **ComponentLoader se ejecuta**:
   - Carga navbar, teams-bar, footer desde `/src/components/`
   - Dispara evento `componentsLoaded`

5. **Componentes se inicializan**:
   - Hero con noticias destacadas
   - Debate feed con debates recientes
   - Sidebar con widgets
   - Chat en vivo

6. **EventBus conecta componentes**:
   - Comunicación entre componentes vía eventos custom
   - Desacoplamiento de la lógica

---

## 🚀 Próximos Pasos (Fase 3)

### Migración a Framework Moderno:

#### Opción 1: **Astro** (Recomendado)
```
src/
├── pages/              # Rutas automáticas .astro
├── components/         # Componentes Astro + JS islands
├── layouts/            # Layouts compartidos
└── assets/             # Assets estáticos
```

**Beneficios:**
- Mínimo JavaScript en el cliente
- Islas de interactividad
- Compatible con React, Vue, Svelte
- Perfecto para contenido estático + interactividad selectiva

#### Opción 2: **Vue.js**
- Framework progresivo
- Fácil integración gradual
- Composition API moderna
- Ecosystem robusto

#### Opción 3: **Svelte**
- Compilador en lugar de runtime
- Performance excepcional
- Sintaxis simple y elegante
- Bundle size reducido

---

## 📊 Métricas del Proyecto

### Antes de la Refactorización:
- 57 archivos JS
- 24 archivos CSS
- ~10,000 líneas de código duplicado
- Estructura mixta (DDD + tradicional)

### Después de la Refactorización:
- 32 archivos JS (-44%)
- 14 archivos CSS (-42%)
- 0 líneas duplicadas
- Estructura DDD completa
- Build system moderno (Vite)
- Documentación profesional

---

## 🔐 Seguridad

### Archivos Sensibles:
- `src/assets/js/application/config/api-config.js` → Ignorado en `.gitignore`
- Crear `api-config.example.js` sin claves reales
- Nunca commitear API keys

### Buenas Prácticas:
- Variables de entorno para producción
- Sanitización de datos de usuario
- CORS configurado correctamente
- Rate limiting en APIs

---

## 📚 Referencias

- [SMACSS](https://smacss.com/) - Arquitectura CSS
- [DDD](https://martinfowler.com/tags/domain%20driven%20design.html) - Domain-Driven Design
- [Vite](https://vitejs.dev/) - Build Tool
- [Astro](https://astro.build/) - Framework futuro recomendado

---

## 👥 Contribución

Para contribuir al proyecto:
1. Fork del repositorio
2. Crear branch de feature: `git checkout -b feature/nueva-funcionalidad`
3. Seguir convenciones de código establecidas
4. Commit con mensajes descriptivos
5. Push y crear Pull Request

---

## 📝 Licencia

MIT License - Ver archivo LICENSE para detalles.

---

**Última actualización**: 2025-10-22
**Versión**: 2.0.0 (Post-refactorización)
