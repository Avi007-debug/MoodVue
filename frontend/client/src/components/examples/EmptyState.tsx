import EmptyState from '../EmptyState';

export default function EmptyStateExample() {
  return (
    <div className="p-6">
      <EmptyState 
        title="No Sessions Yet"
        description="Start your first emotion tracking session to see your mood insights and trends appear here."
        actionLabel="Start First Session"
        onAction={() => console.log('Start first session clicked')}
      />
    </div>
  );
}
