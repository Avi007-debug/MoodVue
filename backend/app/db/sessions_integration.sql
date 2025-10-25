-- Create enum for emotion types
CREATE TYPE emotion_type AS ENUM (
    'happy', 'sad', 'neutral', 'angry', 'fear', 'disgust', 'calm', 'surprise', 'stressed'
);

-- Create sessions table with profile reference
CREATE TABLE IF NOT EXISTS sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP WITH TIME ZONE,
    total_duration INTEGER, -- in seconds
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create emotion_records table for storing individual emotion readings
CREATE TABLE IF NOT EXISTS emotion_records (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    session_id UUID REFERENCES sessions(id) ON DELETE CASCADE NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    emotion emotion_type NOT NULL,
    stress_score INTEGER NOT NULL CHECK (stress_score >= 0 AND stress_score <= 100),
    confidence FLOAT NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
    face_detected BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create view for session statistics
CREATE OR REPLACE VIEW session_stats AS
SELECT 
    s.user_id,
    s.id as session_id,
    s.started_at,
    s.ended_at,
    s.total_duration,
    COUNT(er.id) as total_readings,
    ROUND(AVG(er.stress_score)::numeric, 2) as avg_stress_score,
    MODE() WITHIN GROUP (ORDER BY er.emotion) as dominant_emotion,
    ROUND(AVG(er.confidence)::numeric, 2) as avg_confidence,
    COUNT(CASE WHEN er.emotion = 'calm' THEN 1 END) as calm_readings,
    COUNT(CASE WHEN er.emotion = 'happy' THEN 1 END) as happy_readings,
    COUNT(CASE WHEN er.emotion = 'stressed' OR er.emotion IN ('angry', 'fear', 'disgust') THEN 1 END) as stressed_readings,
    p.full_name,
    p.email,
    p.settings
FROM sessions s
LEFT JOIN emotion_records er ON s.id = er.session_id
JOIN profiles p ON s.user_id = p.id
GROUP BY s.id, s.user_id, s.started_at, s.ended_at, s.total_duration, p.full_name, p.email, p.settings;

-- Set up Row Level Security (RLS)
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE emotion_records ENABLE ROW LEVEL SECURITY;

-- RLS Policies for sessions
CREATE POLICY "Users can view their own sessions" ON sessions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sessions" ON sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sessions" ON sessions
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sessions" ON sessions
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for emotion_records
CREATE POLICY "Users can view their own emotion records" ON emotion_records
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM sessions 
            WHERE sessions.id = emotion_records.session_id 
            AND sessions.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert their own emotion records" ON emotion_records
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM sessions 
            WHERE sessions.id = emotion_records.session_id 
            AND sessions.user_id = auth.uid()
        )
    );

-- Update triggers for timestamps
CREATE TRIGGER update_sessions_updated_at
    BEFORE UPDATE ON sessions
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

-- Helpful functions for session management
CREATE OR REPLACE FUNCTION get_user_sessions(user_uuid UUID, days INTEGER DEFAULT 7)
RETURNS SETOF session_stats AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM session_stats
    WHERE user_id = user_uuid
    AND started_at >= (CURRENT_TIMESTAMP - (days || ' days')::interval)
    ORDER BY started_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_session_emotions(session_uuid UUID)
RETURNS SETOF emotion_records AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM emotion_records
    WHERE session_id = session_uuid
    ORDER BY timestamp ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add indexes for better performance
CREATE INDEX idx_emotion_records_session_id ON emotion_records(session_id);
CREATE INDEX idx_emotion_records_timestamp ON emotion_records(timestamp);
CREATE INDEX idx_emotion_records_emotion ON emotion_records(emotion);
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_started_at ON sessions(started_at);

-- Add computed column for session duration
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS duration_minutes 
    NUMERIC GENERATED ALWAYS AS (
        EXTRACT(EPOCH FROM (ended_at - started_at)) / 60
    ) STORED;