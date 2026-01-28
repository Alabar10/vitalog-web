"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Navbar from "../component/landingpage/Navbar";
import MetricCard from "../component/dashboard/MetricCard";
import { Moon, Smile, Droplets, Flame,Dumbbell} from "lucide-react";
import LogMetricsModal from "../component/dashboard/LogMetricsModal";
type MetricKey = "sleep" | "mood" | "water" | "calories" | "activity"| null;

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import ChartCard, { EntryApi } from "../component/dashboard/ChartCard";
import Insights from "../component/dashboard/ Insights";
type User = { id: number; username: string; email: string } | null;

type Entry = {
  day: string;
  sleep_hours: number | null;
  mood_1_10: number | null;
  water_liters: number | null;
  calories: number | null;
  notes: string;
};
export type TrendPoint = {
  dow: string;
  date: string;
  sleep: number;
  mood: number;
  water: number;
};

const page = () => {
  const [user, setUser] = useState<User>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [todayLong, setTodayLong] = useState<string>("");
  const [openModal, setOpenModal] = useState(false);
  const [activeMetric, setActiveMetric] = useState<MetricKey>(null);
  const [weeklyData, setWeeklyData] = useState<TrendPoint[]>([]);
  const [latestEntry, setLatestEntry] = useState<EntryApi | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const handleEntrySaved = () => {
    setRefreshKey((prev) => prev + 1);
  };
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("http://localhost:4000/api/entries/", {
          credentials: "include",
        });
        if (!res.ok) {
          console.error("Failed to load entries");
          return;
        }

        const data: EntryApi[] = await res.json();

        if (!data.length) {
          setLatestEntry(null);
          return;
        }

        const sorted = [...data].sort((a, b) => a.day.localeCompare(b.day));
        const last = sorted[sorted.length - 1];
        setLatestEntry(last);
      } catch (error) {
        console.error("Error fetching entries:", error);
      }
    })();
  }, [refreshKey]); 

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
  useEffect(() => {
    setTodayLong(
      new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(new Date())
    );
  }, []);

  return (
    <div>
      <div className="min-h-screen pt-20 bg-gradient-to-r from-indigo-500 via-sky-400 to-cyan-300">
        <Navbar />
        <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-10 text-white">
          <div className="flex items-start justify-between gap-6">
            <div className="w-full">
              <h1 className="text-3xl sm:text-5xl mr-13 font-extrabold  drop-shadow-sm">
                {loadingUser
                  ? "Welcome back!"
                  : `Welcome back, ${user?.username || "Friend"}!`}{" "}
                <span>👋</span>
              </h1>
              {todayLong && (
                <p className="mt-2 text-white/90 text-lg">{todayLong}</p>
              )}{" "}
            </div>

            {/* <button
              className="flex items-center gap-2 rounded-xl bg-white text-indigo-700 text-gl w-72 px-8 py-3 font-semibold
                 hover:bg-indigo-600 hover:text-white transition-all duration-300 shadow-sm hover:shadow-md"
            >
              + Log Today’s Metrics
            </button> */}
          </div>
          <section className="mt-10 grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Sleep"
              suffix="h"
              Icon={Moon}
              value={latestEntry?.sleep_hours ?? undefined}
              onClick={() => {
                setActiveMetric("sleep");
                setOpenModal(true);
              }}
            />
            <MetricCard
              title="Mood"
              Icon={Smile}
              iconColor="text-rose-300"
              value={latestEntry?.mood_1_10 ?? undefined}
              onClick={() => {
                setActiveMetric("mood");
                setOpenModal(true);
              }}
            />
            <MetricCard
              title="Water"
              suffix="L"
              Icon={Droplets}
              iconColor="text-teal-300"
              value={latestEntry?.water_liters ?? undefined}
              onClick={() => {
                setActiveMetric("water");
                setOpenModal(true);
              }}
            />
            <MetricCard
              title="Calories"
              Icon={Flame}
              iconColor="text-orange-300"
              value={latestEntry?.calories ?? undefined}
              onClick={() => {
                setActiveMetric("calories");
                setOpenModal(true);
              }}
            />
            <MetricCard
              title="Activity"
              Icon={Dumbbell}
              iconColor="text-green-300"
              value={latestEntry?.activity ?? undefined}
              onClick={() => {
                setActiveMetric("activity");
                setOpenModal(true);
              }}
            />
          </section>
          <LogMetricsModal
            open={openModal}
            onClose={() => setOpenModal(false)}
            onSaved={handleEntrySaved}
            focusField={activeMetric}
          />
          <ChartCard refreshKey={refreshKey} />
          <Insights refreshKey={refreshKey} />
        </main>
      </div>
    </div>
  );
};

export default page;
