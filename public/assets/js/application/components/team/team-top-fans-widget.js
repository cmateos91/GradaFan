/**
 * ==================== TEAM TOP FANS WIDGET ====================
 * Widget de top aficionados del equipo
 */

class TeamTopFansWidget {
    constructor() {
        this.container = document.getElementById('top-fans-widget');
        this.teamData = window.TEAM_DATA;

        this.init();
    }

    async init() {
        if (!this.container || !this.teamData) {
            console.error('⚠️ Team top fans widget container or team data not found');
            return;
        }

        await this.loadTopFans();
    }

    async loadTopFans() {
        try {
            // Obtener top aficionados del equipo desde Supabase
            const { data: fans, error } = await window.supabase
                .from('profiles')
                .select('id, username, display_name, avatar_url, points')
                .eq('favorite_team_id', this.teamData.id)
                .order('points', { ascending: false })
                .limit(5);

            if (error) throw error;

            if (!fans || fans.length === 0) {
                this.showEmpty('Aún no hay aficionados registrados');
                return;
            }

            this.render(fans);

        } catch (error) {
            console.error('Error loading top fans:', error);
            this.showError('Error al cargar los aficionados');
        }
    }

    render(fans) {
        const html = `
            <div class="top-fans-list">
                ${fans.map((fan, index) => `
                    <div class="fan-item">
                        <span class="fan-rank">${index + 1}</span>
                        <img src="${fan.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${fan.id}`}"
                             alt="${fan.display_name || fan.username}"
                             class="fan-avatar">
                        <div class="fan-info">
                            <div class="fan-name">${fan.display_name || fan.username}</div>
                            <div class="fan-points">${fan.points} pts</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        this.container.innerHTML = html;
    }

    showEmpty(message) {
        this.container.innerHTML = `
            <div class="widget-empty">
                <p>${message}</p>
            </div>
        `;
    }

    showError(message) {
        this.container.innerHTML = `
            <div class="widget-error">
                <p>${message}</p>
            </div>
        `;
    }
}

// Auto-inicialización
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        new TeamTopFansWidget();
    });
}
