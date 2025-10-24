import MoodHistoryChart from '../MoodHistoryChart';

const mockData = [
  { date: "Mon", happy: 65, calm: 72, neutral: 45, stressed: 30, sad: 20 },
  { date: "Tue", happy: 70, calm: 75, neutral: 40, stressed: 25, sad: 15 },
  { date: "Wed", happy: 68, calm: 80, neutral: 35, stressed: 28, sad: 18 },
  { date: "Thu", happy: 75, calm: 78, neutral: 38, stressed: 22, sad: 12 },
  { date: "Fri", happy: 80, calm: 85, neutral: 30, stressed: 18, sad: 10 },
  { date: "Sat", happy: 82, calm: 88, neutral: 28, stressed: 15, sad: 8 },
  { date: "Sun", happy: 78, calm: 82, neutral: 32, stressed: 20, sad: 12 },
];

export default function MoodHistoryChartExample() {
  return (
    <div className="p-6">
      <MoodHistoryChart data={mockData} />
    </div>
  );
}
