from flask import Flask
from flask_cors import CORS
from app.analysis_service import analysis_service
from dotenv import load_dotenv

load_dotenv()

def create_app():
    # Create the Flask app instance
    app = Flask(__name__)
    
    # Enable CORS
    CORS(app, resources={
        r"/api/*": {
            "origins": ["http://localhost:5000", "http://localhost:3000","https://mood-vue.vercel.app/","https://mood-vue-gcr2.vercel.app/"],  # Frontend URLs
            "methods": ["GET", "POST", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization", "X-User-Id"],
            "supports_credentials": True
        }
    })

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