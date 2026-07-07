"""
ResearchMate – Multi-Paper Analyzer
Backend Flask Application Entry Point

This file is responsible ONLY for:
1. Initializing the Flask application.
2. Loading environment variables.
3. Enabling Cross-Origin Resource Sharing (CORS).
4. Registering routing Blueprints.

Author: Senior Software Architecture Engineer
Date: July 2026
"""

import os
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# Import routing blueprints
from routes import api_blueprint

def create_app() -> Flask:
    """
    Application factory pattern to initialize and configure the Flask app.
    """
    # Load environment variables from .env file
    load_dotenv()

    # Initialize Flask app
    app = Flask(__name__)

    # Configure maximum upload payload size to 15MB to prevent memory bloat
    app.config['MAX_CONTENT_LENGTH'] = 15 * 1024 * 1024

    # Enable CORS for cross-origin frontend communication
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # Register blueprints
    app.register_blueprint(api_blueprint, url_prefix='/api')

    # Global error handler for 413 Payload Too Large
    @app.errorhandler(413)
    def payload_too_large(error):
        return jsonify({
            "success": False,
            "message": "File size exceeds the 15MB upload limit limit."
        }), 413

    # Global 404 handler
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({
            "success": False,
            "message": "The requested resource was not found on this server."
        }), 404

    # Global 500 handler
    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({
            "success": False,
            "message": "An internal server error occurred. Please try again later."
        }), 500

    return app

# Main entry point for local execution or WSGI server
app = create_app()

if __name__ == "__main__":
    # Retrieve port and host configuration from environment or default to local development standard
    host = os.getenv("FLASK_RUN_HOST", "0.0.0.0")
    port = int(os.getenv("FLASK_RUN_PORT", 5000))
    debug = os.getenv("FLASK_DEBUG", "True").lower() in ("true", "1", "t", "y", "yes")

    print(f" * Starting ResearchMate Flask Backend on http://{host}:{port}")
    app.run(host=host, port=port, debug=debug)
