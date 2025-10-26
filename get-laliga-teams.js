/**
 * Script para obtener todos los equipos de LaLiga desde football-data.org API v4
 * y generar el SQL de actualización con los IDs correctos
 */

const API_KEY = 'bc92b948c6a34800be3be7be9eedb93c';
const API_URL = 'https://api.football-data.org/v4/competitions/PD/teams';

async function getLaLigaTeams() {
    try {
        console.log('🔍 Consultando API de football-data.org...\n');

        const response = await fetch(API_URL, {
            headers: {
                'X-Auth-Token': API_KEY
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const teams = data.teams;

        console.log(`✅ Se encontraron ${teams.length} equipos de LaLiga\n`);
        console.log('=' .repeat(80));

        // Mostrar todos los equipos con sus IDs
        teams.forEach((team, index) => {
            console.log(`${(index + 1).toString().padStart(2, '0')}. ${team.name.padEnd(30)} | ID: ${team.id.toString().padStart(4)} | TLA: ${team.tla}`);
        });

        console.log('=' .repeat(80));
        console.log('\n🔎 Buscando equipos específicos: Elche, Levante, Oviedo...\n');

        // Buscar los equipos que necesitamos
        const targetTeams = ['elche', 'levante', 'oviedo'];
        const foundTeams = [];

        targetTeams.forEach(teamName => {
            const team = teams.find(t =>
                t.name.toLowerCase().includes(teamName) ||
                t.shortName.toLowerCase().includes(teamName)
            );

            if (team) {
                foundTeams.push({
                    name: team.name,
                    shortName: team.shortName,
                    id: team.id,
                    slug: teamName
                });
                console.log(`✅ ${team.name}: ID = ${team.id}`);
            } else {
                console.log(`❌ ${teamName}: NO ENCONTRADO en LaLiga 2024-25`);
            }
        });

        // Generar SQL si se encontraron equipos
        if (foundTeams.length > 0) {
            console.log('\n' + '=' .repeat(80));
            console.log('📝 SQL GENERADO CON IDs CORRECTOS:');
            console.log('=' .repeat(80));
            console.log('\n-- PASO 1: Eliminar equipos descendidos');
            console.log("DELETE FROM public.teams");
            console.log("WHERE slug IN ('las-palmas', 'valladolid', 'leganes');\n");

            console.log('-- PASO 2: Añadir equipos ascendidos con IDs correctos');
            console.log('INSERT INTO public.teams (name, short_name, slug, api_id, logo_url) VALUES');

            foundTeams.forEach((team, index) => {
                const isLast = index === foundTeams.length - 1;
                console.log(`    ('${team.name}', '${team.shortName}', '${team.slug}', ${team.id}, '/assets/img/spain_${team.slug}.svg')${isLast ? ';' : ','}`);
            });

            console.log('\n-- PASO 3: Verificar');
            console.log("SELECT id, name, short_name, slug, api_id FROM public.teams");
            console.log("WHERE slug IN ('elche', 'levante', 'oviedo')");
            console.log("ORDER BY name;");
        }

        // Información adicional
        console.log('\n' + '=' .repeat(80));
        console.log('ℹ️  INFORMACIÓN IMPORTANTE:');
        console.log('=' .repeat(80));
        console.log('Si algún equipo NO se encontró, significa que NO está en LaLiga 2024-25.');
        console.log('Verifica que estos equipos realmente hayan ascendido a Primera División.');
        console.log('Los equipos pueden estar en Segunda División (LaLiga SmartBank).');

    } catch (error) {
        console.error('❌ Error al consultar la API:', error.message);
        console.log('\n💡 Posibles soluciones:');
        console.log('1. Verifica que la API key sea correcta en el archivo .env');
        console.log('2. Verifica tu conexión a internet');
        console.log('3. La API puede tener límite de llamadas (30 llamadas/minuto para free tier)');
    }
}

// Ejecutar
getLaLigaTeams();
