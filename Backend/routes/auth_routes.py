from flask import Blueprint, request, jsonify, current_app
from werkzeug.security import generate_password_hash, check_password_hash
import jwt, datetime
from models import User
from extensions import db
from sqlalchemy.exc import IntegrityError

auth_bp = Blueprint("auth", __name__)
ALG = "HS256"


def sign(user_id, email):
    payload = {
        "sub": str(user_id),
        "email": email,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(days=7),
    }
    return jwt.encode(payload, current_app.config["SECRET_KEY"], algorithm=ALG)

@auth_bp.post("/register")
def register():
    data=request.get_json() or {}
    username=(data.get("username")or "").strip()
    email=(data.get("email")or "").strip().lower()
    password = data.get("password") or ""

    if not username or not email or not password:
        return jsonify(error="missing fields"),400
    if User.query.filter_by(email=email).first():
        return jsonify(error="email in use"),409
    u=User(username=username,email=email,
           password_hash=generate_password_hash(password))
    db.session.add(u)
    try:
        db.session.commit()
    except IntegrityError:
            db.session.rollback()
            return jsonify(error="email in use"), 409
    token = sign(u.id, u.email)
    return jsonify(user={"id":u.id,"username":u.username,"email":u.email},
                   token=token),201    

@auth_bp.post("/signin")
def signin():
    data= request.get_json() or {}
    email=(data.get("email") or "").strip().lower()
    password=data.get("password") or ""
    if not email or not password:
        return jsonify(error="Invalid username or password"),400
    
    user=User.query.filter_by(email=email).first()
    if not user:
        return jsonify(error="invalid credentials"),401
    if not check_password_hash(user.password_hash, password):
        return jsonify(error="invlid credentials"),401
    token=sign(user.id,user.email)
    return jsonify(token=token, user={"id":user.id,"email":user.email})
    


