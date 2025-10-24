import { useState } from 'react';
import SessionControls from '../SessionControls';

export default function SessionControlsExample() {
  const [status, setStatus] = useState<"idle" | "active" | "paused">("idle");

  return (
    <div className="p-12 relative">
      <SessionControls 
        status={status}
        onStart={() => setStatus(status === "idle" ? "active" : "active")}
        onPause={() => setStatus("paused")}
        onStop={() => setStatus("idle")}
      />
    </div>
  );
}
