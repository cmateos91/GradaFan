/**
 * Proxy endpoint para Football Data API - ARCHIVO DE EJEMPLO
 * Evita problemas de CORS al hacer peticiones server-side
 *
 * INSTRUCCIONES:
 * 1. Copia este archivo y renómbralo a [...path].js (mismo nombre sin .example)
 * 2. Reemplaza 'TU_API_KEY_AQUI' con tu API key real de football-data.org
 * 3. Este archivo [...path].js está en .gitignore y NO debe subirse a GitHub
 */

const API_KEY = 'TU_API_KEY_AQUI'; // 👈 PON TU API KEY AQUÍ
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
