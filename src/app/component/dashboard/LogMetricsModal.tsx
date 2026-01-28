"use client";
import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Moon, Smile, Droplets, Flame, Dumbbell } from "lucide-react";
import { EntryApi } from "./ChartCard";
type FocusField = "sleep" | "mood" | "water" | "calories" | "activity" | null;
type LogMetricsModalProps = {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  focusField: FocusField;
};
type FormData = {
  date: string;
  sleep: number | "";
  mood: number | "";
  water: number | "";
  calories: number | "";
};

const LogMetricsModal = ({
  open,
  onClose,
  onSaved,
  focusField,
}: LogMetricsModalProps) => {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [sleep, setSleep] = useState("");
  const [water, setWater] = useState("");
  const [mood, setMood] = useState("");
  const [calories, setCalories] = useState("");
  const [workout_type, setWorkout_type] = useState("");
  const [duration, setDuration] = useState("");
  const [intensity, setIntensity] = useState("");
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState<{
    sleep?: string;
    mood?: string;
    water?: string;
    calories?: string;
    activity?: string;
    form?: string;
  }>({});

  useEffect(() => {
    if (!open) return;
    (async () => {
      try {
        const res = await fetch("http://localhost:4000/api/entries/", {
          credentials: "include",
        });
        if (!res.ok) return;
        const data: EntryApi[] = await res.json();
        if (!data.length) return;
        const today = new Date().toISOString().slice(0, 10);
        const todayEntry = data.find((e) => e.day === today);
        if (todayEntry) {
          setSleep(todayEntry.sleep_hours?.toString() || "");
          setMood(todayEntry.mood_1_10?.toString() || "");
          setWater(todayEntry.water_liters?.toString() || "");
          setCalories(todayEntry.calories?.toString() || "");
          setWorkout_type(todayEntry.workout_type || "");
          setDuration(todayEntry.duration?.toString() || "");
          setIntensity(todayEntry.intensity || "");
          setNote(todayEntry.notes || "");
        } else {
          setSleep("");
          setMood("");
          setWater("");
          setCalories("");
        }
      } catch (error) {
        console.error("Error loading current entry:", error);
      }
    })();
  }, [open]);
  if (!open) return null;
  const handleSave = async () => {
    const newErrors: typeof errors = {};
    const sleepNum = Number(sleep);
    const moodNum = Number(mood);
    const waterNum = Number(water);
    const caloriesNum = Number(calories);
    if (Number.isNaN(sleepNum) || sleepNum < 0 || sleepNum > 24) {
      newErrors.sleep = "Sleep must be between 0–24 hours.";
    }
    if (Number.isNaN(moodNum) || moodNum < 1 || moodNum > 10) {
      newErrors.mood = "Mood must be between 1–10.";
    }
    if (Number.isNaN(waterNum) || waterNum < 0 || waterNum > 10) {
      newErrors.water = "Water must be between 0–10 liters.";
    }
    if (Number.isNaN(caloriesNum) || caloriesNum < 0) {
      newErrors.calories = "Calories must be a positive number.";
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    const payload = {
      day: date,
      sleep_hours: sleepNum,
      mood_1_10: moodNum,
      water_liters: waterNum,
      calories: caloriesNum,
      notes: note || "",
      workout_type,
      duration: duration ? Number(duration) : null,
      intensity: intensity || null,
    };
    try {
      const res = await fetch("http://localhost:4000/api/entries/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        console.error("faild to save entry");
        return;
      }
      const data = await res.json();
      console.log("Created entry:", data);
      onSaved();
      onClose();
    } catch (error) {
      console.error("Error:", error);
    }
  };
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center "
      role="dialog "
    >
      <div className=" absolute inset-0 bg-black/50 " onClick={onClose}></div>
      <div
        className=" relative z-10  w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl "
        onClick={(e) => e.stopPropagation()}
      >
        <h1 className="text-xl font-semibold mb-4 text-black">
          Log Your Daily Metrics
        </h1>
        <div className="">
          <span className="block text-sm font-medium mb-1 text-black">
            Date
          </span>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border border-neutral-300 rounded-xl text-black px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 "
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-2 border border-black p-10 rounded-xl">
          <div className="flex flex-col">
            <label className="text-black flex items-center gap-2 font-medium mb-1">
              <Moon size={16} className="text-indigo-500" /> sleep (hours)
            </label>
            <input
              className={`text-black border border-neutral-700 rounded-xl p-1 
    ${
      focusField === "sleep"
        ? "ring-2 ring-indigo-500 ring-offset-2 ring-offset-white"
        : ""
    }
  `}
              type="number"
              placeholder="7.5"
              step="0.1"
              value={sleep}
              onChange={(e) => setSleep(e.target.value)}
            />
            {errors.sleep && (
              <p className="mt-1 text-xs text-red-500">{errors.sleep}</p>
            )}
          </div>
          <div className="flex flex-col">
            <label className="text-black flex items-center gap-2 font-medium mb-1">
              <Smile size={16} className="text-rose-400" /> mood (1-10)
            </label>
            <input
              className={`text-black border border-neutral-700 rounded-xl p-1 
    ${
      focusField === "mood"
        ? "ring-2 ring-indigo-500 ring-offset-2 ring-offset-white"
        : ""
    }
  `}
              type="number"
              placeholder="8"
              value={mood}
              onChange={(e) => setMood(e.target.value)}
            />
            {errors.mood && (
              <p className="mt-1 text-xs text-red-500">{errors.mood}</p>
            )}
          </div>
          <div className="flex flex-col">
            <label className="text-black flex items-center gap-2 font-medium mb-1">
              <Droplets size={16} className="text-teal-400" />
              water (liters)
            </label>
            <input
              className={`text-black border border-neutral-700 rounded-xl p-1 
    ${
      focusField === "water"
        ? "ring-2 ring-indigo-500 ring-offset-2 ring-offset-white"
        : ""
    }
  `}
              type="number"
              placeholder="2.5"
              step="0.1"
              value={water}
              onChange={(e) => setWater(e.target.value)}
            />
            {errors.water && (
              <p className="mt-1 text-xs text-red-500">{errors.water}</p>
            )}
          </div>
          <div className="flex flex-col">
            <label className="text-black flex items-center gap-2 font-medium mb-1">
              <Flame size={16} className="text-orange-400" />
              Calories
            </label>
            <input
              className={`text-black border border-neutral-700 rounded-xl p-1 
    ${
      focusField === "calories"
        ? "ring-2 ring-indigo-500 ring-offset-2 ring-offset-white"
        : ""
    }
  `}
              type="number"
              placeholder="1800"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
            />
            {errors.calories && (
              <p className="mt-1 text-xs text-red-500">{errors.calories}</p>
            )}
          </div>
        </div>
        <br />
        <div className="flex flex-col p-2 border border-slate-400">
          <h3 className="text-black flex gap-2">
            <Dumbbell size={16} className="text-green-400" />
            Workout (Optional)
          </h3>
          <div className="mt-5 flex justify-between w-full  ">
            <div className="flex flex-col">
              <label className="text-black flex items-center gap-2 font-medium mb-1">
                {" "}
                Type
              </label>
              <input
                className={`text-black border border-neutral-700 rounded-xl p-1 px-5`}
                type="text"
                placeholder="Runing,Gym,Yoga..."
                value={workout_type}
                onChange={(e) => setWorkout_type(e.target.value)}
              />
            </div>
            <div>
              <label className="text-black flex items-center gap-2 font-medium mb-1">
                Duration (min)
              </label>
              <input
                className={`text-black border border-neutral-700 rounded-xl p-1 px-5`}
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="30"
              />
            </div>
          </div>
          <div className=" flex flex-col p-4 mt-2">
            <label className="text text-black font-semibold">Intensity</label>
            <select
              className="flex h-8 w-full border border-slate-400 mt-3 text-black"
              value={intensity}
              onChange={(e) => setIntensity(e.target.value)}
            >
              <option value="">Select intensity</option>
              <option value="light">light</option>
              <option value="moderate">moderate</option>
              <option value="intense">intense</option>
            </select>

            <label className="text-black font-semibold mt-4">Notes</label>
            <input
              type="text"
              className="p-4 border border-slate-500 rounded-xl text-black mt-2"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="How did it feel? Any observations..."
            />
          </div>
        </div>
        <div className="flex w-full mt-2 justify-end gap-2 ">
          <button
            className="border border-neutral-400 rounded-xl font-medium text-black hover:bg-neutral-50 p-2
          "
            type="button"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="border border-slate-500 rounded-2xl bg-indigo-600 font-semibold hover:bg-indigo-500 p-2 flex items-end justify-end "
            type="button"
            onClick={handleSave}
          >
            Save Entry
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogMetricsModal;
