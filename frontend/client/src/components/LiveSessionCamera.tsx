import { useEffect, useRef, useState } from 'react';

interface LiveSessionCameraProps {
  isActive?: boolean;
  faceDetected?: boolean;
}

export default function LiveSessionCamera({
  isActive = false,
  faceDetected = false
}: LiveSessionCameraProps) {
  const videoUrl = "http://localhost:5001/api/video_feed";
  const imgRef = useRef<HTMLImageElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isActive && imgRef.current) {
      // Force reload the image when session becomes active
      const timestamp = new Date().getTime();
      imgRef.current.src = `${videoUrl}?t=${timestamp}`;
      
      // Add error handling and retry logic
      const retryInterval = setInterval(() => {
        if (isLoading) {
          const newTimestamp = new Date().getTime();
          imgRef.current?.setAttribute('src', `${videoUrl}?t=${newTimestamp}`);
        }
      }, 2000); // Retry every 2 seconds if loading fails

      return () => {
        clearInterval(retryInterval);
      };
    }
  }, [isActive, videoUrl, isLoading]);

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="aspect-video rounded-2xl overflow-hidden bg-muted relative">
        {isActive ? (
          <>
            <img
              ref={imgRef}
              alt="Live feed"
              className="w-full h-full object-contain"
              src={videoUrl}
              style={{ 
                maxWidth: '100%',
                maxHeight: '100%',
                margin: 'auto',
                display: 'block'
              }}
              onLoad={() => setIsLoading(false)}
              onError={(e) => {
                console.error('Error loading video feed:', e);
                setIsLoading(true);
              }}
            />
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            )}

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
            <p className="text-sm">Camera not active. Press Start to begin session.</p>
          </div>
        )}
      </div>
    </div>
  );
}
