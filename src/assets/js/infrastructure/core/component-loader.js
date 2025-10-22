/**
 * ==================== COMPONENT LOADER ====================
 * Carga componentes HTML reutilizables (navbar, footer, etc.)
 */

class ComponentLoader {
    constructor() {
        this.components = {
            navbar: '../components/navbar.html',
            'teams-bar': '../components/teams-bar.html',
            footer: '../components/footer.html'
        };
        this.loaded = {};
    }

    /**
     * Cargar un componente HTML
     */
    async loadComponent(name, targetId) {
        if (!this.components[name]) {
            console.error(`⚠️ Component "${name}" not found`);
            return false;
        }

        const target = document.getElementById(targetId);
        if (!target) {
            console.error(`⚠️ Target element "${targetId}" not found`);
            return false;
        }

        try {
            const response = await fetch(this.components[name]);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const html = await response.text();
            target.outerHTML = html;

            this.loaded[name] = true;
            console.log(`✅ Component "${name}" loaded successfully`);

            return true;

        } catch (error) {
            console.error(`❌ Error loading component "${name}":`, error);
            return false;
        }
    }

    /**
     * Cargar todos los componentes de la página
     */
    async loadAll() {
        const navbarPlaceholder = document.getElementById('navbar-placeholder');
        const teamsBarPlaceholder = document.getElementById('teams-bar-placeholder');
        const footerPlaceholder = document.getElementById('footer-placeholder');

        const promises = [];

        if (navbarPlaceholder) {
            promises.push(this.loadComponent('navbar', 'navbar-placeholder'));
        }

        if (teamsBarPlaceholder) {
            promises.push(this.loadComponent('teams-bar', 'teams-bar-placeholder'));
        }

        if (footerPlaceholder) {
            promises.push(this.loadComponent('footer', 'footer-placeholder'));
        }

        await Promise.all(promises);

        // Después de cargar, marcar el link activo
        this.setActiveLink();

        // Disparar evento personalizado cuando los componentes estén cargados
        const event = new CustomEvent('componentsLoaded');
        document.dispatchEvent(event);

        return true;
    }

    /**
     * Marcar el link activo en el navbar según la página actual
     */
    setActiveLink() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const normalizedPage = currentPage === '' ? 'index.html' : currentPage;
        const pageName = normalizedPage.replace('.html', '');

        // Esperar un poco para asegurar que el DOM se actualizó
        setTimeout(() => {
            const navLinks = document.querySelectorAll('.nav-link');

            navLinks.forEach(link => {
                link.classList.remove('active');

                const linkPage = link.getAttribute('data-page');
                const linkHref = link.getAttribute('href');

                if (linkPage === pageName || linkHref === normalizedPage) {
                    link.classList.add('active');
                }
            });
        }, 100);
    }
}

// Crear instancia global
const componentLoader = new ComponentLoader();

// Auto-cargar componentes cuando el DOM esté listo
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', async () => {
        await componentLoader.loadAll();
        console.log('✅ Page components loaded');
    });
}

// Export global
if (typeof window !== 'undefined') {
    window.componentLoader = componentLoader;
}
