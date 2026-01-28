from flask import Blueprint,jsonify, request
from services.insights_service import compute_last_days_stats,generate_insights_from_stats
from routes.auth_routes import require_auth
insights_bp = Blueprint("insights", __name__)

@insights_bp.route("/", methods=["GET"])
@require_auth
def get_insights(user_id):
    stats=compute_last_days_stats(user_id=user_id)
    insights=generate_insights_from_stats(stats)
    return jsonify({
        "stats":stats,
        "patterns_text": "...",
        "recommendations": ["...", "..."],
        "signals": [...]
    })