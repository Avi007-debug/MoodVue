import { Button } from "@/components/ui/button";
import emptyStateImage from "@assets/generated_images/Empty_state_meditation_illustration_2731b464.png";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({ title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <img 
        src={emptyStateImage} 
        alt="No data"
        className="w-64 h-64 object-contain mb-6 opacity-60"
      />
      <h3 className="text-xl font-heading font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6 max-w-md">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} data-testid="button-empty-state-action">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
