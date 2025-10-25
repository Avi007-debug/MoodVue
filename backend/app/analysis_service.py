import cv2
import threading
import time
import atexit
from deepface import DeepFace
import numpy as np

# Emotion to Stress Score Mapping
STRESS_MAP = {
    "happy": 15,
    "neutral": 25,
    "surprise": 40,
    "sad": 70,
    "fear": 80,
    "angry": 95,
    "disgust": 75
}

class AnalysisService:
    def __init__(self):
        # --- State Variables ---
        self.data_lock = threading.Lock()
        self.last_analysis = {
            "emotion": "neutral",
            "confidence": 0.0,
            "stress_score": 20
        }
        self.history_log = []
        self.last_frame = None

        # --- Camera Initialization ---
        try:
            self.camera = cv2.VideoCapture(0)
            if not self.camera.isOpened():
                raise IOError("Cannot open webcam")
            print("Camera initialized successfully.")
        except Exception as e:
            print(f"Error initializing camera: {e}. Using placeholder.")
            self.camera = None

        # Register cleanup
        atexit.register(self.cleanup)

    def start_processing(self):
        """Starts the background frame processing thread."""
        processor_thread = threading.Thread(target=self._process_frames, daemon=True)
        processor_thread.start()
        print("Background processing thread started.")

    def _process_frames(self):
        """Private method to run in a background thread. Continuously captures and analyzes frames."""
        frame_count = 0
        while True:
            if self.camera is None:
                # Simulate data if no camera
                time.sleep(1)
                simulated_emotion = str(np.random.choice(list(STRESS_MAP.keys())))
                simulated_score = int(STRESS_MAP[simulated_emotion])
                analysis_result = {
                    "emotion": simulated_emotion,
                    "confidence": float(round(np.random.uniform(0.7, 0.99), 2)),
                    "stress_score": simulated_score,
                    "face_detected": True,
                    "region": {'x': 0, 'y': 0, 'w': 0, 'h': 0}
                }
            else:
                success, frame = self.camera.read()
                if not success:
                    print("Failed to read frame.")
                    time.sleep(0.1)
                    continue

                # Store the latest frame
                with self.data_lock:
                    self.last_frame = frame.copy()

                # Analyze every 5th frame (from version 1)
                if frame_count % 30 == 0:
                    try:
                        result = DeepFace.analyze(
                            frame, 
                            actions=['emotion'], 
                            enforce_detection=False,
                            silent=True,
                            detector_backend='ssd'
                        )

                        if isinstance(result, list) and len(result) > 0:
                            all_emotions = result[0]['emotion']
                            dominant_emotion = result[0]['dominant_emotion']
                            face_region = result[0]['region']

                            # --- Neutral override logic (version 1) ---
                            if dominant_emotion == 'neutral' and all_emotions['neutral'] < 80:
                                secondary_emotions = {k: v for k, v in all_emotions.items() if k != 'neutral'}
                                next_highest_emotion = max(secondary_emotions, key=secondary_emotions.get)
                                if next_highest_emotion in ['sad', 'angry', 'fear', 'disgust'] and secondary_emotions[next_highest_emotion] > 20:
                                    dominant_emotion = next_highest_emotion
                            # --- END neutral override ---

                            # --- Weighted stress score (version 2) ---
                            weighted_stress_score = 0
                            for emotion, percentage in all_emotions.items():
                                stress_value = STRESS_MAP.get(emotion, 0)
                                weighted_stress_score += (percentage / 100) * stress_value

                            # Convert numpy values to Python native types
                            analysis_result = {
                                "emotion": str(dominant_emotion),
                                "confidence": float(round(all_emotions[dominant_emotion] / 100, 2)),
                                "stress_score": int(round(weighted_stress_score)),
                                "all_emotions": {k: float(v) for k, v in all_emotions.items()},
                                "face_detected": bool(True),
                                "region": {
                                    'x': int(face_region['x']),
                                    'y': int(face_region['y']),
                                    'w': int(face_region['w']),
                                    'h': int(face_region['h'])
                                }
                            }
                        else:
                            analysis_result = {
                                "emotion": "neutral",
                                "confidence": float(0.0),
                                "stress_score": int(0),
                                "face_detected": bool(False),
                                "region": {'x': 0, 'y': 0, 'w': 0, 'h': 0}
                            }

                    except Exception as e:
                        print(f"!!! DEEPFACE CRASHED: {e}")
                        analysis_result = {
                            "emotion": "error",
                            "confidence": 0.0,
                            "stress_score": -1,
                            "face_detected": False,
                            "region": {'x':0,'y':0,'w':0,'h':0}
                        }

                    # Update global state
                    with self.data_lock:
                        self.last_analysis = analysis_result
                        self.history_log.append(analysis_result)
                        self.history_log = self.history_log[-100:]

                frame_count += 1
                time.sleep(0.01)

    def generate_video_feed(self):
        """Generator for the video feed."""
        while True:
            if self.last_frame is None:
                time.sleep(0.1)
                continue

            with self.data_lock:
                frame = self.last_frame.copy()
                analysis_data = self.last_analysis.copy()

            emotion = analysis_data.get("emotion", "loading...")
            stress = analysis_data.get("stress_score", 0)

            # Draw bounding box if face detected
            if analysis_data.get("face_detected", False):
                try:
                    region = analysis_data['region']
                    x, y, w, h = region['x'], region['y'], region['w'], region['h']
                    cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)
                except Exception as e:
                    print(f"Error drawing rectangle: {e}")

            # Draw info on the frame
            cv2.putText(frame, f"Emotion: {emotion}", (10, 30), 
                        cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2, cv2.LINE_AA)
            cv2.putText(frame, f"Stress: {stress}", (10, 60), 
                        cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2, cv2.LINE_AA)

            flag, encodedImage = cv2.imencode(".jpg", frame)
            if not flag:
                continue

            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + bytearray(encodedImage) + b'\r\n')

    def get_analysis(self):
        """Safely get the last analysis result."""
        with self.data_lock:
            return self.last_analysis

    def get_history(self):
        """Safely get the history log."""
        with self.data_lock:
            return self.history_log

    def cleanup(self):
        """Release camera on exit."""
        if self.camera and self.camera.isOpened():
            self.camera.release()
            print("Camera released.")

# Create a single instance to be shared across the app
analysis_service = AnalysisService()
