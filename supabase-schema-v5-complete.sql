-- ==========================================
-- 🏟️ LaLiga Social - Database Schema v5.0 COMPLETO
-- ==========================================
-- Red social de fútbol para LaLiga
-- Base de datos PostgreSQL en Supabase
--
-- INCLUYE:
-- ✅ Profiles (con teams FK)
-- ✅ Teams (tabla normalizada)
-- ✅ Debates (con author_id FK)
-- ✅ Comments
-- ✅ Likes
-- ✅ RLS Policies
-- ✅ Triggers automáticos
--
-- INSTRUCCIONES:
-- 1. Abre tu proyecto en Supabase
-- 2. Ve a SQL Editor
-- 3. Copia y pega este script completo
-- 4. Ejecuta (Run)
-- ==========================================

-- ==========================================
-- 1️⃣ TABLA: teams (CREAR PRIMERO)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.teams (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    short_name TEXT,
    slug TEXT NOT NULL UNIQUE,
    api_id INTEGER UNIQUE,
    logo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insertar equipos de LaLiga 2025-26
INSERT INTO public.teams (name, short_name, slug, api_id, logo_url) VALUES
    ('Athletic Club', 'Athletic', 'athletic-club', 77, '/assets/img/spain_athletic-club.svg'),
    ('Atlético de Madrid', 'Atlético', 'atletico-madrid', 78, '/assets/img/spain_atletico-madrid.svg'),
    ('CA Osasuna', 'Osasuna', 'osasuna', 79, '/assets/img/spain_osasuna.svg'),
    ('Cádiz CF', 'Cádiz', 'cadiz', 80, '/assets/img/spain_cadiz.svg'),
    ('Celta de Vigo', 'Celta', 'celta-vigo', 81, '/assets/img/spain_celta-vigo.svg'),
    ('Deportivo Alavés', 'Alavés', 'alaves', 82, '/assets/img/spain_alaves.svg'),
    ('FC Barcelona', 'Barcelona', 'barcelona', 83, '/assets/img/spain_barcelona.svg'),
    ('Getafe CF', 'Getafe', 'getafe', 84, '/assets/img/spain_getafe.svg'),
    ('Girona FC', 'Girona', 'girona', 85, '/assets/img/spain_girona.svg'),
    ('Granada CF', 'Granada', 'granada', 86, '/assets/img/spain_granada.svg'),
    ('RCD Espanyol', 'Espanyol', 'espanyol', 87, '/assets/img/spain_espanyol.svg'),
    ('RCD Mallorca', 'Mallorca', 'mallorca', 88, '/assets/img/spain_mallorca.svg'),
    ('Rayo Vallecano', 'Rayo', 'rayo-vallecano', 89, '/assets/img/spain_rayo-vallecano.svg'),
    ('Real Betis', 'Betis', 'real-betis', 90, '/assets/img/spain_real-betis.svg'),
    ('Real Madrid CF', 'Real Madrid', 'real-madrid', 91, '/assets/img/spain_real-madrid.svg'),
    ('Real Sociedad', 'Real Sociedad', 'real-sociedad', 92, '/assets/img/spain_real-sociedad.svg'),
    ('Real Valladolid', 'Valladolid', 'valladolid', 93, '/assets/img/spain_valladolid.svg'),
    ('Sevilla FC', 'Sevilla', 'sevilla', 94, '/assets/img/spain_sevilla.svg'),
    ('UD Las Palmas', 'Las Palmas', 'las-palmas', 95, '/assets/img/spain_las-palmas.svg'),
    ('Valencia CF', 'Valencia', 'valencia', 96, '/assets/img/spain_valencia.svg'),
    ('Villarreal CF', 'Villarreal', 'villarreal', 97, '/assets/img/spain_villarreal.svg')
ON CONFLICT (name) DO NOTHING;

-- ==========================================
-- 2️⃣ TABLA: profiles (Perfiles de Usuario)
-- ==========================================
-- Extiende auth.users con datos adicionales
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    display_name TEXT,
    avatar_url TEXT,
    favorite_team TEXT,
    favorite_team_id BIGINT REFERENCES public.teams(id) ON DELETE SET NULL,
    points INTEGER DEFAULT 0,
    level TEXT DEFAULT 'Aficionado',
    badges JSONB DEFAULT '[]'::jsonb,
    stats JSONB DEFAULT '{"comments": 0, "likes": 0, "correct_predictions": 0}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- 3️⃣ TABLA: debates
-- ==========================================
CREATE TABLE IF NOT EXISTS public.debates (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    category TEXT DEFAULT 'debates',
    external_link JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    comments_count INTEGER DEFAULT 0,
    participants_count INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    featured BOOLEAN DEFAULT FALSE
);

-- ==========================================
-- 4️⃣ TABLA: comments (Comentarios)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.comments (
    id BIGSERIAL PRIMARY KEY,
    debate_id BIGINT REFERENCES public.debates(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    parent_comment_id BIGINT REFERENCES public.comments(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    likes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- 5️⃣ TABLA: likes (Sistema de Likes)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.likes (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    debate_id BIGINT REFERENCES public.debates(id) ON DELETE CASCADE,
    comment_id BIGINT REFERENCES public.comments(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    -- Solo uno de estos puede tener valor
    CONSTRAINT check_like_target CHECK (
        (debate_id IS NOT NULL AND comment_id IS NULL) OR
        (debate_id IS NULL AND comment_id IS NOT NULL)
    ),
    -- Un usuario solo puede dar like una vez a cada cosa
    UNIQUE(user_id, debate_id),
    UNIQUE(user_id, comment_id)
);

-- ==========================================
-- 6️⃣ ÍNDICES para Performance
-- ==========================================
CREATE INDEX IF NOT EXISTS idx_debates_author ON debates(author_id);
CREATE INDEX IF NOT EXISTS idx_debates_likes ON debates(likes DESC);
CREATE INDEX IF NOT EXISTS idx_debates_created ON debates(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_debate ON comments(debate_id);
CREATE INDEX IF NOT EXISTS idx_comments_user ON comments(user_id);
CREATE INDEX IF NOT EXISTS idx_likes_user ON likes(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_team ON profiles(favorite_team_id);

-- ==========================================
-- 7️⃣ FUNCIONES: Triggers Automáticos
-- ==========================================

-- Función: Crear perfil automáticamente cuando se registra un usuario
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, username, display_name, avatar_url, favorite_team_id, favorite_team)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || SUBSTRING(NEW.id::text, 1, 8)),
        COALESCE(NEW.raw_user_meta_data->>'display_name', 'Usuario'),
        COALESCE(
            NEW.raw_user_meta_data->>'avatar_url',
            'https://api.dicebear.com/7.x/avataaars/svg?seed=' || NEW.id
        ),
        (NEW.raw_user_meta_data->>'favorite_team_id')::BIGINT,
        NEW.raw_user_meta_data->>'favorite_team'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: Ejecutar handle_new_user al registrarse
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Función: Actualizar timestamp de updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Actualizar updated_at en profiles
DROP TRIGGER IF EXISTS on_profile_updated ON public.profiles;
CREATE TRIGGER on_profile_updated
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Trigger: Actualizar updated_at en debates
DROP TRIGGER IF EXISTS on_debate_updated ON public.debates;
CREATE TRIGGER on_debate_updated
    BEFORE UPDATE ON public.debates
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Función: Prevenir cambios en favorite_team_id
CREATE OR REPLACE FUNCTION public.prevent_team_change()
RETURNS TRIGGER AS $$
BEGIN
    -- Si el usuario ya tiene un equipo favorito, no permitir cambios
    IF OLD.favorite_team_id IS NOT NULL AND NEW.favorite_team_id != OLD.favorite_team_id THEN
        RAISE EXCEPTION 'No puedes cambiar tu equipo favorito una vez seleccionado';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Prevenir cambios en favorite_team_id
DROP TRIGGER IF EXISTS prevent_team_change_trigger ON public.profiles;
CREATE TRIGGER prevent_team_change_trigger
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.prevent_team_change();

-- ==========================================
-- 8️⃣ ROW LEVEL SECURITY (RLS)
-- ==========================================

-- Habilitar RLS en todas las tablas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.debates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;

-- POLÍTICAS: teams (públicas, todos pueden leer)
DROP POLICY IF EXISTS "Teams are viewable by everyone" ON public.teams;
CREATE POLICY "Teams are viewable by everyone"
    ON public.teams FOR SELECT
    USING (true);

-- POLÍTICAS: profiles
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Profiles are viewable by everyone"
    ON public.profiles FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- POLÍTICAS: debates
DROP POLICY IF EXISTS "Debates are viewable by everyone" ON public.debates;
CREATE POLICY "Debates are viewable by everyone"
    ON public.debates FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Authenticated users can create debates" ON public.debates;
CREATE POLICY "Authenticated users can create debates"
    ON public.debates FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can update own debates" ON public.debates;
CREATE POLICY "Users can update own debates"
    ON public.debates FOR UPDATE
    USING (auth.uid() = author_id);

DROP POLICY IF EXISTS "Users can delete own debates" ON public.debates;
CREATE POLICY "Users can delete own debates"
    ON public.debates FOR DELETE
    USING (auth.uid() = author_id);

-- POLÍTICAS: comments
DROP POLICY IF EXISTS "Comments are viewable by everyone" ON public.comments;
CREATE POLICY "Comments are viewable by everyone"
    ON public.comments FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Authenticated users can create comments" ON public.comments;
CREATE POLICY "Authenticated users can create comments"
    ON public.comments FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can delete own comments" ON public.comments;
CREATE POLICY "Users can delete own comments"
    ON public.comments FOR DELETE
    USING (auth.uid() = user_id);

-- POLÍTICAS: likes
DROP POLICY IF EXISTS "Likes are viewable by everyone" ON public.likes;
CREATE POLICY "Likes are viewable by everyone"
    ON public.likes FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Authenticated users can like" ON public.likes;
CREATE POLICY "Authenticated users can like"
    ON public.likes FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can remove own likes" ON public.likes;
CREATE POLICY "Users can remove own likes"
    ON public.likes FOR DELETE
    USING (auth.uid() = user_id);

-- ==========================================
-- ✅ FINALIZADO
-- ==========================================
-- Schema v5.0 COMPLETO creado exitosamente
--
-- INCLUYE:
-- ✅ Teams (normalizado con FK)
-- ✅ Profiles (con FK a teams)
-- ✅ Debates (con FK a profiles/author)
-- ✅ Comments (con FK a debates y profiles)
-- ✅ Likes (sistema completo)
-- ✅ RLS en todas las tablas
-- ✅ Triggers automáticos
-- ✅ Protección de cambio de equipo
--
-- Próximos pasos:
-- 1. ✅ Ya aplicado este schema en Supabase
-- 2. Verifica que la tabla debates tenga el campo author_id
-- 3. Intenta crear un debate desde el frontend
-- ==========================================
