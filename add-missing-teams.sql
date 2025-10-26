-- ==========================================
-- Actualizar equipos LaLiga 2025-26
-- ==========================================
-- EQUIPOS DESCENDIDOS (a eliminar): Las Palmas, Valladolid, Leganés
-- EQUIPOS ASCENDIDOS (a añadir): Elche CF, Levante UD, Real Oviedo

-- IMPORTANTE: Ejecutar en Supabase SQL Editor
-- Dashboard > SQL Editor > New Query > Pegar y ejecutar

-- PASO 1: Eliminar equipos descendidos
DELETE FROM public.teams
WHERE slug IN ('las-palmas', 'valladolid', 'leganes');

-- PASO 2: Añadir equipos ascendidos
-- ✅ IDs verificados desde football-data.org API v4 (endpoint: /v4/competitions/PD/teams)
-- Ejecutado: get-laliga-teams.js el 2025-10-26

INSERT INTO public.teams (name, short_name, slug, api_id, logo_url) VALUES
    ('Elche CF', 'Elche', 'elche', 285, '/assets/img/spain_elche.svg'),
    ('Levante UD', 'Levante', 'levante', 88, '/assets/img/spain_levante.svg'),
    ('Real Oviedo', 'Real Oviedo', 'oviedo', 1048, '/assets/img/spain_oviedo.svg');

-- PASO 3: Verificar cambios
SELECT 'EQUIPOS AÑADIDOS:' as info;
SELECT id, name, short_name, slug, api_id, logo_url
FROM public.teams
WHERE slug IN ('elche', 'levante', 'oviedo')
ORDER BY name;

SELECT 'TOTAL DE EQUIPOS (debe ser 20):' as info;
SELECT COUNT(*) as total_equipos FROM public.teams;

SELECT 'TODOS LOS EQUIPOS ACTUALES:' as info;
SELECT id, name, short_name, slug
FROM public.teams
ORDER BY name;
