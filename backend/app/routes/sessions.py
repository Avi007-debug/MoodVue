from flask import Blueprint, jsonify, request, Response
from uuid import UUID
from app.analysis_service import analysis_service

sessions_bp = Blueprint('sessions', __name__)

@sessions_bp.route('/start', methods=['POST'])
async def start_session():
    """Start a new session for the current user."""
    try:
        if not request.is_json:
            print("Error: Request is not JSON")
            return jsonify({"error": "Request must be JSON"}), 400

        json_data = request.get_json()
        if not json_data:
            print("Error: No JSON data in request")
            return jsonify({"error": "No data provided"}), 400

        user_id = json_data.get('user_id')
        if not user_id:
            print("Error: No user_id in request")
            return jsonify({"error": "user_id is required"}), 400

        try:
            user_uuid = UUID(user_id)
        except ValueError as e:
            print(f"Error: Invalid UUID format - {user_id}")
            return jsonify({"error": "Invalid user_id format"}), 400

        print(f"Starting session for user: {user_uuid}")
        session = await analysis_service.start_session(user_uuid)
        if not session:
            print("Error: Failed to create session")
            return jsonify({"error": "Failed to create session"}), 500

        print(f"Session created successfully: {session}")
        return jsonify(session), 201
    except Exception as e:
        print(f"Unexpected error in start_session: {str(e)}")
        return jsonify({"error": str(e)}), 400

@sessions_bp.route('/end', methods=['POST'])
async def end_session():
    """End the current session."""
    try:
        session = await analysis_service.end_session()
        return jsonify(session), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@sessions_bp.route('/user/<user_id>/sessions', methods=['GET', 'OPTIONS'])
async def get_user_sessions(user_id):
    """Get all sessions for a user."""
    try:
        days = int(request.args.get('days', 7))
        sessions = await analysis_service.get_user_sessions(UUID(user_id), days)
        return jsonify(sessions), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@sessions_bp.route('/session/<session_id>/stats', methods=['GET'])
async def get_session_stats(session_id):
    """Get statistics for a specific session."""
    try:
        stats = await analysis_service.get_session_stats(UUID(session_id))
        return jsonify(stats), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@sessions_bp.route('/session/<session_id>/emotions', methods=['GET'])
async def get_session_emotions(session_id):
    """Get all emotion records for a session."""
    try:
        emotions = await analysis_service.get_session_emotions(UUID(session_id))
        return jsonify(emotions), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@sessions_bp.route("", methods=['GET'])
async def get_sessions():
    """Returns user's session statistics."""
    # This assumes user_id is passed via a secure method like a JWT and extracted
    # in a decorator, which seems to be missing from the provided context.
    # For now, we'll retrieve it from headers as in the old routes.py.
    user_id = request.headers.get('X-User-Id')
    if not user_id or user_id in ('null', 'undefined', ''):
        return jsonify({"error": "User ID is required"}), 401
    try:
        user_uuid = UUID(user_id)
    except ValueError:
        return jsonify({"error": "Invalid user ID format"}), 400
    try:
        days = int(request.args.get('days', 7))
        sessions = await analysis_service.get_user_sessions(user_uuid, days)
        return jsonify(sessions), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@sessions_bp.route('/video_feed')
def video_feed():
    """Video streaming route."""
    return Response(
        analysis_service.generate_video_feed(),
        mimetype='multipart/x-mixed-replace; boundary=frame'
    )