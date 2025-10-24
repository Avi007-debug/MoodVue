import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";
import { Card } from "@/components/ui/card";

interface MoodHistoryChartProps {
  data: Array<{
    date: string;
    happy?: number;
    calm?: number;
    neutral?: number;
    stressed?: number;
    sad?: number;
  }>;
}

export default function MoodHistoryChart({ data }: MoodHistoryChartProps) {
  return (
    <Card className="p-6 col-span-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-heading font-semibold">Mood History</h3>
      </div>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data}>
          <XAxis 
            dataKey="date" 
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: "hsl(var(--popover))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "var(--radius)",
            }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="happy" 
            stroke="hsl(var(--chart-1))" 
            strokeWidth={2}
            name="Happy"
          />
          <Line 
            type="monotone" 
            dataKey="calm" 
            stroke="hsl(var(--chart-2))" 
            strokeWidth={2}
            name="Calm"
          />
          <Line 
            type="monotone" 
            dataKey="neutral" 
            stroke="hsl(var(--chart-3))" 
            strokeWidth={2}
            name="Neutral"
          />
          <Line 
            type="monotone" 
            dataKey="stressed" 
            stroke="hsl(var(--chart-4))" 
            strokeWidth={2}
            name="Stressed"
          />
          <Line 
            type="monotone" 
            dataKey="sad" 
            stroke="hsl(var(--chart-5))" 
            strokeWidth={2}
            name="Sad"
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
