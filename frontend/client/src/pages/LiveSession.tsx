import { useState, useEffect, useRef } from "react";
import LiveSessionCamera from "@/components/LiveSessionCamera";
import SessionControls from "@/components/SessionControls";
import EmotionDisplay from "@/components/EmotionDisplay";
import TrendChart from "@/components/TrendChart";
import { useAuth } from "@/context/AuthContext";

type SessionStatus = "idle" | "active" | "paused";

type EmotionType = "happy" | "sad" | "neutral" | "stressed" | "calm";

// Map backend emotions to frontend emotions
const emotionMapping: Record<string, EmotionType> = {
  "happy": "happy",
  "sad": "sad",
  "neutral": "neutral",
  "angry": "stressed",
  "fear": "stressed",
  "disgust": "stressed",
  "calm": "calm"
};

interface EmotionData {
  emotion: EmotionType;
  score: number;
  confidence: number;
}

interface TrendDataPoint {
  time: string;
  score: number;
}

export default function LiveSession() {
  const { user } = useAuth();
  const [sessionStatus, setSessionStatus] = useState<SessionStatus>("idle");
  const [faceDetected, setFaceDetected] = useState(false);
  const [emotionData, setEmotionData] = useState<EmotionData>({
    emotion: "calm",
    score: 0,
    confidence: 0
  });
  const [trendData, setTrendData] = useState<TrendDataPoint[]>([]);

  const startTimeRef = useRef<number>(0);
  const pollInterval = useRef<NodeJS.Timeout>();

  // Effect for polling emotion data
  // Clean up session when component unmounts
  useEffect(() => {
    return () => {
      if (sessionStatus === 'active') {
        handleStop();
      }
    };
  }, [sessionStatus]);

  useEffect(() => {
    const pollEmotionData = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/analyze');
        const data = await response.json();
        
        if (
          data.emotion &&
          typeof data.emotion === "string" &&
          data.emotion in emotionMapping &&
          typeof data.stress_score === "number" &&
          typeof data.confidence === "number"
        ) {
          const emotion = emotionMapping[data.emotion];
          console.log("Received emotion data:", {
            emotion: data.emotion,
            mappedEmotion: emotion,
            score: data.stress_score,
            confidence: data.confidence
          });
          
          setEmotionData({
            emotion,
            score: data.stress_score,
            confidence: data.confidence * 100 // Convert to percentage
          });

          setFaceDetected(data.face_detected || false);
          
          setTrendData(prev => {
            const newPoint: TrendDataPoint = {
              time: `${Math.floor((Date.now() - startTimeRef.current) / 1000)}s`,
              score: data.stress_score
            };
            return [...prev, newPoint].slice(-60);
          });
        }
      } catch (error) {
        console.error('Error polling emotion data:', error);
      }
    };

    if (sessionStatus === 'active') {
      startTimeRef.current = Date.now();
      // Initial poll
      pollEmotionData();
      // Set up polling interval
      pollInterval.current = setInterval(pollEmotionData, 1000);
    }

    return () => {
      if (pollInterval.current) {
        clearInterval(pollInterval.current);
      }
    };
  }, [sessionStatus]);

  const handleStart = async () => {
    console.log("Starting session...");
    try {
      // Start session in backend
      const response = await fetch('http://localhost:5001/api/sessions/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user?.id
        })
      });

      if (!response.ok) {
        throw new Error('Failed to start session');
      }

      setSessionStatus("active");
      startTimeRef.current = Date.now();
    } catch (error) {
      console.error('Error starting session:', error);
      // Show error to user
    }
  };

  const handlePause = () => {
    console.log("Pausing session...");
    setSessionStatus("paused");
    if (pollInterval.current) {
      clearInterval(pollInterval.current);
    }
  };

  const handleStop = async () => {
    console.log("Stopping session...");
    try {
      // End session in backend
      const response = await fetch('http://localhost:5001/api/sessions/end', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to end session');
      }

      setSessionStatus("idle");
      setFaceDetected(false);
      setTrendData([]);
      setEmotionData({ emotion: "calm", score: 0, confidence: 0 });
      if (pollInterval.current) {
        clearInterval(pollInterval.current);
      }
    } catch (error) {
      console.error('Error ending session:', error);
      // Show error to user
    }
  };



  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-heading font-bold mb-2">Live Session</h2>
          <p className="text-muted-foreground">Start tracking your emotions in real-time</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <LiveSessionCamera
              isActive={sessionStatus === "active"}
              faceDetected={faceDetected}
            />

            <div className="relative">
              <SessionControls
                status={sessionStatus}
                onStart={handleStart}
                onPause={handlePause}
                onStop={handleStop}
              />
            </div>

            {sessionStatus === "active" && trendData.length > 0 && (
              <TrendChart data={trendData} height={160} />
            )}
          </div>

          <div className="space-y-6">
            {sessionStatus === "active" && (
              <EmotionDisplay
                emotion={emotionData.emotion}
                score={emotionData.score}
                confidence={emotionData.confidence}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
