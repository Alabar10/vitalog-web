from extensions import db
from datetime import date, datetime

class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)            
    username = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    
class Entry(db.Model):
    __tablename__="entries"
    id = db.Column(db.Integer, primary_key=True)            
    user_id=db.Column(db.Integer,db.ForeignKey("users.id"),nullable=False)
    day=db.Column(db.Date,nullable=False, index=True)
    sleep_hours  = db.Column(db.Float)
    mood_1_10    = db.Column(db.Integer)
    water_liters = db.Column(db.Float)
    calories     = db.Column(db.Integer)
    workout_type         =db.Column(db.Text)
    duration         =db.Column(db.Integer)
    intensity         =db.Column(db.Text)
    notes        = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    __table_args__=(
        db.UniqueConstraint("user_id","day",name="uq_entry_user_day"),
    )
    user=db.relationship("User",backref=db.backref("entries",cascade="all,delete-orphan"))

    


        
