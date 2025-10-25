const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export const api = {
  baseUrl: API_BASE_URL,
  
  // Session endpoints
  sessions: {
    // Get video feed URL
    getVideoFeedUrl: () => `${API_BASE_URL}/sessions/video_feed`,
    
    // Start a new session
    async start(userId: string) {
      const response = await fetch(`${API_BASE_URL}/session/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'X-User-Id': userId
        },
        body: JSON.stringify({ user_id: userId }),
      });
      if (!response.ok) throw new Error('Failed to start session');
      return response.json();
    },

    // End the current session
    async end(sessionId: string) {
      const response = await fetch(`${API_BASE_URL}/session/end`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'X-User-Id': sessionId.split('-')[0] // Get the user ID from session ID prefix
        },
        body: JSON.stringify({ session_id: sessionId }),
      });
      if (!response.ok) throw new Error('Failed to end session');
      return response.json();
    },

    // Get all sessions for a user
    async getUserSessions(userId: string, days: number = 7) {
      const response = await fetch(`${API_BASE_URL}/sessions?days=${days}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'X-User-Id': userId
        }
      });
      if (!response.ok) throw new Error('Failed to get user sessions');
      return response.json();
    },

    // Get stats for a specific session
    async getSessionStats(sessionId: string) {
      const response = await fetch(`${API_BASE_URL}/sessions/session/${sessionId}/stats`);
      if (!response.ok) throw new Error('Failed to get session stats');
      return response.json();
    },

    // Get emotions for a specific session
    async getSessionEmotions(sessionId: string) {
      console.log(`Fetching emotions for session ${sessionId}`);
      const response = await fetch(`${API_BASE_URL}/session/${sessionId}/emotions`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'X-User-Id': sessionId.split('-')[0] // Get the user ID from session ID prefix
        }
      });
      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to get session emotions: ${error}`);
      }
      return response.json();
    },

    // Get current emotion analysis
    async getAnalysis(userId: string) {
      const response = await fetch(`${API_BASE_URL}/analyze`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'X-User-Id': userId
        }
      });
      if (!response.ok) throw new Error('Failed to get analysis');
      return response.json();
    },

    // Get emotion history
    async getHistory(userId: string, days: number = 7) {
      const response = await fetch(`${API_BASE_URL}/history?days=${days}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'X-User-Id': userId
        }
      });
      if (!response.ok) throw new Error('Failed to get history');
      return response.json();
    }
  }
};