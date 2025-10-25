import { useState, useEffect } from "react";
import { TrendingUp, Heart, Calendar } from "lucide-react";
import TimePeriodSelector from "@/components/TimePeriodSelector";
import MoodHistoryChart from "@/components/MoodHistoryChart";
import StatsCard from "@/components/StatsCard";
import RelaxationTip from "@/components/RelaxationTip";
import EmptyState from "@/components/EmptyState";
import { useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";

type Period = "day" | "week" | "month";

interface SessionStats {
  session_id: string;
  user_id: string;
  started_at: string;
  ended_at: string;
  total_duration: number | null;
  total_readings: number;
  avg_stress_score: number | null;
  dominant_emotion: string | null;
  avg_confidence: number | null;
  calm_readings: number;
  happy_readings: number;
  stressed_readings: number;
  email: string;
  full_name: string;
  settings: Record<string, any>;
}

interface HistoryEntry {
  emotion: string;
  stress_score: number;
  confidence: number;
  recorded_at: string;
  face_detected: boolean;
}

interface EmotionCounts {
  happy: number;
  calm: number;
  neutral: number;
  stressed: number;
  sad: number;
  count: number;
}

interface ChartDataPoint {
  date: string;
  happy: number;
  calm: number;
  neutral: number;
  stressed: number;
  sad: number;
}

interface AggregatedStats {
  totalReadings: number;
  avgStressScore: number;
  calmReadings: number;
  totalSessions: number;
}

export default function Insights() {
  const { user } = useAuth();
  const [period, setPeriod] = useState<Period>("week");
  const [showTip, setShowTip] = useState(true);
  const [hasData, setHasData] = useState(false);
  const [sessions, setSessions] = useState<SessionStats[]>([]);
  const [historyData, setHistoryData] = useState<HistoryEntry[]>([]);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [, setLocation] = useLocation();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        if (!user?.id) {
          console.log('No user ID available');
          setHasData(false);
          return;
        }

        // Convert period to days
        const days = period === 'day' ? 1 : period === 'week' ? 7 : 30;
        
        // Fetch all sessions for the user
        console.log(`Fetching sessions for user ${user.id}`);
        const sessionsData = await api.sessions.getUserSessions(user.id, days);
        console.log('Fetched sessions:', sessionsData);

        if (!Array.isArray(sessionsData)) {
          console.error('Sessions response is not an array:', sessionsData);
          setHasData(false);
          return;
        }

        if (sessionsData.length === 0) {
          console.log('No sessions found');
          setHasData(false);
          return;
        }

        setSessions(sessionsData);

        // Collect all emotions from valid sessions
        const allEmotions: any[] = [];
        
        for (const session of sessionsData) {
          if (!session?.session_id) {
            console.warn('Session in sessionsData without ID found:', session);
            continue;
          }

          try {
            console.log(`Fetching emotions for session ${session.session_id}`);
            const emotions = await api.sessions.getSessionEmotions(session.session_id);
            if (Array.isArray(emotions)) {
              allEmotions.push(...emotions);
            }
          } catch (error) {
            console.warn(`Error fetching emotions for session ${session.session_id}:`, error);
            continue;
          }
        }

        console.log('All collected emotions:', allEmotions);

        if (allEmotions.length > 0) {
          setHasData(true);
          setHistoryData(allEmotions);
        } else {
          console.log('No emotion data found');
          setHasData(false);
        }
      } catch (error) {
        console.error('Error fetching history:', error);
        setHasData(false);
      }
    };

    fetchHistory();
  }, [period, user?.id]);

  // Process history data
  useEffect(() => {
    if (historyData.length > 0) {
      const processedData: Record<string, EmotionCounts> = historyData.reduce((acc, entry) => {
        const date = new Date(entry.recorded_at);
        const dateStr = date.toLocaleDateString('en-US', { weekday: 'short' });
        
        if (!acc[dateStr]) {
          acc[dateStr] = {
            happy: 0,
            calm: 0,
            neutral: 0,
            stressed: 0,
            sad: 0,
            count: 0
          };
        }
        
        // Map backend emotions to chart emotions
        const mappedEmotion = entry.emotion.toLowerCase();
        if (mappedEmotion === 'angry' || mappedEmotion === 'fear' || mappedEmotion === 'disgust') {
          acc[dateStr].stressed++;
        } else if (mappedEmotion in acc[dateStr]) {
          acc[dateStr][mappedEmotion as keyof EmotionCounts]++;
        }
        acc[dateStr].count++;
        
        return acc;
      }, {} as Record<string, EmotionCounts>);

      const newChartData: ChartDataPoint[] = Object.entries(processedData).map(([date, counts]) => ({
        date,
        happy: (counts.happy / counts.count) * 100,
        calm: (counts.calm / counts.count) * 100,
        neutral: (counts.neutral / counts.count) * 100,
        stressed: (counts.stressed / counts.count) * 100,
        sad: (counts.sad / counts.count) * 100
      }));

      setChartData(newChartData.slice(-7)); // Show last 7 days
    }
  }, [historyData]);

  if (!hasData) {
    return (
      <div className="min-h-screen bg-background">
        <EmptyState 
          title="No Insights Yet"
          description="Complete your first emotion tracking session to start seeing your mood insights and trends."
          actionLabel="Start First Session"
          onAction={() => setLocation("/session")}
        />
      </div>
    );
  }

  // Calculate aggregated stats from sessions
  const stats = sessions.reduce<AggregatedStats>((acc, session) => {
    return {
      totalReadings: acc.totalReadings + (session.total_readings || 0),
      avgStressScore: acc.avgStressScore + (session.avg_stress_score || 0),
      calmReadings: acc.calmReadings + (session.calm_readings || 0),
      totalSessions: acc.totalSessions + 1
    };
  }, { totalReadings: 0, avgStressScore: 0, calmReadings: 0, totalSessions: 0 });

  const averageMood = stats.totalReadings > 0 ? stats.avgStressScore / stats.totalSessions : 0;
  const calmSessions = stats.calmReadings;
  const totalSessions = stats.totalSessions;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-heading font-bold mb-2">Insights & History</h2>
            <p className="text-muted-foreground">Review your emotional patterns and trends</p>
          </div>
          <TimePeriodSelector selected={period} onChange={setPeriod} />
        </div>

        {showTip && (
          <RelaxationTip 
            tip="You're showing great emotional balance this week! Keep practicing mindfulness to maintain this positive trend."
            onDismiss={() => setShowTip(false)}
          />
        )}

        <div className="grid md:grid-cols-3 gap-6">
          <StatsCard 
            icon={TrendingUp}
            label="Average Mood"
            value={Math.round(100 - averageMood)} // Convert stress score to mood score
            subtitle={`Average from ${historyData.length} readings`}
            trend={averageMood < 50 ? "up" : "down"}
          />
          <StatsCard 
            icon={Heart}
            label="Calm Moments"
            value={calmSessions}
            subtitle={`${((calmSessions / historyData.length) * 100).toFixed(1)}% of time`}
            trend="up"
          />
          <StatsCard 
            icon={Calendar}
            label="Total Sessions"
            value={totalSessions}
            subtitle={`Last ${period}`}
            trend="neutral"
          />
        </div>

        {chartData.length > 0 ? (
          <MoodHistoryChart data={chartData} />
        ) : (
          <div className="text-center text-muted-foreground py-8">
            Loading chart data...
          </div>
        )}
      </div>
    </div>
  );
}
