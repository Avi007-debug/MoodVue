# MoodVue

Real-time mood sensing from video using AI-powered emotion detection.

A hackathon project that analyzes facial expressions in real-time to detect emotions and provide mood insights through a modern web interface.

## 🚀 Features

- **Real-time Emotion Detection**: Uses DeepFace and OpenCV to analyze video feed and detect emotions
- **Mood Tracking**: Tracks emotional patterns over time with interactive charts
- **Session Management**: Start and end analysis sessions with detailed statistics
- **Responsive Web Interface**: Modern React-based UI with dark/light theme support
- **Authentication**: Secure user authentication via Supabase
- **Data Visualization**: Charts and graphs for mood history and trends
- **Relaxation Tips**: AI-powered suggestions based on detected emotions

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **Express.js** for server-side rendering
- **React Query** for state management
- **Recharts** for data visualization
- **Supabase** for authentication and database

### Backend
- **Flask** (async) with Python
- **DeepFace** for emotion recognition
- **OpenCV** for video processing
- **Supabase** for database operations
- **PostgreSQL** for data storage (Supabase)

### Deployment
- **Vercel** for frontend/serverless functions
- **Render** for backend API
- **Docker** for containerization

## 📋 Prerequisites

- Python 3.8+
- Node.js 18+
- Webcam access (for emotion detection)
- Supabase account

## 🔧 Installation

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate virtual environment:
   ```bash
   python -m venv venv
   venv\Scripts\activate  # Windows
   # or
   source venv/bin/activate  # Linux/Mac
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Configure Supabase credentials and other settings

5. Run the backend:
   ```bash
   python run.py
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Configure API URLs and Supabase settings

4. Run the development server:
   ```bash
   npm run dev
   ```

## 🎯 Usage

1. **Register/Login**: Create an account or sign in
2. **Start Session**: Begin emotion analysis by starting a live session
3. **View Insights**: Check your mood history and patterns in the Insights page
4. **Track Progress**: Monitor emotional trends over time

## 📊 API Endpoints

### Sessions
- `GET /api/sessions?days=7` - Get user sessions
- `POST /api/session/start` - Start new session
- `POST /api/session/end` - End current session
- `GET /api/sessions/session/{session_id}/stats` - Get session statistics
- `GET /api/session/{session_id}/emotions` - Get session emotions

### Analysis
- `GET /api/analyze` - Get current analysis
- `GET /api/history?days=7` - Get emotion history

## 🚀 Deployment

### Vercel (Frontend)
```bash
npm run build
# Deploy to Vercel
```

### Render (Backend)
- Use the provided `render.yaml` and `Dockerfile`
- Set environment variables in Render dashboard

## 🤝 Contributing

This project was built during a hackathon. Contributions are welcome!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

Licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built during AI VERSE hackathon
- Uses DeepFace for emotion detection
- Powered by Supabase for backend services
