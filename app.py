from pathlib import Path
from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
from config import Config
from routes.auth_routes import auth_bp
from routes.destination_routes import destination_bp
from routes.itinerary_routes import itinerary_bp

FRONTEND_DIR = Path(__file__).resolve().parent.parent / "frontend"

def create_app():
    # The backend also serves the frontend, so one container runs the whole website.
    app = Flask(__name__, static_folder=str(FRONTEND_DIR), static_url_path="")
    app.config.from_object(Config)
    CORS(app)
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(destination_bp, url_prefix="/api/destinations")
    app.register_blueprint(itinerary_bp, url_prefix="/api/itinerary")

    @app.get("/api/health")
    def health():
        return jsonify({"status": "ok", "message": "Travel Buddy API is running"})

    @app.get("/")
    def home():
        return send_from_directory(FRONTEND_DIR, "index.html")
    return app

app = create_app()
if __name__ == "__main__":
    app.run(debug=True, host="127.0.0.1", port=5000)