import { useState } from 'react';
import LiveSessionCamera from '../LiveSessionCamera';
import { Button } from '@/components/ui/button';

export default function LiveSessionCameraExample() {
  const [isActive, setIsActive] = useState(true);
  const [faceDetected, setFaceDetected] = useState(true);

  return (
    <div className="p-6 space-y-4">
      <LiveSessionCamera 
        isActive={isActive} 
        faceDetected={faceDetected}
        onFaceDetected={setFaceDetected}
      />
      <div className="flex gap-2 justify-center">
        <Button onClick={() => setIsActive(!isActive)}>
          Toggle Camera
        </Button>
        <Button variant="outline" onClick={() => setFaceDetected(!faceDetected)}>
          Toggle Face Detection
        </Button>
      </div>
    </div>
  );
}
