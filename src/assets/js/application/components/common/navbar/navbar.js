/**
 * ==================== NAVBAR COMPONENT ====================
 * Maneja la funcionalidad de la barra de navegación
 * Dropdown de equipos, scroll effects, user menu
 */

class Navbar {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.teamsDropdown = document.getElementById('teams-dropdown');
        this.userPoints = document.getElementById('user-points');
        this.lastScrollY = 0;
        this.init();
    }

    init() {
        if (!this.navbar) return;

        // Poblar dropdown de equipos
        this.populateTeamsDropdown();

        // Scroll effect
        this.setupScrollEffect();

        // Animación de puntos
        this.animatePoints();

        console.log('✅ Navbar initialized');
    }

    populateTeamsDropdown() {
        if (!this.teamsDropdown) return;

        // Obtener equipos del data
        const teams = typeof TEAMS_DATA !== 'undefined' ? TEAMS_DATA : [];

        // Ordenar equipos alfabéticamente por nombre
        const sortedTeams = [...teams].sort((a, b) => {
            return a.name.localeCompare(b.name, 'es', { sensitivity: 'base' });
        });

        // Generar HTML
        const html = sortedTeams.map(team => `
            <a href="#" class="dropdown-item" data-team-id="${team.id}">
                <img src="${team.logo}" alt="${team.name}" class="team-logo-small">
                <span>${team.shortName}</span>
            </a>
        `).join('');

        this.teamsDropdown.innerHTML = html;

        // Event listeners para los items
        this.teamsDropdown.querySelectorAll('.dropdown-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const teamId = parseInt(item.dataset.teamId);
                this.handleTeamClick(teamId);
            });
        });
    }

    setupScrollEffect() {
        // Listener para el scroll
        if (typeof smoothScroll !== 'undefined' && smoothScroll.isInitialized) {
            smoothScroll.on(({ scroll }) => {
                this.handleScroll(scroll);
            });
        } else {
            window.addEventListener('scroll', () => {
                this.handleScroll(window.scrollY);
            }, { passive: true });
        }
    }

    handleScroll(scrollY) {
        // Añadir clase 'scrolled' cuando se hace scroll
        if (scrollY > 100) {
            this.navbar.classList.add('scrolled');
        } else {
            this.navbar.classList.remove('scrolled');
        }

        // Guardar posición anterior
        this.lastScrollY = scrollY;
    }

    handleTeamClick(teamId) {
        const team = typeof getTeamById !== 'undefined' ? getTeamById(teamId) : null;

        if (team) {
            console.log(`Selected team: ${team.name}`);
            // Aquí iría la lógica para filtrar noticias por equipo
            // Por ahora solo mostramos en consola

            // Disparar evento personalizado
            const event = new CustomEvent('teamSelected', {
                detail: { teamId, team }
            });
            document.dispatchEvent(event);
        }
    }

    animatePoints() {
        if (!this.userPoints) return;

        // Animación simple de conteo
        const targetPoints = parseInt(this.userPoints.textContent.replace(/,/g, ''));
        let currentPoints = 0;
        const increment = targetPoints / 50;
        const duration = 1000;
        const stepTime = duration / 50;

        const counter = setInterval(() => {
            currentPoints += increment;
            if (currentPoints >= targetPoints) {
                currentPoints = targetPoints;
                clearInterval(counter);
            }
            this.userPoints.textContent = this.formatPoints(Math.floor(currentPoints));
        }, stepTime);
    }

    formatPoints(points) {
        return points.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    updateUserPoints(newPoints) {
        if (this.userPoints) {
            this.userPoints.textContent = this.formatPoints(newPoints);

            // Añadir efecto visual
            this.userPoints.parentElement.classList.add('bounce-in');
            setTimeout(() => {
                this.userPoints.parentElement.classList.remove('bounce-in');
            }, 500);
        }
    }
}

// Inicializar cuando el DOM esté listo
let navbarComponent = null;

// Esperar a que los componentes se carguen antes de inicializar
document.addEventListener('componentsLoaded', () => {
    navbarComponent = new Navbar();
});

// Fallback por si acaso el evento ya se disparó
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (!navbarComponent && document.getElementById('navbar')) {
            navbarComponent = new Navbar();
        }
    }, 500);
});