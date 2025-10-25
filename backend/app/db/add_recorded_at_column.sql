-- Drop existing changes if needed
DROP TRIGGER IF EXISTS update_session_stats_trigger ON public.emotion_records;
DROP FUNCTION IF EXISTS update_session_stats();

-- Add recorded_at column and rename timestamp if it exists
DO $$
BEGIN
    -- Check if timestamp column exists and rename it to recorded_at
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'emotion_records' 
        AND column_name = 'timestamp'
    ) THEN
        ALTER TABLE public.emotion_records 
        RENAME COLUMN "timestamp" TO recorded_at;
    ELSE
        -- Add recorded_at column if neither exists
        ALTER TABLE public.emotion_records 
        ADD COLUMN IF NOT EXISTS recorded_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP;
    END IF;
END $$;

-- Update existing records to have a recorded_at value if null
UPDATE public.emotion_records 
SET recorded_at = CURRENT_TIMESTAMP 
WHERE recorded_at IS NULL;

-- Make recorded_at not nullable
ALTER TABLE public.emotion_records 
ALTER COLUMN recorded_at SET NOT NULL;

-- Create index on recorded_at for better query performance
CREATE INDEX IF NOT EXISTS idx_emotion_records_recorded_at 
ON public.emotion_records(recorded_at);

-- Recreate the session stats trigger with updated column name
CREATE OR REPLACE FUNCTION public.update_session_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Update session statistics when emotion records are added/deleted
    WITH stats AS (
        SELECT 
            COUNT(*) as total_readings,
            ROUND(AVG(stress_score)::numeric, 2) as avg_stress_score,
            MODE() WITHIN GROUP (ORDER BY emotion) as dominant_emotion,
            ROUND(AVG(confidence)::numeric, 2) as avg_confidence,
            COUNT(CASE WHEN emotion = 'calm' THEN 1 END) as calm_readings,
            COUNT(CASE WHEN emotion = 'happy' THEN 1 END) as happy_readings,
            COUNT(CASE WHEN emotion = 'stressed' OR emotion IN ('angry', 'fear', 'disgust') THEN 1 END) as stressed_readings
        FROM public.emotion_records
        WHERE session_id = COALESCE(NEW.session_id, OLD.session_id)
    )
    UPDATE public.sessions
    SET 
        total_readings = stats.total_readings,
        avg_stress_score = stats.avg_stress_score,
        dominant_emotion = stats.dominant_emotion,
        avg_confidence = stats.avg_confidence,
        calm_readings = stats.calm_readings,
        happy_readings = stats.happy_readings,
        stressed_readings = stats.stressed_readings,
        updated_at = CURRENT_TIMESTAMP
    FROM stats
    WHERE id = COALESCE(NEW.session_id, OLD.session_id);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger
DROP TRIGGER IF EXISTS update_session_stats_trigger ON public.emotion_records;
CREATE TRIGGER update_session_stats_trigger
    AFTER INSERT OR UPDATE OR DELETE ON public.emotion_records
    FOR EACH ROW
    EXECUTE FUNCTION public.update_session_stats();

-- Allow the trigger function to access necessary tables
ALTER FUNCTION public.update_session_stats() SET search_path = public;

-- Update RLS policies to include recorded_at column
DROP POLICY IF EXISTS "Users can view emotion records for their sessions" ON public.emotion_records;
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

COMMENT ON COLUMN public.emotion_records.recorded_at IS 'Timestamp when the emotion was recorded';