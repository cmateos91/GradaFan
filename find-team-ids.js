// Script temporal para encontrar los IDs de los equipos en la API
const API_KEY = process.env.FOOTBALL_API_KEY || 'TU_API_KEY_AQUI';

async function findTeamIds() {
    try {
        // Obtener todos los equipos de La Liga
        const response = await fetch('https://api.football-data.org/v4/competitions/PD/teams', {
            headers: {
                'X-Auth-Token': API_KEY
            }
        });

        const data = await response.json();

        if (!data.teams) {
            console.error('No se pudieron obtener los equipos');
            return;
        }

        // Buscar Elche, Levante y Oviedo
        const searchTeams = ['Elche', 'Levante', 'Oviedo'];

        console.log('\n=== EQUIPOS ENCONTRADOS ===\n');

        data.teams.forEach(team => {
            const teamName = team.name.toLowerCase();
            const isMatch = searchTeams.some(search => teamName.includes(search.toLowerCase()));

            if (isMatch) {
                console.log(`Nombre: ${team.name}`);
                console.log(`ID: ${team.id}`);
                console.log(`Short Name: ${team.shortName}`);
                console.log(`TLA: ${team.tla}`);
                console.log(`Crest: ${team.crest}`);
                console.log('---');
            }
        });

        console.log('\n=== TODOS LOS EQUIPOS (para referencia) ===\n');
        data.teams.forEach(team => {
            console.log(`${team.id} - ${team.name} (${team.shortName})`);
        });

    } catch (error) {
        console.error('Error:', error.message);
    }
}

findTeamIds();
