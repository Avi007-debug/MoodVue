-- Enable RLS on sessions table if not already enabled
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

-- Users can view their own session stats
CREATE POLICY "Users can view their own session stats"
    ON public.sessions
    FOR SELECT
    TO authenticated
    USING (auth.uid()::uuid = user_id::uuid);

-- Users can update their own session stats
CREATE POLICY "Users can update their own session stats"
    ON public.sessions
    FOR UPDATE
    TO authenticated
    USING (auth.uid()::uuid = user_id::uuid);

-- Allow emotion records to trigger session updates
CREATE POLICY "Emotion records can trigger session updates"
    ON public.sessions
    FOR UPDATE
    USING (EXISTS (
        SELECT 1
        FROM public.emotion_records er
        WHERE er.session_id = id
    ));

-- Users can insert emotion records for their own active sessions
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