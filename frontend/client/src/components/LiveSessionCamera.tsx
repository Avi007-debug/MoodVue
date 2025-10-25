interface LiveSessionCameraProps {
  isActive?: boolean;
  faceDetected?: boolean;
}

export default function LiveSessionCamera({
  isActive = false,
  faceDetected = false
}: LiveSessionCameraProps) {
  const videoUrl = "http://localhost:5001/api/video_feed";
  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="aspect-video rounded-2xl overflow-hidden bg-muted relative">
        {isActive ? (
          <>
            <img
              alt="Live feed"
              className="w-full h-full object-contain"
              src={videoUrl}
              style={{ 
                maxWidth: '100%',
                maxHeight: '100%',
                margin: 'auto',
                display: 'block'
              }}
            />

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
