"use client";
import React, { useEffect, useState } from "react";
import { EntryApi } from "../dashboard/ChartCard";
import GlassStats from "./GlassStats";
type User = { id: number; username: string; email: string } | null;
export type GlassStatsProps = {
  sleep: string;
  mood: string;
  water: string;
  calories: string;
  bars: number[];
};

const GlassStatsForUser = () => {
  const [user, setUser] = useState<User>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [sleep, setSleep] = useState<string>("7.5h");
  const [mood, setMood] = useState<string>("8/10");
  const [water, setWater] = useState<string>("2.1L");
  const [calories, setCalories] = useState<string>("1,850");
  const [bars, setBars] = useState<number[]>([40, 28, 64, 32, 76, 36, 60]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const res = await fetch("http://localhost:4000/api/entries/", {
          credentials: "include",
        });
        if (!res.ok) {
          throw Error("error occurred");
        }
        const data: EntryApi[] = await res.json();
        if (!data.length) return;
        const today = new Date().toISOString().slice(0, 10);
        const todayEntry = data.find((e) => e.day === today);
        const last7 = data.slice(-7);
        const barHeights = last7.map((e) => {
          if (!e.sleep_hours) return 20;
          return (e.sleep_hours / 10) * 100;
        });
        setBars(barHeights);
        if (todayEntry) {
          setSleep(todayEntry.sleep_hours ? todayEntry.sleep_hours + "h" : "–");
          setMood(todayEntry.mood_1_10 ? todayEntry.mood_1_10 + "/10" : "–");
          setWater(
            todayEntry.water_liters ? todayEntry.water_liters + "L" : "–"
          );
          setCalories(
            todayEntry.calories ? todayEntry.calories.toString() : "–"
          );
        } else {
          setSleep("");
          setMood("");
          setWater("");
          setCalories("");
        }
      } catch (error) {
        console.error(error);
      }
    })();
  }, [user]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("http://localhost:4000/api/auth/me", {
          credentials: "include",
        });
        if (!res.ok) {
          setUser(null);
          return;
        }
        const data = await res.json();
        setUser(data.user);
      } catch (error) {
        setUser(null);
      } finally {
        setLoadingUser(false);
      }
    })();
  }, []);
  if (loadingUser) {
    return <div className="text-white/80 text-sm">Loading your stats...</div>;
  }
  
  return (
    <div>
      <GlassStats
        sleep={sleep}
        mood={mood}
        water={water}
        calories={calories}
        bars={bars}
      />
    </div>
  );
};

export default GlassStatsForUser;
