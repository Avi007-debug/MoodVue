const API_BASE_URL = '/api';

export const api = {
  baseUrl: API_BASE_URL,
  // Get video feed URL
  getVideoFeedUrl: () => `${API_BASE_URL}/video_feed`,
  
  // Get current emotion analysis
  async getAnalysis() {
    const response = await fetch(`${API_BASE_URL}/analyze`);
    if (!response.ok) throw new Error('Failed to get analysis');
    return response.json();
  },

  // Get emotion history
  async getHistory() {
    const response = await fetch(`${API_BASE_URL}/history`);
    if (!response.ok) throw new Error('Failed to get history');
    return response.json();
  }
};