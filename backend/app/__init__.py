from flask import Flask
from flask_cors import CORS
from app.analysis_service import analysis_service
from dotenv import load_dotenv

load_dotenv()

def create_app():
    # Create the Flask app instance
    app = Flask(__name__)
    
    # Enable CORS
    CORS(app, supports_credentials=True) # Allow frontend to send credentials

    # Register the blueprint
    from app.routes import api_bp
    app.register_blueprint(api_bp)

    # Register the new auth blueprint
    from app.auth import auth_bp
    app.register_blueprint(auth_bp, url_prefix='/api')

    # Start the background processing thread
    # This ensures it starts only once when the app is created
    analysis_service.start_processing()

    return app