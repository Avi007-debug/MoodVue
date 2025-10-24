import { Button } from "@/components/ui/button";

type Period = "day" | "week" | "month";

interface TimePeriodSelectorProps {
  selected: Period;
  onChange: (period: Period) => void;
}

export default function TimePeriodSelector({ selected, onChange }: TimePeriodSelectorProps) {
  const periods: Period[] = ["day", "week", "month"];

  return (
    <div className="inline-flex items-center gap-2 p-1.5 rounded-lg bg-muted">
      {periods.map((period) => (
        <Button
          key={period}
          variant={selected === period ? "default" : "ghost"}
          size="sm"
          onClick={() => onChange(period)}
          data-testid={`button-period-${period}`}
          className="capitalize"
        >
          {period}
        </Button>
      ))}
    </div>
  );
}
