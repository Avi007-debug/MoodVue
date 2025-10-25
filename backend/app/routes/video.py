from flask import Blueprint, Response, jsonify
from app.analysis_service import analysis_service

video_bp = Blueprint('video', __name__)

@video_bp.route('/video_feed')
def video_feed():
    """Video streaming route."""
    return Response(
        analysis_service.generate_video_feed(),
        mimetype='multipart/x-mixed-replace; boundary=frame'
    )

@video_bp.route('/analyze', methods=['GET'])
def analyze():
    """Get current analysis results."""
    return jsonify(analysis_service.get_analysis())