-- Drop existing policies for emotion_records
DROP POLICY IF EXISTS "Users can view emotion records for their sessions" ON public.emotion_records;
DROP POLICY IF EXISTS "Users can insert emotion records for active sessions" ON public.emotion_records;

-- Enable RLS on emotion_records table
ALTER TABLE public.emotion_records ENABLE ROW LEVEL SECURITY;

-- Users can view emotion records only for sessions they own
CREATE POLICY "Users can view emotion records for their sessions"
    ON public.emotion_records
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 
            FROM public.sessions s 
            WHERE s.id = session_id::uuid 
            AND s.user_id = auth.uid()::uuid
        )
    );

-- Users can insert emotion records only for their active sessions
CREATE POLICY "Users can insert emotion records for active sessions"
    ON public.emotion_records
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 
            FROM public.sessions s 
            WHERE s.id = session_id::uuid 
            AND s.user_id = auth.uid()::uuid
            AND s.ended_at IS NULL
        )
    );

-- Drop existing policies for sessions
DROP POLICY IF EXISTS "Users can view their own session stats" ON public.sessions;
DROP POLICY IF EXISTS "Users can update their own session stats" ON public.sessions;
DROP POLICY IF EXISTS "Users can create sessions for themselves" ON public.sessions;

-- Enable RLS on sessions table
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

-- Users can view their own session stats
CREATE POLICY "Users can view their own session stats"
    ON public.sessions
    FOR SELECT
    TO authenticated
    USING (user_id::uuid = auth.uid()::uuid);

-- Users can update their own session stats
CREATE POLICY "Users can update their own session stats"
    ON public.sessions
    FOR UPDATE
    TO authenticated
    USING (user_id::uuid = auth.uid()::uuid);

-- Allow users to create sessions for themselves only
CREATE POLICY "Users can create sessions for themselves"
    ON public.sessions
    FOR INSERT
    TO authenticated
    WITH CHECK (user_id::uuid = auth.uid()::uuid);