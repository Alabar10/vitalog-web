"use client";
import React from "react";
import {
  Activity,
  Moon,
  Droplets,
  Dumbbell,
  Smile,
  Utensils,
  Brain,
  Lightbulb,
} from "lucide-react";
import InsightCard from "../component/insight-com/InsightCard";
import InsightSection from "../component/insight-com/InsightSection";
import { useAuth } from "@/context/AuthContext";

const page = () => {
  const [overview, setOverview] = React.useState("");
  const[sleepOverview,setSleepOverview]=React.useState("");
  const[hydrationOverview,setHydrationOverview]=React.useState("");
  const[moodOverview,setMoodOverview]=React.useState("");
  const[nutritionOverview,setNutritionOverview]=React.useState("");
  const[patternsText,setPatternsText]=React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [stats, setStats] = React.useState(null);
  const { user, setUser } = useAuth();

  async function loadInsights() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`http://localhost:4000/api/insights/`, {
        method: "GET",
        credentials: "include",
      });
      if (!res.ok) {
        let msg = `Request failed (${res.status})`;
        try {
          const err = await res.json();
          msg = err?.message || err?.error || msg;
        } catch {}
        throw new Error(msg);
      }

      const data = await res.json();
      setStats(data.stats);
      setOverview(data.overview_narrative || data.overview || "");
      setSleepOverview(data.sleep_text ||"")
      setHydrationOverview(data.hydration_text ||"")
      setMoodOverview(data.mood_text ||"")
      setNutritionOverview(data.nutrition_text ||"")
      setPatternsText(data.patterns_text ||"")
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  }
  React.useEffect(() => {
    console.log("Effect fired. user =", user);
    if (user) loadInsights();
  }, [user]);

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-r from-indigo-500 via-sky-400 to-cyan-300 ">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex items-center gap-4">
          <Brain className="h-10 w-10 text-white" />
          <h1 className="text-5xl font-extrabold tracking-tight text-white">
            Your Health Insights
          </h1>
        </div>

        <p className="mt-3 text-2xl text-white/80">
          AI-powered analysis of your wellness data · Last 30 days
        </p>
      </div>
      <br />
      <br />
      <div className="mx-auto max-w-6xl px-6">
        <InsightSection
          title="Overview"
          icon={<Activity className="w-5 h-5 text-white" />}
        >
          <p className=" leading-relaxed text-white/90">
          {overview}
          </p>
        </InsightSection>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <InsightCard
            title="Sleep Insights"
            icon={<Moon className="w-5 h-5 text-white" />}
          >
            <p>{sleepOverview}</p>
          </InsightCard>
          <InsightCard
            title="Hydration"
            icon={<Droplets className="w-5 h-5 text-white" />}
          >
            <p>{hydrationOverview}</p>
          </InsightCard>
          <InsightCard
            title="Mood"
            icon={<Smile className="w-5 h-5 text-white" />}
          >
            <p>{moodOverview}</p>
          </InsightCard>
          <InsightCard
            title="Nutrition"
            icon={<Utensils className="w-5 h-5 text-white" />}
          >
            <p>{nutritionOverview}</p>
          </InsightCard>
        </div>
        <div className="mt-8">
          <InsightSection
            title="Patterns & Correlations"
            icon={<Brain className="w-5 h-5 text-white" />}
          >
            <p>{patternsText}</p>
          </InsightSection>
        </div>
        <div className="mt-8">
          <InsightSection
            title="Personalized Recommendations"
            icon={<Lightbulb className="w-5 h-5 text-white" />}
          >
            <ol className="list-decimal pl-6 space-y-4">
              <li className="flex items-start gap-4">
                First recommendation text…
              </li>
              <li>second recommendation text…</li>
              <li>third recommendation text…</li>
            </ol>
          </InsightSection>
        </div>
      </div>
    </div>
  );
};

export default page;
