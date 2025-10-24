import TrendChart from '../TrendChart';

const mockData = [
  { time: "0s", score: 65 },
  { time: "10s", score: 68 },
  { time: "20s", score: 72 },
  { time: "30s", score: 70 },
  { time: "40s", score: 75 },
  { time: "50s", score: 78 },
  { time: "60s", score: 76 },
];

export default function TrendChartExample() {
  return (
    <div className="p-6 max-w-2xl">
      <TrendChart data={mockData} height={160} />
    </div>
  );
}
