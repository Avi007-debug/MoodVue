import EmotionDisplay from '../EmotionDisplay';

export default function EmotionDisplayExample() {
  return (
    <div className="p-6 max-w-sm mx-auto">
      <EmotionDisplay 
        emotion="calm"
        score={78}
        confidence={92}
      />
    </div>
  );
}
