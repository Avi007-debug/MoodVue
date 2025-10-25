-- Drop table if it exists (warning: this will lose all data)
DROP TABLE IF EXISTS public.emotion_records;
DROP TYPE IF EXISTS public.emotion_type;

-- Create emotion type enum
CREATE TYPE public.emotion_type AS ENUM (
    'happy',
    'sad',
    'angry',
    'fear',
    'surprise',
    'neutral',
    'disgust',
    'calm'
);

-- Create emotion_records table
CREATE TABLE public.emotion_records (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id uuid REFERENCES public.sessions(id) ON DELETE CASCADE,
    emotion emotion_type NOT NULL,
    stress_score numeric(5,2),
    confidence numeric(5,2) NOT NULL,
    face_detected boolean DEFAULT true,
    recorded_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_emotion_records_session_id ON public.emotion_records(session_id);
CREATE INDEX idx_emotion_records_recorded_at ON public.emotion_records(recorded_at);
CREATE INDEX idx_emotion_records_emotion ON public.emotion_records(emotion);

-- Add RLS
ALTER TABLE public.emotion_records ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view emotion records for their sessions"
    ON public.emotion_records
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 
            FROM public.sessions s 
            WHERE s.id = session_id 
            AND s.user_id = auth.uid()::uuid
        )
    );

CREATE POLICY "Users can insert emotion records for active sessions"
    ON public.emotion_records
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 
            FROM public.sessions s 
            WHERE s.id = session_id 
            AND s.user_id = auth.uid()::uuid
            AND s.ended_at IS NULL
        )
    );

-- Create trigger for updating updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_emotion_records_updated_at
    BEFORE UPDATE ON public.emotion_records
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();