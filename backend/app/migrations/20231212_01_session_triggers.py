"""Add session statistics triggers

This migration adds triggers to automatically update session statistics when emotion records
are added, updated, or deleted.
"""

from yoyo import step

__depends__ = {'20231211_01_initial'}

steps = [
    step(
        """
        -- Add new columns to sessions table
        ALTER TABLE sessions 
            ADD COLUMN IF NOT EXISTS total_readings INTEGER DEFAULT 0,
            ADD COLUMN IF NOT EXISTS avg_stress_score NUMERIC(5,2),
            ADD COLUMN IF NOT EXISTS dominant_emotion emotion_type,
            ADD COLUMN IF NOT EXISTS avg_confidence NUMERIC(5,2),
            ADD COLUMN IF NOT EXISTS calm_readings INTEGER DEFAULT 0,
            ADD COLUMN IF NOT EXISTS happy_readings INTEGER DEFAULT 0,
            ADD COLUMN IF NOT EXISTS stressed_readings INTEGER DEFAULT 0;

        -- Create function to update session statistics
        CREATE OR REPLACE FUNCTION update_session_stats()
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
                FROM emotion_records
                WHERE session_id = COALESCE(NEW.session_id, OLD.session_id)
            )
            UPDATE sessions
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
        DROP TRIGGER IF EXISTS update_session_stats_trigger ON emotion_records;
        CREATE TRIGGER update_session_stats_trigger
            AFTER INSERT OR UPDATE OR DELETE ON emotion_records
            FOR EACH ROW
            EXECUTE FUNCTION update_session_stats();

        -- Create function to update session duration
        CREATE OR REPLACE FUNCTION update_session_duration()
        RETURNS TRIGGER AS $$
        BEGIN
            IF NEW.ended_at IS NOT NULL AND OLD.ended_at IS NULL THEN
                NEW.total_duration := EXTRACT(EPOCH FROM (NEW.ended_at - NEW.started_at))::INTEGER;
            END IF;
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;

        -- Create trigger for session duration
        DROP TRIGGER IF EXISTS update_session_duration_trigger ON sessions;
        CREATE TRIGGER update_session_duration_trigger
            BEFORE UPDATE ON sessions
            FOR EACH ROW
            EXECUTE FUNCTION update_session_duration();
        """,
        """
        -- Drop triggers and functions
        DROP TRIGGER IF EXISTS update_session_stats_trigger ON emotion_records;
        DROP FUNCTION IF EXISTS update_session_stats();
        DROP TRIGGER IF EXISTS update_session_duration_trigger ON sessions;
        DROP FUNCTION IF EXISTS update_session_duration();

        -- Remove columns from sessions table
        ALTER TABLE sessions 
            DROP COLUMN IF EXISTS total_readings,
            DROP COLUMN IF EXISTS avg_stress_score,
            DROP COLUMN IF EXISTS dominant_emotion,
            DROP COLUMN IF EXISTS avg_confidence,
            DROP COLUMN IF EXISTS calm_readings,
            DROP COLUMN IF EXISTS happy_readings,
            DROP COLUMN IF EXISTS stressed_readings;
        """
    ),
    step(
        """
        -- Update existing sessions with current stats
        WITH stats AS (
            SELECT 
                session_id,
                COUNT(*) as total_readings,
                ROUND(AVG(stress_score)::numeric, 2) as avg_stress_score,
                MODE() WITHIN GROUP (ORDER BY emotion) as dominant_emotion,
                ROUND(AVG(confidence)::numeric, 2) as avg_confidence,
                COUNT(CASE WHEN emotion = 'calm' THEN 1 END) as calm_readings,
                COUNT(CASE WHEN emotion = 'happy' THEN 1 END) as happy_readings,
                COUNT(CASE WHEN emotion = 'stressed' OR emotion IN ('angry', 'fear', 'disgust') THEN 1 END) as stressed_readings
            FROM emotion_records
            GROUP BY session_id
        )
        UPDATE sessions s
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
        """,
        # No rollback needed for stats update since the columns will be dropped
        ""
    )
]