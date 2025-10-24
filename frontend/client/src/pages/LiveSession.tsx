import { useState } from "react";
import LiveSessionCamera from "@/components/LiveSessionCamera";
import SessionControls from "@/components/SessionControls";
import EmotionDisplay from "@/components/EmotionDisplay";
import TrendChart from "@/components/TrendChart";

type SessionStatus = "idle" | "active" | "paused";

export default function LiveSession() {
  const [sessionStatus, setSessionStatus] = useState<SessionStatus>("idle");
  const [faceDetected, setFaceDetected] = useState(false);

  const mockTrendData = [
    { time: "0s", score: 65 },
    { time: "10s", score: 68 },
    { time: "20s", score: 72 },
    { time: "30s", score: 70 },
    { time: "40s", score: 75 },
    { time: "50s", score: 78 },
    { time: "60s", score: 76 },
  ];

  const handleStart = () => {
    setSessionStatus("active");
    setFaceDetected(true);
    console.log("Session started");
  };

  const handlePause = () => {
    setSessionStatus("paused");
    console.log("Session paused");
  };

  const handleStop = () => {
    setSessionStatus("idle");
    setFaceDetected(false);
    console.log("Session stopped");
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

            {sessionStatus === "active" && (
              <TrendChart data={mockTrendData} height={160} />
            )}
          </div>

          <div className="space-y-6">
            {sessionStatus === "active" && (
              <EmotionDisplay 
                emotion="calm"
                score={76}
                confidence={89}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
