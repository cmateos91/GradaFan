-- ==========================================
-- 🏟️ LaLiga Social - Database Schema v2.0
-- ==========================================
-- Red social de fútbol para LaLiga
-- Base de datos PostgreSQL en Supabase
--
-- CAMBIOS v2.0:
-- ❌ ELIMINADO: tabla chat_messages (chat ahora es efímero en memoria)
-- ✅ MEJORADO: Schema más ligero y eficiente
--
-- INSTRUCCIONES:
-- 1. Abre tu proyecto en Supabase
-- 2. Ve a SQL Editor
-- 3. Copia y pega este script completo
-- 4. Ejecuta (Run)
-- ==========================================

-- ==========================================
-- 1️⃣ TABLA: profiles (Perfiles de Usuario)
-- ==========================================
-- Extiende auth.users con datos adicionales
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    display_name TEXT,
    avatar_url TEXT,
    favorite_team TEXT,
    favorite_team_id INTEGER,
    points INTEGER DEFAULT 0,
    level TEXT DEFAULT 'Aficionado',
    badges JSONB DEFAULT '[]'::jsonb,
    stats JSONB DEFAULT '{"comments": 0, "likes": 0, "correct_predictions": 0}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- 2️⃣ TABLA: debates
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
-- 3️⃣ TABLA: comments (Comentarios)
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
-- 4️⃣ TABLA: likes (Sistema de Likes)
-- ==========================================
-- Tabla para registrar qué usuarios dieron like a qué
-- NOTA: Eliminadas referencias a chat_messages (ya no existe)
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
-- 5️⃣ ÍNDICES para Performance
-- ==========================================
CREATE INDEX IF NOT EXISTS idx_debates_author ON debates(author_id);
CREATE INDEX IF NOT EXISTS idx_debates_likes ON debates(likes DESC);
CREATE INDEX IF NOT EXISTS idx_debates_created ON debates(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_debate ON comments(debate_id);
CREATE INDEX IF NOT EXISTS idx_comments_user ON comments(user_id);
CREATE INDEX IF NOT EXISTS idx_likes_user ON likes(user_id);

-- ==========================================
-- 6️⃣ FUNCIONES: Triggers Automáticos
-- ==========================================

-- Función: Crear perfil automáticamente cuando se registra un usuario
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, username, display_name, avatar_url)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || SUBSTRING(NEW.id::text, 1, 8)),
        COALESCE(NEW.raw_user_meta_data->>'display_name', 'Usuario'),
        COALESCE(
            NEW.raw_user_meta_data->>'avatar_url',
            'https://api.dicebear.com/7.x/avataaars/svg?seed=' || NEW.id
        )
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

-- ==========================================
-- 7️⃣ ROW LEVEL SECURITY (RLS)
-- ==========================================

-- Habilitar RLS en todas las tablas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.debates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;

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
-- 8️⃣ LIMPIEZA: Eliminar tabla antigua
-- ==========================================
-- Si ya tenías la tabla chat_messages, eliminarla
DROP TABLE IF EXISTS public.chat_messages CASCADE;

-- ==========================================
-- ✅ FINALIZADO
-- ==========================================
-- Schema v2.0 creado exitosamente
--
-- CAMBIOS IMPORTANTES:
-- ❌ Eliminada tabla chat_messages
-- ✅ Chat ahora funciona en memoria (efímero)
-- ✅ Base de datos más ligera y eficiente
--
-- Próximos pasos:
-- 1. Aplicar este schema en Supabase
-- 2. Implementar servicio de chat en memoria con SSE
-- 3. Actualizar componentes de chat frontend
-- ==========================================
