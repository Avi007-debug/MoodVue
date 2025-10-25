from flask import Blueprint, jsonify
from app.analysis_service import analysis_service

# Create a Blueprint with url_prefix
api_bp = Blueprint('api', __name__, url_prefix='/api')

@api_bp.route("/")
def index():
    """Home route."""
    return "MoodVue Backend API is running."