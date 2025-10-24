import { Smile, Frown, Meh, AlertCircle, Heart } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

type EmotionType = "happy" | "sad" | "neutral" | "stressed" | "calm";

interface EmotionDisplayProps {
  emotion: EmotionType;
  score: number;
  confidence: number;
}

const emotionConfig = {
  happy: { icon: Smile, label: "Happy", color: "text-status-online" },
  sad: { icon: Frown, label: "Sad", color: "text-chart-3" },
  neutral: { icon: Meh, label: "Neutral", color: "text-muted-foreground" },
  stressed: { icon: AlertCircle, label: "Stressed", color: "text-status-busy" },
  calm: { icon: Heart, label: "Calm", color: "text-primary" },
};

export default function EmotionDisplay({ emotion, score, confidence }: EmotionDisplayProps) {
  const config = emotionConfig[emotion];
  const Icon = config.icon;

  return (
    <Card className="p-6 backdrop-blur-sm bg-card/95">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className={`${config.color}`}>
          <Icon className="w-12 h-12" />
        </div>
        
        <div>
          <p className="text-sm text-muted-foreground mb-1">Current Emotion</p>
          <h3 className="text-2xl font-heading font-semibold">{config.label}</h3>
        </div>
        
        <div className="w-full">
          <div className="flex justify-between items-baseline mb-2">
            <span className="text-sm text-muted-foreground">Mood Score</span>
            <span className="text-6xl font-bold tabular-nums" data-testid="text-mood-score">{score}</span>
          </div>
        </div>
        
        <div className="w-full space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Confidence</span>
            <span className="font-medium">{confidence}%</span>
          </div>
          <Progress value={confidence} className="h-2" />
        </div>
      </div>
    </Card>
  );
}
