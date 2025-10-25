/**
 * Proxy endpoint para Football Data API
 * Evita problemas de CORS al hacer peticiones server-side
 *
 * NOTA: La API key se lee del archivo api-config.js que está en .gitignore
 * Para desarrollo local, asegúrate de tener configurado public/assets/js/application/config/api-config.js
 */

// Leer la API key del archivo de configuración (método simplificado para desarrollo)
// En producción, deberías usar variables de entorno
const API_KEY = 'bc92b948c6a34800be3be7be9eedb93c'; // TODO: Mover a variable de entorno
const API_BASE_URL = 'https://api.football-data.org/v4';

export async function GET({ params, request }) {
  // Obtener el path completo de la API
  const path = params.path || '';
  const url = new URL(request.url);
  const queryString = url.search;

  // Construir URL completa de la API
  const apiUrl = `${API_BASE_URL}/${path}${queryString}`;

  console.log(`🔄 Proxy request to: ${apiUrl}`);

  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'X-Auth-Token': API_KEY
      }
    });

    if (!response.ok) {
      console.error(`❌ API error: ${response.status} ${response.statusText}`);
      return new Response(JSON.stringify({
        error: `API error: ${response.status}`
      }), {
        status: response.status,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    const data = await response.json();

    console.log(`✅ Proxy success: ${path}`);

    // Devolver datos con headers CORS permitidos
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=300' // 5 minutos de cache
      }
    });

  } catch (error) {
    console.error('❌ Proxy error:', error);
    return new Response(JSON.stringify({
      error: error.message
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

// Manejar OPTIONS para CORS preflight
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}
