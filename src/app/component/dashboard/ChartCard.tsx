"use client";
import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
type ChartCardProps = {
  refreshKey: number;
};

type TrendPoint = {
  dow: string;
  date: string;
  sleep: number;
  mood: number;
  water: number;
};

export type EntryApi = {
  id: number;
  day: string;
  mood_1_10: number | null;
  sleep_hours: number | null;
  water_liters: number | null;
  calories: number | null;
  activity: number | null;
  workout_type: string;
  workout_minutes: number | null;
  duration: number | null;
  intensity: string|null;
  notes: string | null;
};
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const p = Object.fromEntries(payload.map((x: any) => [x.dataKey, x.value]));
  console.log("tooltip payload:", payload);
  return (
    <div className="rounded-xl bg-white text-black shadow p-3">
      <div className="font-semibold mb-1">{label}</div>
      <div className="text-sm">
        <div className="text-sky-600">Sleep (hrs) : {p.sleep ?? 0}</div>
        <div className="text-rose-500">Mood : {p.mood ?? 0}</div>
        <div className="text-emerald-600">Water (L) : {p.water ?? 0}</div>
      </div>
    </div>
  );
};
const buildWeeklyData = (entries: EntryApi[]): TrendPoint[] => {
  const sorted = [...entries].sort((a, b) => a.day.localeCompare(b.day));
  const lastSeven = sorted.slice(-7);
  const points = lastSeven.map((e) => {
    const d = new Date(e.day);
    const dow = d.toLocaleDateString("en-US", { weekday: "short" });
    return {
      dow,
      date: e.day,
      sleep: e.sleep_hours ?? 0,
      mood: e.mood_1_10 ?? 0,
      water: e.water_liters ?? 0,
    };
  });

  return points;
};

const ChartCard: React.FC<ChartCardProps> = ({ refreshKey }) => {
  const [weeklyData, setWeeklyData] = useState<TrendPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("http://localhost:4000/api/entries/", {
          credentials: "include",
        });
        if (!res.ok) {
          throw new Error("Faild to load entries");
        }
        const data: EntryApi[] = await res.json();
        const points = buildWeeklyData(data);
        setWeeklyData(points);
      } catch (error: any) {
        console.error(error);
        setError(error.message || "Unoknown error");
      } finally {
        setLoading(false);
      }
    })();
  }, [refreshKey]);
  if (loading) {
    return (
      <div className="mt-10 text-white/70 text-sm">
        Loading weekly trends...
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-10 text-red-400 text-sm">
        Error loading weekly trends: {error}
      </div>
    );
  }

  if (!weeklyData.length) {
    return (
      <div className="mt-10 text-white/70 text-sm">
        No data yet. Log your first entry to see trends here.
      </div>
    );
  }

  return (
    <div className="bg-white/10 mt-10 rounded-3xl backdrop-blur-xl border  border-white/20 p-4 sm:p-6 text-white ">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <span>Weekly Trends</span>
      </h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={weeklyData}
            margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
          >
            <defs>
              {/* nice faint grid line gradient */}
              <linearGradient id="gridFade" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(255,255,255,0.25)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0.05)" />
              </linearGradient>
            </defs>

            <CartesianGrid stroke="url(#gridFade)" strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              stroke="rgba(255,255,255,0.8)"
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString("en-US", {
                  weekday: "short",
                })
              }
            />
            <YAxis
              stroke="rgba(255,255,255,0.8)"
              allowDecimals
              domain={[0, "auto"]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />

            {/* Sleep (hrs) */}
            <Line
              type="monotone"
              dataKey="sleep"
              name="Sleep (hrs)"
              stroke="#60a5fa"
              strokeWidth={3}
              dot={{ r: 5 }}
              activeDot={{ r: 7 }}
            />
            {/* Mood */}
            <Line
              type="monotone"
              dataKey="mood"
              name="Mood"
              stroke="#fb7185"
              strokeWidth={3}
              dot={{ r: 5 }}
              activeDot={{ r: 7 }}
            />
            {/* Water (L) */}
            <Line
              type="monotone"
              dataKey="water"
              name="Water (L)"
              stroke="#34d399"
              strokeWidth={3}
              dot={{ r: 5 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartCard;
