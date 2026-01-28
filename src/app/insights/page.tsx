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

const page = () => {
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
          <p>
            This section summarizes recent trends in your sleep, mood,
            hydration, and activity levels.
          </p>
        </InsightSection>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <InsightCard
            title="Sleep Insights"
            icon={<Moon className="w-5 h-5 text-white" />}
          >
            ...
          </InsightCard>
          <InsightCard
            title="Hydration"
            icon={<Droplets className="w-5 h-5 text-white" />}
          >
            ...
          </InsightCard>
          <InsightCard
            title="Mood"
            icon={<Smile className="w-5 h-5 text-white" />}
          >
            ...
          </InsightCard>
          <InsightCard
            title="Nutrition"
            icon={<Utensils className="w-5 h-5 text-white" />}
          >
            ...
          </InsightCard>
        </div>
        <div className="mt-8">

        <InsightSection
          title="Patterns & Correlations"
          icon={<Brain className="w-5 h-5 text-white" />}
        >
          <p>s</p>
        </InsightSection>
        </div>
        <div className="mt-8">
        <InsightSection
          title="Personalized Recommendations"
          icon={<Lightbulb className="w-5 h-5 text-white" />}
        >
          <ol className="list-decimal pl-6 space-y-4">
            <li className="flex items-start gap-4">First recommendation text…</li>
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
