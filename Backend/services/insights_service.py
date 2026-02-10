from models import Entry 
from datetime import date, timedelta
import math

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
    sleep_points=[]
    mood_vals = []
    water_vals = []
    calories_vals = []
    workout_durations = []
    workout_days = 0
    daily_map = {} 
    for e in entries:
        d=e.day
        if d not in daily_map:
                daily_map[d] = {"day": d, "sleep": None, "mood": None, "water": None ,"calories": None, "workout": None}

        if e.sleep_hours is not None:
            sleep_vals.append(e.sleep_hours)
            sleep_points.append((e.day,e.sleep_hours))
            daily_map[d]["sleep"] = e.sleep_hours
        if e.mood_1_10 is not None:
            mood_vals.append(e.mood_1_10)
            daily_map[d]["mood"] = e.mood_1_10
        if e.water_liters is not None:
            water_vals.append(e.water_liters)
            daily_map[d]["water"] = e.water_liters
        if e.calories is not None:
            calories_vals.append(e.calories)
            daily_map[d]["calories"] = e.calories
        if e.workout_type or e.duration:
            workout_days += 1
            if e.duration is not None:
                workout_durations.append(e.duration)
            daily_map[d]["workout"] = e.duration
    # Sleep extrema (guard against no data)
    min_day = max_day = min_hours = max_hours = None
    if sleep_points:
        min_point = min(sleep_points, key=lambda p: p[1])
        max_point = max(sleep_points, key=lambda p: p[1])
        min_day, min_hours = min_point
        max_day, max_hours = max_point

    # Hydration extrema
    min_liters = max_liters = None
    if water_vals:
        min_liters = min(water_vals)
        max_liters = max(water_vals)

    # Nutrition extrema
    min_calories = max_calories = None
    if calories_vals:
        min_calories = min(calories_vals)
        max_calories = max(calories_vals)
    
    daily_stats = list(daily_map.values())
    return{
        "days":days,
        "daily_stats": daily_stats,
        "sleep": {
            "avg_hours": safe_avg(sleep_vals),
            "days_logged": len(sleep_vals),
            "min_day": min_day,
            "max_day": max_day,
            "min_hours": min_hours,
            "max_hours": max_hours,
        },

        "mood": {
            "avg_score": safe_avg(mood_vals),
            "days_logged": len(mood_vals)
        },

        "hydration": {
            "avg_liters": safe_avg(water_vals),
            "days_logged": len(water_vals),
            "min_liters": min_liters,
            "max_liters": max_liters,
        },

        "nutrition": {
            "avg_calories": safe_avg(calories_vals),
            "days_logged": len(calories_vals),
            "min_calories": min_calories,
            "max_calories": max_calories,
        },

        "workout": {
            "days": workout_days,
            "avg_duration_min": safe_avg(workout_durations)
        }
    }
def pearson_corr(xs,ys):
    n=len(xs)
    if n<2:
        return None
    mean_x=sum(xs)/n
    mean_y=sum(ys)/n
    num=0.0
    den_x=0.0
    den_y=0.0
    for x, y in zip(xs, ys):
        dx = x - mean_x
        dy = y - mean_y
        num += dx * dy
        den_x += dx * dx
        den_y += dy * dy

    if den_x == 0 or den_y == 0:
        return None
    return num / math.sqrt(den_x * den_y)

def build_overview_narrative(stats: dict) -> str:
    sleep = stats.get("sleep", {})
    hydration = stats.get("hydration", {})
    mood = stats.get("mood", {})
    workout = stats.get("workout", {})
    sleep_days = sleep.get("days_logged", 0)
    sleep_avg = sleep.get("avg_hours")

    water_avg = hydration.get("avg_liters")
    mood_avg = mood.get("avg_score")
    workout_days = workout.get("days", 0)

    if sleep_days == 0:
        return "No sleep logs yet. Add your first entry to unlock personalized insights."
    

    signals = []

    if sleep_avg is not None:
        if sleep_avg < 6.5:
            signals.append("your sleep has been below your ideal range")
        elif sleep_avg >= 7:
            signals.append("your sleep baseline looks solid")

    if mood_avg is not None:
        if mood_avg < 6:
            signals.append("your mood has been a bit lower than usual")
        else:
            signals.append("your mood looks fairly steady")

    if water_avg is not None and water_avg < 1.5:
        signals.append("hydration may be holding you back")

    if workout_days == 0:
        activity_phrase = "activity has been light recently"
    elif workout_days < 3:
        activity_phrase = "your activity has been moderate"
    else:
        activity_phrase = "you’ve been fairly consistent with activity"

    signals = signals[:2]

    if signals:
        first = "Your recent health data suggests " + " and ".join(signals) + f", while {activity_phrase}."
    else:
        first = f"Your recent health data is starting to form a pattern, and {activity_phrase}."

    if sleep_days < 5:
        second = "Keep logging for a few more days to unlock stronger trends and more accurate insights."
    else:
        second = "Focus on consistent sleep and steady hydration to support energy and mood."

    return first + " " + second

    
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
    min_day=stats.get("sleep",{}).get("min_day")
    max_day=stats.get("sleep",{}).get("max_day")
    min_hours=stats.get("sleep",{}).get("min_hours")
    max_hours=stats.get("sleep",{}).get("max_hours")
    min_liters = stats.get("hydration", {}).get("min_liters")
    max_liters = stats.get("hydration", {}).get("max_liters")
    min_calories = stats.get("nutrition", {}).get("min_calories")
    max_calories = stats.get("nutrition", {}).get("max_calories")
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
        
    # --- Overview (text only) ---
    if sleep_days == 0:
        overview_text = "No wellness logs found yet. Add your first entry to unlock insights."
    else:
        parts = [f"Over the past {stats.get('days', 30)} days, you logged {sleep_days} days of wellness data."]

        if sleep_avg is not None:
            parts.append(f"Average sleep: {sleep_avg}h.")
        if water_avg is not None:
            parts.append(f"Average hydration: {water_avg}L.")
        if mood_avg is not None:
            parts.append(f"Average mood: {mood_avg}/10.")
        if workout_days:
            parts.append(f"Workout days: {workout_days}.")

        if sleep_days < 5:
            parts.append("Log a few more days to get stronger and more accurate trends.")

        overview_text = " ".join(parts)

    patterns_test = build_patterns_and_correlations(stats) if notes else "Here are your latest wellness insights based on your recent logs."
    seen=set()
    cleaned=[]
    for r in recs:
        if r not in seen:
            seen.add(r)
            cleaned.append(r)
            
    overview_narrative = build_overview_narrative(stats)

    # --- Sleep narrative (text only) ---
    if sleep_days == 0:
        sleep_text = (
            "No sleep data logged yet. "
            "Add a few nights to unlock personalized sleep insights."
        )
    else:
        sleep_text = (
            f"Your sleep ranged from {min_hours} to {max_hours} hours, "
            f"averaging {sleep_avg} hours."
        )

        if sleep_avg is not None and sleep_avg < 6.5:
            sleep_text += " This is below the recommended range and may affect recovery and focus."
        elif max_hours is not None and max_hours >= 8:
            sleep_text += " You reached strong sleep nights, which supports recovery and energy."

        if sleep_days < 5:
            sleep_text += " Log a few more nights to get more reliable sleep patterns."

    # --- Hydration narrative (text only) ---
    if water_days == 0:
        hydration_text = (
            "No hydration data logged yet. "
            "Add your daily water intake to unlock hydration insights."
        )
    else:
        # Build a more descriptive narrative similar to the design copy
        details = []
        if min_liters is not None and max_liters is not None and min_liters != max_liters:
            details.append(
                f"Your water intake has varied, ranging from about {min_liters}L on lower days "
                f"up to {max_liters}L on higher days."
            )
        elif water_avg is not None:
            details.append(f"Your water intake has been fairly consistent around {water_avg}L per day.")

        if water_avg is not None:
            if water_avg < 1.5:
                details.append(
                    "On days with lower intake, energy and focus may dip, especially when sleep is also short."
                )
            elif water_avg >= 2.0:
                details.append(
                    "Higher hydration days likely support better mood, focus, and recovery."
                )

        if water_days < 5:
            details.append("Log hydration for a few more days to surface clearer patterns and correlations.")

        hydration_text = " ".join(details) if details else (
            "Your water intake shows some variability across days. "
            "Stay close to your higher-intake days to support mood and energy."
        )

    # --- Mood narrative (text only) ---
    if mood_days == 0:
        mood_text = (
            "No mood check-ins logged yet. "
            "Start logging a quick 1–10 mood rating each day to see how sleep, hydration, and activity shape how you feel."
        )
    else:
        mood_fragments = []

        if mood_avg is not None:
            mood_fragments.append(f"Your average mood over this period is {mood_avg}/10.")

            if mood_avg < 5:
                mood_fragments.append(
                    "This points to a generally low mood baseline, which can be influenced by short sleep, low hydration, or stress."
                )
            elif 5 <= mood_avg < 7:
                mood_fragments.append(
                    "Your mood has been in a mid-range zone, with room to lift your best days by reinforcing good habits."
                )
            elif mood_avg >= 7:
                mood_fragments.append(
                    "This reflects a generally positive mood baseline, especially on days when your core habits line up well."
                )

        if sleep_avg is not None and mood_avg is not None:
            if sleep_avg < 6.5 and mood_avg < 7:
                mood_fragments.append(
                    "Shorter sleep together with a lower mood average suggests that improving sleep length and consistency could noticeably improve how you feel."
                )
            elif sleep_avg >= 7 and mood_avg >= 7:
                mood_fragments.append(
                    "Consistent, sufficient sleep likely supports your better mood days — keep protecting your sleep routine."
                )

        if mood_days < 5:
            mood_fragments.append(
                "Log mood for a few more days to reveal clearer emotional patterns and identify what supports your best days."
            )

        mood_text = " ".join(mood_fragments) if mood_fragments else (
            "Your mood scores show some variation across days. "
            "Continue checking in to better understand what drives your higher and lower days."
        )

    # --- Nutrition narrative (text only) ---
    if calories_days == 0:
        nutrition_text = (
            "No nutrition logs yet. "
            "Track your daily calories to understand how fueling patterns relate to energy, mood, and recovery."
        )
    else:
        fragments = []
        if min_calories is not None and max_calories is not None and min_calories != max_calories:
            fragments.append(
                f"Your caloric intake shows a wide range, from about {min_calories} to {max_calories} calories per day."
            )
        if calories_avg is not None:
            fragments.append(f"On average, you’re around {calories_avg} calories daily.")

            # Broad, user-agnostic ranges just to shape the narrative
            if calories_avg < 1500:
                fragments.append(
                    "This may be on the lower side for many adults and can be linked with lower energy or slower recovery."
                )
            elif calories_avg > 2800:
                fragments.append(
                    "This is on the higher side and may contribute to surplus energy intake if it exceeds your activity needs."
                )

        if calories_days < 5:
            fragments.append(
                "Logging nutrition for a few more days will help reveal how intake patterns align with your best sleep and mood days."
            )

        nutrition_text = " ".join(fragments) if fragments else (
            "Your caloric intake varies across days. "
            "Aim for a more consistent range that matches your activity level and goals."
        )

    return{
        "overview_text": overview_text,
        "overview_narrative": overview_narrative,
        "patterns_text": patterns_test,
        "recommendations": cleaned[:5],
        "sleep_text": sleep_text,
        "hydration_text": hydration_text,
        "mood_text": mood_text,
        "nutrition_text": nutrition_text
    }
    
def build_patterns_and_correlations(stats: dict) -> str:
    daily = stats.get("daily_stats", [])
    if not daily:
        return "Not enough daily data yet to detect patterns. Keep logging sleep, mood, and hydration."

    sleep_mood_x, sleep_mood_y = [], []
    water_mood_x, water_mood_y = [], []
    sleep_calories_x, sleep_calories_y = [], []
    water_calories_x, water_calories_y = [], []
    sleep_workout_x, sleep_workout_y = [], []
    water_workout_x, water_workout_y = [], []
    calories_workout_x, calories_workout_y = [], []
    
    mood_missing = 0
    water_missing = 0
    calories_missing = 0
    workout_missing = 0
    for row in daily:
        s = row.get("sleep")
        m = row.get("mood")
        w = row.get("water")    
        c = row.get("calories")
        t = row.get("workout_minutes")  

        if m is None:
            mood_missing += 1
        if w is None:
            water_missing += 1
        if c is None:
            calories_missing += 1
        if t is None:
            workout_missing += 1    
        if s is not None and m is not None:
            sleep_mood_x.append(float(s))
            sleep_mood_y.append(float(m))
            
        if s is not None and c is not None:
            sleep_calories_x.append(float(s))
            sleep_calories_y.append(float(c))
       
        if w is not None and c is not None:
            water_calories_x.append(float(w))
            water_calories_y.append(float(c))
        if w is not None and m is not None:
            water_mood_x.append(float(w))
            water_mood_y.append(float(m))

        if w is not None and t is not None:
            water_workout_x.append(float(w))
            water_workout_y.append(float(t))

        if c is not None and t is not None:
            calories_workout_x.append(float(c))
            calories_workout_y.append(float(t))

        if s is not None and t is not None:
            sleep_workout_x.append(float(s))
            sleep_workout_y.append(float(t))

    

    r_sleep_mood = pearson_corr(sleep_mood_x, sleep_mood_y) if len(sleep_mood_x) >= 5 else None
    r_water_mood = pearson_corr(water_mood_x, water_mood_y) if len(water_mood_x) >= 5 else None
    r_sleep_calories = pearson_corr(sleep_calories_x, sleep_calories_y) if len(sleep_calories_x) >= 5 else None
    r_water_calories = pearson_corr(water_calories_x, water_calories_y) if len(water_calories_x) >= 5 else None
    r_sleep_workout = pearson_corr(sleep_workout_x, sleep_workout_y) if len(sleep_workout_x) >= 5 else None
    r_water_workout = pearson_corr(water_workout_x, water_workout_y) if len(water_workout_x) >= 5 else None
    r_calories_workout = pearson_corr(calories_workout_x, calories_workout_y) if len(calories_workout_x) >= 5 else None

    def strength_label(r: float):
        ar = abs(r)
        if ar >= 0.35:
            return "clear"
        if ar >= 0.20:
            return "some"
        return None

    sentences = []
    
    if r_sleep_calories is not None:
        label = strength_label(r_sleep_calories)
        if label and r_sleep_calories > 0:
            if label == "clear":
                sentences.append("There is a clear correlation between adequate sleep and higher calorie intake in your logs.")
            else:
                sentences.append("There are some signs that higher sleep aligns with better calorie intake.")
        elif label and r_sleep_calories < 0:
            if label == "clear":
                sentences.append("There is a clear inverse pattern: lower sleep tends to align with higher calorie intake in your logs.")
            else:
                sentences.append("There are some signs that sleep and calorie intake move in opposite directions in your logs.")

    if r_water_calories is not None:
        label = strength_label(r_water_calories)
        if label and r_water_calories > 0:
            if label == "clear":
                sentences.append("There is a clear correlation between adequate hydration and improved calorie intake.")
            else:
                sentences.append("There are some signs that higher hydration aligns with better calorie intake.")
        elif label and r_water_calories < 0:
            if label == "clear":
                sentences.append("There is a clear inverse pattern: lower hydration tends to align with higher calorie intake in your logs.")
            else:
                sentences.append("There are some signs that hydration and calorie intake move in opposite directions in your logs.")

    
    if r_sleep_workout is not None:
        label = strength_label(r_sleep_workout)
        if label and r_sleep_workout > 0:
            if label == "clear":
                sentences.append("There is a clear correlation between adequate sleep and improved activity levels.")
            else:
                sentences.append("There are some signs that higher sleep aligns with better activity levels.")
        elif label and r_sleep_workout < 0:
            if label == "clear":
                sentences.append("There is a clear inverse pattern: lower sleep tends to align with higher activity levels in your logs.")
            else:
                sentences.append("There are some signs that sleep and activity move in opposite directions in your logs.")

    if r_water_workout is not None:
        label = strength_label(r_water_workout)
        if label and r_water_workout > 0:
            if label == "clear":
                sentences.append("There is a clear correlation between adequate hydration and improved activity levels.")
            else:
                sentences.append("There are some signs that higher hydration aligns with better activity levels.")
        elif label and r_water_workout < 0:
            if label == "clear":
                sentences.append("There is a clear inverse pattern: lower hydration tends to align with higher activity levels in your logs.")
            else:
                sentences.append("There are some signs that hydration and activity move in opposite directions in your logs.")

    if r_calories_workout is not None:
        label = strength_label(r_calories_workout)
        if label and r_calories_workout > 0:
            if label == "clear":
                sentences.append("There is a clear correlation between adequate calorie intake and improved activity levels.")
            else:
                sentences.append("There are some signs that higher calorie intake aligns with better activity levels.")
        elif label and r_calories_workout < 0:
            if label == "clear":
                sentences.append("There is a clear inverse pattern: lower calorie intake tends to align with higher activity levels in your logs.")
            else:
                sentences.append("There are some signs that calorie intake and activity move in opposite directions in your logs.")

    if r_sleep_mood is not None:
        label = strength_label(r_sleep_mood)
        if label and r_sleep_mood > 0:
            if label == "clear":
                sentences.append("There is a clear correlation between adequate sleep and improved mood scores.")
            else:
                sentences.append("There are some signs that higher sleep aligns with better mood scores.")
        elif label and r_sleep_mood < 0:
            if label == "clear":
                sentences.append("There is a clear inverse pattern: lower sleep tends to align with higher mood scores in your logs.")
            else:
                sentences.append("There are some signs that sleep and mood move in opposite directions in your logs.")


    if r_water_mood is not None:
        label = strength_label(r_water_mood)
        if label and r_water_mood > 0:
            if label == "clear":
                sentences.append("Higher hydration days also tend to align with better mood ratings.")
            else:
                sentences.append("Hydration may play a role in supporting better mood days.")
        elif label and r_water_mood < 0:
            if label == "clear":
                sentences.append("Higher hydration days tend to align with lower mood ratings in your logs.")
            else:
                sentences.append("Hydration and mood may move in opposite directions in your recent logs.")

    total_days = len(daily)
    if total_days >= 5:
        if water_missing > total_days * 0.40:
            sentences.append("Hydration logs have been sporadic, which may hide clearer patterns.")
        if mood_missing > total_days * 0.40:
            sentences.append("Some mood days are unrecorded, so trends may be understated.")
        if calories_missing > total_days * 0.40:
            sentences.append("Calories logs have been sporadic, which may hide clearer patterns.")
        if workout_missing > total_days * 0.40:
            sentences.append("Workout logs have been sporadic, which may hide clearer patterns.")

    if not sentences:
        return (
            "No strong correlations detected yet. "
            "Keep logging consistently to surface clearer patterns between sleep, hydration, and mood."
        )
    return " ".join(sentences)
    
    
