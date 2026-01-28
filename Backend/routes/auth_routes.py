from flask import Blueprint, request, jsonify, current_app,make_response
from werkzeug.security import generate_password_hash, check_password_hash
import jwt, datetime
from models import User,Entry
from extensions import db
from sqlalchemy.exc import IntegrityError
from functools import wraps

auth_bp = Blueprint("auth", __name__)
ALG = "HS256"

def _set_auth_cookie(resp, token: str):
    resp.set_cookie(
        "access_token", token,
        httponly=True,
        samesite="Strict",
        secure=False,   
        path="/",
        max_age=7*24*3600
    )
    return resp

def _clear_auth_cookie(resp):
    resp.delete_cookie("access_token", path="/")
    return resp

def require_auth(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        token = request.cookies.get("access_token")
        if not token:
            auth = request.headers.get("Authorization", "")
            if auth.startswith("Bearer "):
                token = auth.split(" ", 1)[1]

        if not token:
            return jsonify(error="unauthorized"), 401

        try:
            payload = jwt.decode(token, current_app.config["SECRET_KEY"], algorithms=[ALG])
            user_id = int(payload["sub"])
        except jwt.ExpiredSignatureError:
            return jsonify(error="token expired"), 401
        except jwt.InvalidTokenError:
            return jsonify(error="invalid token"), 401
        except Exception:
            return jsonify(error="unauthorized"), 401

        return f(user_id, *args, **kwargs)
    return wrapper


@auth_bp.get("/me")
@require_auth
def me(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify(error="User not found"), 404
    return jsonify(user={"id": user.id, "username": user.username, "email": user.email})




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
    resp = make_response(jsonify(
        user={"id": u.id, "username": u.username, "email": u.email}
    ), 201)
    return _set_auth_cookie(resp, token) 

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
    resp = make_response(jsonify(
            user={"id": user.id, "username": user.username, "email": user.email}
        ), 200)
    return _set_auth_cookie(resp, token)    

@auth_bp.post("/logout")
def logout():
    resp=make_response(jsonify(message="logged out"),200)
    return _clear_auth_cookie(resp)


