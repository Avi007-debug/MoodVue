from flask import Flask
from flask_cors import CORS
from app.analysis_service import analysis_service

def create_app():
    # Create the Flask app instance
    app = Flask(__name__)
    
    # Enable CORS
    CORS(app)

    # Register the blueprint
    from app.routes import api_bp
    app.register_blueprint(api_bp)

    # Start the background processing thread
    # This ensures it starts only once when the app is created
    analysis_service.start_processing()

    return app