from models import Entry 
from datetime import date, timedelta

def safe_avg(values):
    if not values:
        return None
    return round(sum(values)/len(values),2)

def compute_last_days_stats(user_id:int,days:int=30)->dict:
    start_day=date.today()-timedelta(days=days-1)
    entries=(
        Entry.query.filter(
            Entry.user_id==user_id,
            Entry.day>=start_day
        )
        .all()
    )
    sleep_vals = []
    mood_vals = []
    water_vals = []
    calories_vals = []
    workout_durations = []
    workout_days = 0
    for e in entries:
        if e.sleep_hours is not None:
            sleep_vals.append(e.sleep_hours)
        if e.mood_1_10 is not None:
            mood_vals.append(e.mood_1_10)

        if e.water_liters is not None:
            water_vals.append(e.water_liters)

        if e.calories is not None:
            calories_vals.append(e.calories)
        if e.workout_type or e.duration:
            workout_days += 1
            if e.duration is not None:
                workout_durations.append(e.duration)    
                
    return{
        "days":days,
        "sleep": {
            "avg_hours": safe_avg(sleep_vals),
            "days_logged": len(sleep_vals)
        },

        "mood": {
            "avg_score": safe_avg(mood_vals),
            "days_logged": len(mood_vals)
        },

        "hydration": {
            "avg_liters": safe_avg(water_vals),
            "days_logged": len(water_vals)
        },

        "nutrition": {
            "avg_calories": safe_avg(calories_vals),
            "days_logged": len(calories_vals)
        },

        "workout": {
            "days": workout_days,
            "avg_duration_min": safe_avg(workout_durations)
        }
    }
    
def generate_insights_from_stats(stats:dict)->dict:
    notes=[]
    recs=[]
    sleep_avg=stats.get("sleep",{}).get("avg_hours")
    sleep_days = stats.get("sleep", {}).get("days_logged", 0)
    mood_avg = stats.get("mood", {}).get("avg_score")
    mood_days = stats.get("mood", {}).get("days_logged", 0)
    water_avg = stats.get("hydration", {}).get("avg_liters")
    water_days = stats.get("hydration", {}).get("days_logged", 0)
    calories_avg = stats.get("nutrition", {}).get("avg_calories")
    calories_days = stats.get("nutrition", {}).get("days_logged", 0)
    workout_days = stats.get("workout", {}).get("days", 0)
    workout_avg_dur = stats.get("workout", {}).get("avg_duration_min")
    total_logged_days = sleep_days
    if total_logged_days<5:
        notes.append(f"Insights are based on only {total_logged_days} logged days(s).")
        recs.append("Log at least 5 days to unlock stronger trends and more accurate insights.")
    if sleep_avg is not None:
        if sleep_avg < 6.5:
            notes.append(f"Average sleep is {sleep_avg}h, which is below 6.5h.")
            recs.append("Try to reach 7–8 hours by keeping a consistent sleep and wake time.")
        elif sleep_avg >= 7:
            notes.append(f"Average sleep is {sleep_avg}h — a strong baseline.")
    if water_avg is not None:
        if water_avg < 1.5:
            notes.append(f"Average hydration is {water_avg}L, which may be low.")
            recs.append("Add 1 extra glass of water in the morning and another in the afternoon.")
        elif water_avg >= 2.0:
            notes.append(f"Average hydration is {water_avg}L — great consistency.")
    if workout_days == 0:
        recs.append("Start small: 2×10 minutes of movement this week (walk, stretch, or light workout).")
    elif workout_days >= 3:
        recs.append("Great activity consistency — consider adding one recovery / mobility session.")
    patterns_test=" ".join(notes[:2]) if notes else "Here are your latest wellness insights based on your recent logs."
    seen=set()
    cleaned=[]
    for r in recs:
        if r not in seen:
            seen.add(r)
            cleaned.append(r)
            
    return{
        "patterns_text": patterns_test,
        "recommendations": cleaned[:5]
    }
    
