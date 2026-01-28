"use client";
import React, { useEffect, useState } from "react";
import { Activity, Moon, Droplets, Dumbbell } from "lucide-react";
import { EntryApi } from "./ChartCard";
type InsightsUIProps = {
  avgSleep?: number;
  avgMood?: number;
  avgWater?: number;
  sleepStreak?: number;
  waterGoalDays?: number;
  sleepTarget?: number;
  waterTarget?: number;
  refreshKey: number;
};
const Insights: React.FC<InsightsUIProps> = ({ refreshKey }) => {
  const [avgSleep, setAvgSleep] = useState(0);
  const [avgMood, setAvgMood] = useState(0);
  const [avgWater, setAvgWater] = useState(0);
  const [sleepStreak, setSleepStreak] = useState(0);
  const [waterGoalDays, setWaterGoalDays] = useState(0);
  const [weeklyWorkouts, setWeeklyWorkouts] = useState(0);
  const [weeklyWorkoutMinutes, setWeeklyWorkoutMinutes] = useState(0);

  // normalize date to midnight so time-of-day doesn't matter
  const normalizeDate = (d: Date) => {
    const copy = new Date(d);
    copy.setHours(0, 0, 0, 0);
    return copy;
  };

  // how many whole days between two dates (later - earlier)
  const diffInDays = (later: Date, earlier: Date) => {
    const msPerDay = 24 * 60 * 60 * 1000;
    return (
      (normalizeDate(later).getTime() - normalizeDate(earlier).getTime()) /
      msPerDay
    );
  };

  const sleepTarget = 7;
  const waterTarget = 2;
  useEffect(() => {
    (async () => {
      const res = await fetch("http://localhost:4000/api/entries/", {
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error("Faild to load entries");
      }
      const data: EntryApi[] = await res.json();
      console.log("One entry from API:", data[0]);

      const today = new Date();
      const getStartOfWeekSunday = (date: Date) => {
        const d = new Date(date);
        const day = d.getDay();

        d.setHours(0, 0, 0, 0);
        d.setDate(d.getDate() - day);

        return d;
      };

      const startOfWeek = getStartOfWeekSunday(today);

      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(endOfWeek.getDate() + 7);
      const isInThisWeek = (dayStr: string) => {
        const d = new Date(dayStr);
        return d >= startOfWeek && d < endOfWeek;
      };

      const weekEntries = data.filter((e) => isInThisWeek(e.day));

      const workoutsThisWeek = weekEntries.filter(
        (e) => e.workout_type !== null
      );

      // Count how many workouts
      const workoutCount = workoutsThisWeek.length;

      const totalMinutes = workoutsThisWeek.reduce(
        (sum, e) => sum + (e.duration ?? 0),
        0
      );
      setWeeklyWorkouts(workoutCount);
      setWeeklyWorkoutMinutes(totalMinutes);

      const valid = (vals: (number | null)[]) =>
        vals.filter((v): v is number => v !== null);
      const avg = (arr: number[]) =>
        arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
      setAvgSleep(
        Number(avg(valid(weekEntries.map((e) => e.sleep_hours))).toFixed(1))
      );

      setAvgMood(
        Number(avg(valid(weekEntries.map((e) => e.mood_1_10))).toFixed(1))
      );

      setAvgWater(
        Number(avg(valid(weekEntries.map((e) => e.water_liters))).toFixed(1))
      );

      const sortedWeek = [...weekEntries].sort(
        (a, b) => new Date(a.day).getTime() - new Date(b.day).getTime()
      );
      let streak = 0;
      let lastDate: Date | null = null;

      for (let i = sortedWeek.length - 1; i >= 0; i--) {
        const entry = sortedWeek[i];
        const entryDate = new Date(entry.day);
        const hours = entry.sleep_hours ?? 0;

        // if this day didn't hit the goal → streak stopped
        if (hours < sleepTarget) {
          break;
        }

        if (!lastDate) {
          // first good day from the end → start the streak
          streak = 1;
          lastDate = entryDate;
          continue;
        }

        const gap = diffInDays(lastDate, entryDate); // later - earlier in days

        if (gap === 1) {
          // exactly previous day → streak continues
          streak++;
          lastDate = entryDate;
        } else {
          // gap of 2+ days → user missed at least one day → streak ends
          break;
        }
      }
      setSleepStreak(streak);
      const sortedWater = [...weekEntries].sort(
        (a, b) => new Date(a.day).getTime() - new Date(b.day).getTime()
      );

      let waterStreak = 0;
      let lastWaterDate: Date | null = null;

      for (let i = sortedWater.length - 1; i >= 0; i--) {
        const entry = sortedWater[i];
        const entryDate = new Date(entry.day);
        const liters = entry.water_liters ?? 0;
        if (liters < waterTarget) {
          break;
        }

        if (!lastWaterDate) {
          waterStreak = 1;
          lastWaterDate = entryDate;
          continue;
        }

        const gap = diffInDays(lastWaterDate, entryDate);

        if (gap === 1) {
          waterStreak++;
          lastWaterDate = entryDate;
        } else {
          break;
        }
      }

      setWaterGoalDays(waterStreak);
    })();
  }, [refreshKey]);
  return (
    <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div className="rounded-3xl border border-white/20 bg-white/10 backdrop-blur-xl p-6 text-white">
        <div className="flex items-center gap-3 text-lg font-semibold mb-4">
          <Activity size={18} className="opacity-90" />
          <span>Weekly Average</span>
        </div>
        <div className=" space-y-3 text-white/90">
          <div className="flex items-center justify-between">
            <span className=" opacity-80 ">Sleep:</span>
            <span className=" font-semibold">{avgSleep}h</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="opacity-80">Mood:</span>
            <span className="font-semibold">{avgMood}/10</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="opacity-80">Water:</span>
            <span className="font-semibold">{avgWater}L</span>
          </div>
        </div>
      </div>
      <div className="rounded-3xl border border-white/20 bg-white/10 backdrop-blur-xl p-5 text-white">
        <div className="flex items-center gap-3 text-lg font-semibold mb-4">
          <div className="rounded-xl bg-white/15 p-2">
            <Moon size={18} className="text-green-300" />
          </div>
          <span>
            {" "}
            <span>Sleep Streak</span>
          </span>
        </div>
        <div className="text-center">
          <div className="text-5xl font-extrabold leading-none">
            {sleepStreak}
          </div>
          <div className="mt-2 text-white/85">
            days with {sleepTarget}+ hours
          </div>
        </div>
      </div>
      <div className="rounded-3xl border border-white/20 bg-white/10 backdrop-blur-xl p-5 text-white">
        <div className="flex items-center gap-3 text-lg font-semibold mb-4">
          <div className="rounded-xl bg-white/15 p-2">
            <Droplets size={18} className="text-cyan-300" />
          </div>
          <span>Hydration Goal</span>
        </div>
        <div className="text-center">
          <div className="text-5xl font-extrabold leading-none">
            {waterGoalDays}
          </div>
          <div className="mt-2 text-white/85">
            days with {waterTarget}+ liters
          </div>
        </div>
      </div>
      <div className="rounded-3xl border border-white/20 bg-white/10 backdrop-blur-xl p-5 text-white">
        <div className="flex items-center gap-3 text-lg font-semibold mb-4">
          <div className="rounded-xl bg-white/15 p-2">
            <Dumbbell size={18} className="text-cyan-300" />
          </div>
          <span>this Week's Activity</span>
        </div>
        <div className="text-center">
          <div className="text-5xl font-extrabold leading-none">
            {weeklyWorkouts}
          </div>
          <div className="mt-2 text-white/80 text-lg">workouts</div>
          <div>
            <div className="text-4xl font-extrabold leading-none">
              {weeklyWorkoutMinutes}{" "}
              <span className="text-2xl font-semibold">min</span>
            </div>
            <div className="mt-2 text-white/80">total time</div>
          </div>{" "}
        </div>
      </div>
    </div>
  );
};

export default Insights;
