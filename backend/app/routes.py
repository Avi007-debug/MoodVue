from flask import Blueprint, Response, jsonify
from app.analysis_service import analysis_service # Import the singleton instance

# Create a Blueprint
api_bp = Blueprint('api', __name__)

@api_bp.route("/")
def index():
    """Home route."""
    return "Backend server for Video Mood & Stress Detection is running."

@api_bp.route("/video_feed")
def video_feed():
    """Streams live video frames."""
    return Response(analysis_service.generate_video_feed(), 
                    mimetype="multipart/x-mixed-replace; boundary=frame")

@api_bp.route("/analyze")
def analyze():
    """Returns current emotion + stress score as JSON."""
    return jsonify(analysis_service.get_analysis())

@api_bp.route("/history")
def history():
    """Returns emotion log for charts."""
    return jsonify(analysis_service.get_history())