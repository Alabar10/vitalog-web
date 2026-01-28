import os
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from routes.auth_routes import auth_bp
from routes.entries_routes import entries_bp
from routes.insights import insights_bp
from extensions import db,migrate
from models import User, Entry


def create_app():
    load_dotenv()
    app = Flask(__name__)
    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "dev_secret")
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    db.init_app(app)
    migrate.init_app(app, db)


    # CORS: allow your Next.js dev port
    CORS(app, resources={r"/*": {"origins": os.getenv("FRONTEND_ORIGIN", "http://localhost:3000")}},
         supports_credentials=True)

    

    # Blueprints
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(entries_bp, url_prefix="/api/entries")
    app.register_blueprint(insights_bp, url_prefix="/api/insights")

    return app



if __name__ == "__main__":
    port = int(os.getenv("PORT", 4000))
    app = create_app()
    app.run(host="0.0.0.0", port=port, debug=True)
