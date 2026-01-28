from flask import Blueprint, request, jsonify, current_app
import jwt
from datetime import date, datetime
from extensions import db
from models import Entry 
from routes.auth_routes import require_auth
entries_bp = Blueprint("entries", __name__)
ALG = "HS256"


def parse_date(s, default=None):
    if not s:
        return default
    try:
        return datetime.fromisoformat(s).date()
    except Exception:
        return default


@entries_bp.post("/")
@require_auth
def create_entry(user_id):
    data=request.get_json() or{}

    day = parse_date(data.get("day"), date.today())
    existing=Entry.query.filter_by(user_id=user_id,day=day).first()
    if existing:
        existing.sleep_hours = data.get("sleep_hours")
        existing.mood_1_10 = data.get("mood_1_10")
        existing.water_liters = data.get("water_liters")
        existing.calories = data.get("calories")
        existing.notes = data.get("notes")
        existing.workout_type = data.get("workout_type")
        existing.duration = data.get("duration")
        existing.intensity = data.get("intensity")       
        db.session.commit()
        return jsonify({"message": "Entry updated"}), 200
    else:    
        new_entry=Entry(
            user_id=user_id,
            day=day,
            sleep_hours=data.get("sleep_hours"),
            mood_1_10 =data.get("mood_1_10"),
            water_liters=data.get("water_liters"),
            calories=data.get("calories"),
            notes=data.get("notes"),
            workout_type=data.get("workout_type"),
            duration=data.get("duration"),
            intensity=data.get("intensity"),
        )
        db.session.add(new_entry)
        db.session.commit()
        return jsonify({"message":"Entry created","id":new_entry.id}),201

@entries_bp.get("/")
@require_auth
def get_entries(user_id):
    entries=(
        Entry.query
        .filter_by(user_id=user_id)
        .order_by(Entry.day.desc(),Entry.id.desc())
        .all()
    )
    result = [
        {
            "id": e.id,
            "day": e.day.isoformat() if e.day else None,
            "mood_1_10": e.mood_1_10,
            "sleep_hours": e.sleep_hours,
            "water_liters":e.water_liters,
            "calories": e.calories,
            "workout_type":e.workout_type,
            "duration":e.duration,
            "intensity":e.intensity,
            "notes": e.notes,
        }
        for e in entries
    ]
    return jsonify(result)
    
  
