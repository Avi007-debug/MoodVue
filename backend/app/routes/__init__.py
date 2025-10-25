from flask import Blueprint
from app.routes.sessions import sessions_bp
from app.routes.video import video_bp

# Create the main API blueprint
api_bp = Blueprint('api', __name__, url_prefix='/api')

# Register the blueprints
api_bp.register_blueprint(sessions_bp, url_prefix='/sessions')
api_bp.register_blueprint(video_bp)