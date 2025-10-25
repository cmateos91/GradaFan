/**
 * Debates Service - Maneja todas las operaciones con debates en Supabase
 * Versión Global (sin ES6 modules)
 */

window.DebatesService = {
    /**
     * Obtener todos los debates ordenados por creación
     */
    async getDebates(limit = 100) {
        try {
            // Esperar a que Supabase esté listo
            await window.supabaseReady;

            if (!window.supabase) {
                console.error('Supabase client not initialized');
                return [];
            }

            const { data, error } = await window.supabase
                .from('debates')
                .select(`
                    *,
                    author:profiles!debates_author_id_fkey (
                        id,
                        username,
                        display_name,
                        avatar_url
                    )
                `)
                .order('created_at', { ascending: false })
                .limit(limit);

            if (error) throw error;

            // Transformar datos al formato que espera la app
            return data.map(debate => ({
                id: debate.id,
                title: debate.title,
                description: debate.description,
                author: {
                    id: debate.author.id,
                    name: debate.author.display_name || debate.author.username,
                    avatar: debate.author.avatar_url
                },
                externalLink: debate.external_link,
                createdAt: debate.created_at,
                updatedAt: debate.updated_at,
                commentsCount: debate.comments_count,
                participantsCount: debate.participants_count,
                likes: debate.likes,
                category: debate.category,
                featured: debate.featured
            }));
        } catch (error) {
            console.error('Error al obtener debates:', error);
            return [];
        }
    },

    /**
     * Obtener top N debates por likes
     */
    async getTopDebates(limit = 3) {
        try {
            // Esperar a que Supabase esté listo
            await window.supabaseReady;

            if (!window.supabase) {
                console.error('Supabase client not initialized');
                return [];
            }

            const { data, error } = await window.supabase
                .from('debates')
                .select(`
                    *,
                    author:profiles!debates_author_id_fkey (
                        id,
                        username,
                        display_name,
                        avatar_url
                    )
                `)
                .order('likes', { ascending: false })
                .limit(limit);

            if (error) throw error;

            // Transformar datos al formato que espera la app
            return data.map(debate => ({
                id: debate.id,
                title: debate.title,
                description: debate.description,
                author: {
                    id: debate.author.id,
                    name: debate.author.display_name || debate.author.username,
                    avatar: debate.author.avatar_url
                },
                externalLink: debate.external_link,
                createdAt: debate.created_at,
                updatedAt: debate.updated_at,
                commentsCount: debate.comments_count,
                participantsCount: debate.participants_count,
                likes: debate.likes,
                category: debate.category,
                featured: debate.featured
            }));
        } catch (error) {
            console.error('Error al obtener top debates:', error);
            return [];
        }
    },

    /**
     * Obtener un debate por ID
     */
    async getDebateById(id) {
        try {
            // Esperar a que Supabase esté listo
            await window.supabaseReady;

            if (!window.supabase) {
                console.error('Supabase client not initialized');
                return null;
            }

            const { data, error } = await window.supabase
                .from('debates')
                .select(`
                    *,
                    author:profiles!debates_author_id_fkey (
                        id,
                        username,
                        display_name,
                        avatar_url
                    )
                `)
                .eq('id', id)
                .single();

            if (error) throw error;

            // Transformar datos al formato que espera la app
            return {
                id: data.id,
                title: data.title,
                description: data.description,
                author: {
                    id: data.author.id,
                    name: data.author.display_name || data.author.username,
                    avatar: data.author.avatar_url
                },
                externalLink: data.external_link,
                createdAt: data.created_at,
                updatedAt: data.updated_at,
                commentsCount: data.comments_count,
                participantsCount: data.participants_count,
                likes: data.likes,
                category: data.category,
                featured: data.featured
            };
        } catch (error) {
            console.error('Error al obtener debate:', error);
            return null;
        }
    },

    /**
     * Crear un nuevo debate
     */
    async createDebate(debateData) {
        try {
            // Esperar a que Supabase esté listo
            await window.supabaseReady;

            if (!window.supabase) {
                console.error('Supabase client not initialized');
                return null;
            }

            const { data, error } = await window.supabase
                .from('debates')
                .insert({
                    title: debateData.title,
                    description: debateData.description,
                    author_id: debateData.authorId,
                    category: debateData.category || 'debates',
                    external_link: debateData.externalLink || null
                })
                .select()
                .single();

            if (error) throw error;

            return data;
        } catch (error) {
            console.error('Error al crear debate:', error);
            return null;
        }
    },

    /**
     * Dar like a un debate
     */
    async likeDebate(debateId, userId) {
        try {
            // Esperar a que Supabase esté listo
            await window.supabaseReady;

            if (!window.supabase) {
                console.error('Supabase client not initialized');
                return false;
            }

            // Insertar like
            const { error: likeError } = await window.supabase
                .from('likes')
                .insert({
                    user_id: userId,
                    debate_id: debateId
                });

            if (likeError) throw likeError;

            // Incrementar contador de likes en el debate
            const { data: debate } = await window.supabase
                .from('debates')
                .select('likes')
                .eq('id', debateId)
                .single();

            await window.supabase
                .from('debates')
                .update({ likes: (debate.likes || 0) + 1 })
                .eq('id', debateId);

            return true;
        } catch (error) {
            console.error('Error al dar like:', error);
            return false;
        }
    },

    /**
     * Quitar like de un debate
     */
    async unlikeDebate(debateId, userId) {
        try {
            // Esperar a que Supabase esté listo
            await window.supabaseReady;

            if (!window.supabase) {
                console.error('Supabase client not initialized');
                return false;
            }

            // Eliminar like
            const { error: unlikeError } = await window.supabase
                .from('likes')
                .delete()
                .eq('user_id', userId)
                .eq('debate_id', debateId);

            if (unlikeError) throw unlikeError;

            // Decrementar contador de likes en el debate
            const { data: debate } = await window.supabase
                .from('debates')
                .select('likes')
                .eq('id', debateId)
                .single();

            await window.supabase
                .from('debates')
                .update({ likes: Math.max(0, (debate.likes || 0) - 1) })
                .eq('id', debateId);

            return true;
        } catch (error) {
            console.error('Error al quitar like:', error);
            return false;
        }
    }
};

console.log('✅ Debates Service (global) loaded');
