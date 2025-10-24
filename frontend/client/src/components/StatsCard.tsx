import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  subtitle?: string;
  trend?: "up" | "down" | "neutral";
}

export default function StatsCard({ icon: Icon, label, value, subtitle, trend }: StatsCardProps) {
  const trendColors = {
    up: "text-status-online",
    down: "text-status-busy",
    neutral: "text-muted-foreground",
  };

  return (
    <Card className="p-6 hover-elevate">
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-4xl font-bold tabular-nums" data-testid={`stat-${label.toLowerCase().replace(/\s/g, '-')}`}>
            {value}
          </p>
          {subtitle && (
            <p className={`text-sm ${trend ? trendColors[trend] : 'text-muted-foreground'}`}>
              {subtitle}
            </p>
          )}
        </div>
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
          <Icon className="w-6 h-6 text-primary" />
        </div>
      </div>
    </Card>
  );
}
