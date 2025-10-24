import { Play, Pause, Square } from "lucide-react";
import { Button } from "@/components/ui/button";

type SessionStatus = "idle" | "active" | "paused";

interface SessionControlsProps {
  status: SessionStatus;
  onStart?: () => void;
  onPause?: () => void;
  onStop?: () => void;
}

export default function SessionControls({ 
  status, 
  onStart, 
  onPause, 
  onStop 
}: SessionControlsProps) {
  return (
    <div className="flex items-center justify-center gap-4 p-6 rounded-2xl backdrop-blur-sm bg-card/80">
      {status === "idle" && (
        <Button
          size="lg"
          className="w-32 h-32 rounded-full"
          onClick={onStart}
          data-testid="button-start-session"
        >
          <Play className="w-12 h-12" />
        </Button>
      )}
      
      {status === "active" && (
        <>
          <Button
            size="lg"
            variant="outline"
            className="w-24 h-24 rounded-full"
            onClick={onPause}
            data-testid="button-pause-session"
          >
            <Pause className="w-8 h-8" />
          </Button>
          <Button
            size="lg"
            variant="destructive"
            className="w-32 h-32 rounded-full"
            onClick={onStop}
            data-testid="button-stop-session"
          >
            <Square className="w-12 h-12" />
          </Button>
        </>
      )}
      
      {status === "paused" && (
        <>
          <Button
            size="lg"
            className="w-32 h-32 rounded-full"
            onClick={onStart}
            data-testid="button-resume-session"
          >
            <Play className="w-12 h-12" />
          </Button>
          <Button
            size="lg"
            variant="destructive"
            className="w-24 h-24 rounded-full"
            onClick={onStop}
            data-testid="button-stop-paused-session"
          >
            <Square className="w-8 h-8" />
          </Button>
        </>
      )}
      
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2">
        <p className="text-sm text-muted-foreground capitalize">{status}</p>
      </div>
    </div>
  );
}
