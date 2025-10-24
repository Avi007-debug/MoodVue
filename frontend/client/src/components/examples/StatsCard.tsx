import { TrendingUp } from 'lucide-react';
import StatsCard from '../StatsCard';

export default function StatsCardExample() {
  return (
    <div className="p-6 max-w-sm">
      <StatsCard 
        icon={TrendingUp}
        label="Average Mood"
        value={72}
        subtitle="+5% from last week"
        trend="up"
      />
    </div>
  );
}
