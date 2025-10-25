-- Drop existing function if it exists
DROP FUNCTION IF EXISTS update_session_stats CASCADE;

-- Create function to update session statistics
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
            COUNT(CASE WHEN emotion IN ('angry', 'fear', 'disgust', 'sad') THEN 1 END) as stressed_readings
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
$$ LANGUAGE plpgsql;

-- Create trigger for emotion_records
DROP TRIGGER IF EXISTS update_session_stats_trigger ON public.emotion_records;
CREATE TRIGGER update_session_stats_trigger
    AFTER INSERT OR UPDATE OR DELETE ON public.emotion_records
    FOR EACH ROW
    EXECUTE FUNCTION public.update_session_stats();

-- Update RLS policies to allow trigger execution
ALTER FUNCTION public.update_session_stats() SET search_path = public;
ALTER FUNCTION public.update_session_stats() SECURITY DEFINER;

-- Add new columns to sessions table if they don't exist
ALTER TABLE sessions 
    ADD COLUMN IF NOT EXISTS total_readings INTEGER DEFAULT 0,
    ADD COLUMN IF NOT EXISTS avg_stress_score NUMERIC(5,2),
    ADD COLUMN IF NOT EXISTS dominant_emotion emotion_type,
    ADD COLUMN IF NOT EXISTS avg_confidence NUMERIC(5,2),
    ADD COLUMN IF NOT EXISTS calm_readings INTEGER DEFAULT 0,
    ADD COLUMN IF NOT EXISTS happy_readings INTEGER DEFAULT 0,
    ADD COLUMN IF NOT EXISTS stressed_readings INTEGER DEFAULT 0;

-- Update session duration on end
CREATE OR REPLACE FUNCTION public.update_session_duration()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.ended_at IS NOT NULL AND OLD.ended_at IS NULL THEN
        NEW.total_duration := EXTRACT(EPOCH FROM (NEW.ended_at - NEW.started_at))::INTEGER;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for session duration
DROP TRIGGER IF EXISTS update_session_duration_trigger ON public.sessions;
CREATE TRIGGER update_session_duration_trigger
    BEFORE UPDATE ON public.sessions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_session_duration();

-- Update RLS policies to allow trigger execution
ALTER FUNCTION public.update_session_duration() SET search_path = public;

-- Update existing sessions with current stats
DO $$
BEGIN
    WITH stats AS (
        SELECT 
            session_id,
            COUNT(*) as total_readings,
            ROUND(AVG(stress_score)::numeric, 2) as avg_stress_score,
            MODE() WITHIN GROUP (ORDER BY emotion) as dominant_emotion,
            ROUND(AVG(confidence)::numeric, 2) as avg_confidence,
            COUNT(CASE WHEN emotion = 'calm' THEN 1 END) as calm_readings,
            COUNT(CASE WHEN emotion = 'happy' THEN 1 END) as happy_readings,
            COUNT(CASE WHEN emotion IN ('angry', 'fear', 'disgust', 'sad') THEN 1 END) as stressed_readings
        FROM public.emotion_records
        GROUP BY session_id
    )
    UPDATE public.sessions s
    SET 
        total_readings = stats.total_readings,
        avg_stress_score = stats.avg_stress_score,
        dominant_emotion = stats.dominant_emotion,
        avg_confidence = stats.avg_confidence,
        calm_readings = stats.calm_readings,
        happy_readings = stats.happy_readings,
        stressed_readings = stats.stressed_readings
    FROM stats
    WHERE s.id = stats.session_id;
END $$;