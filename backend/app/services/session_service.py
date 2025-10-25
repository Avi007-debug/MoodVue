import logging
from datetime import datetime, timezone, timedelta
from typing import Dict, List, Optional, Any
from uuid import UUID
from postgrest.exceptions import APIError

from app.database import get_supabase_client

logger = logging.getLogger(__name__)

class SessionService:
    def __init__(self):
        self.supabase = get_supabase_client()

    async def create_session(self, user_id: UUID) -> Dict[str, Any]:
        """Create a new session for a user."""
        session_data = {
            "user_id": str(user_id),
            "started_at": datetime.now(timezone.utc).isoformat()
        }
        
        try:
            # Check for existing active session
            active_session = await self.get_active_session(user_id)
            if active_session:
                logger.warning(f"User {user_id} already has an active session: {active_session['id']}")
                return active_session

            result = self.supabase.table("sessions").insert(session_data).execute()
            session = result.data[0] if result.data else None
            
            if session:
                logger.info(f"Created new session {session['id']} for user {user_id}")
                return session
            else:
                logger.error("Failed to create session - no data returned")
                raise ValueError("Failed to create session")
                
        except APIError as e:
            logger.error(f"Supabase API error creating session: {str(e)}")
            raise
        except Exception as e:
            logger.error(f"Unexpected error creating session: {str(e)}")
            raise

    async def end_session(self, session_id: UUID) -> Dict[str, Any]:
        """End a session and calculate its duration."""
        try:
            # Get current session to verify it exists and isn't already ended
            result = self.supabase.table("sessions").select("*").eq("id", str(session_id)).execute()
            session = result.data[0] if result.data else None
            
            if not session:
                logger.error(f"Session {session_id} not found")
                raise ValueError(f"Session {session_id} not found")
                
            if session.get("ended_at"):
                logger.warning(f"Session {session_id} was already ended at {session['ended_at']}")
                return session
            
            ended_at = datetime.now(timezone.utc)
            
            # Update the session with end time
            result = self.supabase.table("sessions").update({
                "ended_at": ended_at.isoformat()
            }).eq("id", str(session_id)).execute()
            
            updated_session = result.data[0] if result.data else None
            
            if updated_session:
                logger.info(f"Successfully ended session {session_id}")
                return updated_session
            else:
                logger.error(f"Failed to end session {session_id}")
                raise ValueError("Failed to end session")
                
        except Exception as e:
            logger.error(f"Error ending session {session_id}: {str(e)}")
            raise

    async def record_emotion(self, session_id: UUID, emotion_data: Dict[str, Any]) -> Dict[str, Any]:
        """Record an emotion reading for a session."""
        try:
            # Verify session exists and is active
            session = await self.get_active_session_by_id(session_id)
            if not session:
                logger.error(f"Session {session_id} not found or already ended")
                raise ValueError(f"Session {session_id} not found or already ended")

            # Validate emotion data
            required_fields = ["emotion", "confidence"]
            for field in required_fields:
                if field not in emotion_data:
                    logger.error(f"Missing required field: {field}")
                    raise ValueError(f"Missing required field: {field}")

            emotion_record = {
                "session_id": str(session_id),
                "emotion": emotion_data["emotion"].lower(),
                "stress_score": emotion_data.get("stress_score"),
                "confidence": emotion_data["confidence"],
                "face_detected": emotion_data.get("face_detected", True),
                "recorded_at": datetime.now(timezone.utc).isoformat()
            }
            
            logger.debug(f"Recording emotion for session {session_id}: {emotion_record}")
            
            try:
                result = self.supabase.table("emotion_records").insert(emotion_record).execute()
                logger.debug(f"Raw insert result: {result}")
                record = result.data[0] if result.data else None
                
                if record:
                    logger.info(f"Successfully recorded emotion for session {session_id}: {record}")
                    return record
                else:
                    error_msg = "Failed to record emotion - no data returned from insert"
                    logger.error(error_msg)
                    raise ValueError(error_msg)
            except Exception as e:
                logger.error(f"Database error recording emotion: {str(e)}")
                raise ValueError(f"Database error: {str(e)}")
        except Exception as e:
            logger.error(f"Error recording emotion for session {session_id}: {str(e)}")
            raise

    async def get_active_session_by_id(self, session_id: UUID) -> Optional[Dict[str, Any]]:
        """Get an active session by its ID."""
        try:
            result = self.supabase.table("sessions").select("*").eq(
                "id", str(session_id)
            ).is_("ended_at", "null").execute()
            
            return result.data[0] if result.data else None
        except Exception as e:
            logger.error(f"Error getting active session {session_id}: {str(e)}")
            raise

    async def get_session_stats(self, session_id: UUID) -> Dict[str, Any]:
        """Get statistics for a specific session."""
        try:
            # First check if session exists
            session_result = self.supabase.table("sessions").select("*").eq("id", str(session_id)).execute()
            session = session_result.data[0] if session_result.data else None
            
            if not session:
                logger.error(f"Session {session_id} not found")
                raise ValueError(f"Session {session_id} not found")
            
            # Get emotion stats directly from the sessions table
            stats = {
                "session_id": session["id"],
                "user_id": session["user_id"],
                "started_at": session["started_at"],
                "ended_at": session.get("ended_at"),
                "total_readings": session.get("total_readings", 0),
                "avg_stress_score": session.get("avg_stress_score"),
                "dominant_emotion": session.get("dominant_emotion"),
                "avg_confidence": session.get("avg_confidence"),
                "emotion_counts": {
                    "calm": session.get("calm_readings", 0),
                    "happy": session.get("happy_readings", 0),
                    "stressed": session.get("stressed_readings", 0)
                },
                "total_duration": session.get("total_duration")
            }
            
            return stats
        except Exception as e:
            logger.error(f"Error getting stats for session {session_id}: {str(e)}")
            raise

    async def get_user_sessions(self, user_id: UUID, days: int = 7) -> List[Dict[str, Any]]:
        """Get all sessions for a user within the specified number of days."""
        try:
            # Calculate the date threshold
            threshold_date = datetime.now(timezone.utc) - timedelta(days=days)

            # Query sessions directly
            result = self.supabase.table("sessions").select("""
                id,
                user_id,
                started_at,
                ended_at,
                total_duration,
                total_readings,
                avg_stress_score,
                dominant_emotion,
                avg_confidence,
                calm_readings,
                happy_readings,
                stressed_readings,
                profiles!inner(email, full_name, settings)
            """).eq("user_id", str(user_id)).gte("started_at", threshold_date.isoformat()).order("started_at", desc=True).execute()

            sessions = result.data if result.data else []

            # Transform the data to match the expected format
            transformed_sessions = []
            for session in sessions:
                transformed_sessions.append({
                    "user_id": session["user_id"],
                    "session_id": session["id"],
                    "started_at": session["started_at"],
                    "ended_at": session.get("ended_at"),
                    "total_duration": session.get("total_duration"),
                    "total_readings": session.get("total_readings", 0),
                    "avg_stress_score": session.get("avg_stress_score"),
                    "dominant_emotion": session.get("dominant_emotion"),
                    "avg_confidence": session.get("avg_confidence"),
                    "calm_readings": session.get("calm_readings", 0),
                    "happy_readings": session.get("happy_readings", 0),
                    "stressed_readings": session.get("stressed_readings", 0),
                    "email": session["profiles"]["email"],
                    "full_name": session["profiles"]["full_name"],
                    "settings": session["profiles"]["settings"]
                })

            if not transformed_sessions:
                logger.info(f"No sessions found for user {user_id} in the last {days} days")
            else:
                logger.info(f"Found {len(transformed_sessions)} sessions for user {user_id}")

            return transformed_sessions
        except Exception as e:
            logger.error(f"Error getting sessions for user {user_id}: {str(e)}")
            raise

    async def get_session_emotions(self, session_id: UUID) -> List[Dict[str, Any]]:
        """Get all emotion records for a session."""
        try:
            # First verify session exists
            session_result = self.supabase.table("sessions").select("*").eq("id", str(session_id)).execute()
            session = session_result.data[0] if session_result.data else None
            
            if not session:
                logger.error(f"Session {session_id} not found")
                raise ValueError(f"Session {session_id} not found")

            # Get emotion records
            result = self.supabase.table("emotion_records").select("*").eq(
                "session_id", str(session_id)
            ).order("recorded_at").execute()
            
            emotions = result.data if result.data else []
            
            logger.info(f"Retrieved {len(emotions)} emotion records for session {session_id}")
            return emotions
        except Exception as e:
            logger.error(f"Error getting emotions for session {session_id}: {str(e)}")
            raise

    async def get_active_session(self, user_id: UUID) -> Optional[Dict[str, Any]]:
        """Get the user's active session if one exists."""
        try:
            result = self.supabase.table("sessions").select("*").eq(
                "user_id", str(user_id)
            ).is_("ended_at", "null").execute()
            
            session = result.data[0] if result.data else None
            
            if session:
                logger.info(f"Found active session {session['id']} for user {user_id}")
            else:
                logger.info(f"No active session found for user {user_id}")
                
            return session
        except Exception as e:
            logger.error(f"Error getting active session for user {user_id}: {str(e)}")
            raise