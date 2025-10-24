import { useState } from "react";
import { TrendingUp, Heart, Calendar } from "lucide-react";
import TimePeriodSelector from "@/components/TimePeriodSelector";
import MoodHistoryChart from "@/components/MoodHistoryChart";
import StatsCard from "@/components/StatsCard";
import RelaxationTip from "@/components/RelaxationTip";
import EmptyState from "@/components/EmptyState";

type Period = "day" | "week" | "month";

export default function Insights() {
  const [period, setPeriod] = useState<Period>("week");
  const [showTip, setShowTip] = useState(true);
  const [hasData] = useState(true);

  const mockWeekData = [
    { date: "Mon", happy: 65, calm: 72, neutral: 45, stressed: 30, sad: 20 },
    { date: "Tue", happy: 70, calm: 75, neutral: 40, stressed: 25, sad: 15 },
    { date: "Wed", happy: 68, calm: 80, neutral: 35, stressed: 28, sad: 18 },
    { date: "Thu", happy: 75, calm: 78, neutral: 38, stressed: 22, sad: 12 },
    { date: "Fri", happy: 80, calm: 85, neutral: 30, stressed: 18, sad: 10 },
    { date: "Sat", happy: 82, calm: 88, neutral: 28, stressed: 15, sad: 8 },
    { date: "Sun", happy: 78, calm: 82, neutral: 32, stressed: 20, sad: 12 },
  ];

  if (!hasData) {
    return (
      <div className="min-h-screen bg-background">
        <EmptyState 
          title="No Insights Yet"
          description="Complete your first emotion tracking session to start seeing your mood insights and trends."
          actionLabel="Start First Session"
          onAction={() => console.log("Navigate to live session")}
        />
      </div>
    );
  }

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
            value={76}
            subtitle="+8% from last week"
            trend="up"
          />
          <StatsCard 
            icon={Heart}
            label="Calm Sessions"
            value={12}
            subtitle="Most frequent emotion"
            trend="up"
          />
          <StatsCard 
            icon={Calendar}
            label="Total Sessions"
            value={18}
            subtitle="This week"
            trend="neutral"
          />
        </div>

        <MoodHistoryChart data={mockWeekData} />
      </div>
    </div>
  );
}
