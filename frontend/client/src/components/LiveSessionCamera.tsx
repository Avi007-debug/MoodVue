import { useState } from "react";
import { Camera, CameraOff } from "lucide-react";

interface LiveSessionCameraProps {
  isActive?: boolean;
  faceDetected?: boolean;
  onFaceDetected?: (detected: boolean) => void;
}

export default function LiveSessionCamera({ 
  isActive = false, 
  faceDetected = false,
  onFaceDetected 
}: LiveSessionCameraProps) {
  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="aspect-video rounded-2xl overflow-hidden bg-muted relative">
        {isActive ? (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <Camera className="w-16 h-16 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Camera preview would appear here</p>
              </div>
            </div>
            
            {faceDetected && (
              <div className="absolute inset-8 border-2 border-status-online rounded-xl animate-pulse">
                <div className="absolute -top-2 -left-2 w-4 h-4 bg-status-online rounded-full" />
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-status-online rounded-full" />
                <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-status-online rounded-full" />
                <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-status-online rounded-full" />
              </div>
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
            <CameraOff className="w-16 h-16 mb-4 opacity-30" />
            <p className="text-sm">Camera not active</p>
            <p className="text-xs mt-1">Press Start to begin session</p>
          </div>
        )}
      </div>
    </div>
  );
}
