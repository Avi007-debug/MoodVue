from datetime import datetime, timezone
from typing import Optional, List, Dict
from app.db import supabase

class SessionService:
    def __init__(self):
        self.current_session_id = None
        self.current_user_id = None
        self.session_start_time = None

    def start_session(self, user_id: str) -> Dict:
        """Start a new emotion tracking session."""
        self.current_user_id = user_id
        self.session_start_time = datetime.now(timezone.utc)
        
        # Create session record
        session = supabase.table('sessions').insert({
            'user_id': user_id,
            'started_at': self.session_start_time.isoformat()
        }).execute()
        
        self.current_session_id = session.data[0]['id']
        return session.data[0]

    def end_session(self) -> Optional[Dict]:
        """End the current session."""
        if not self.current_session_id:
            return None

        end_time = datetime.now(timezone.utc)
        duration = int((end_time - self.session_start_time).total_seconds())

        # Update session record
        session = supabase.table('sessions').update({
            'ended_at': end_time.isoformat(),
            'total_duration': duration
        }).eq('id', self.current_session_id).execute()

        # Reset session state
        self.current_session_id = None
        self.current_user_id = None
        self.session_start_time = None

        return session.data[0]

    def record_emotion(self, emotion_data: Dict) -> Dict:
        """Record an emotion reading for the current session."""
        if not self.current_session_id:
            raise ValueError("No active session")

        record = {
            'session_id': self.current_session_id,
            'emotion': emotion_data['emotion'],
            'stress_score': emotion_data['stress_score'],
            'confidence': emotion_data['confidence'],
            'face_detected': emotion_data.get('face_detected', False)
        }

        result = supabase.table('emotion_records').insert(record).execute()
        return result.data[0]

    def get_user_sessions(self, user_id: str, days: int = 7) -> List[Dict]:
        """Get session statistics for a user."""
        result = supabase.table('session_stats')\
            .select('*')\
            .eq('user_id', user_id)\
            .gte('started_at', f'now()-{days}d')\
            .order('started_at', desc=True)\
            .execute()
        return result.data

    def get_session_emotions(self, session_id: str) -> List[Dict]:
        """Get all emotion records for a specific session."""
        result = supabase.table('emotion_records')\
            .select('*')\
            .eq('session_id', session_id)\
            .order('timestamp', desc=False)\
            .execute()
        return result.data

    def get_user_emotion_history(self, user_id: str, days: int = 7) -> List[Dict]:
        """Get emotion history for a user across all sessions."""
        result = supabase.table('emotion_records')\
            .select('emotion_records.*, sessions.user_id')\
            .join('sessions', 'emotion_records.session_id=sessions.id')\
            .eq('sessions.user_id', user_id)\
            .gte('emotion_records.timestamp', f'now()-{days}d')\
            .order('timestamp', desc=False)\
            .execute()
        return result.data

# Create a singleton instance
session_service = SessionService()