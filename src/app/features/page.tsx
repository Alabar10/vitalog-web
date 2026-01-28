"use client";
import React, { useState } from "react";
import {
  Activity,
  Moon,
  Droplets,
  Dumbbell,
  Droplet,
  TrendingUp,
  Sparkles,
  Zap,
  Target,
  BarChart3,
  ChevronRight,
  CheckCircle,
  Users,
  Award,
  LineChart as LineChartIcon,
  Calendar,
  Brain,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import Navbar from "../component/landingpage/Navbar";
import Link from "next/link";

const data = [
  { day: "Sun", sleep: 7, mood: 8, water: 2.5, activity: 30 },
  { day: "Mon", sleep: 6.5, mood: 7.5, water: 2.1, activity: 45 },
  { day: "Tue", sleep: 5.8, mood: 7.9, water: 2.0, activity: 0 },
  { day: "Wed", sleep: 7.2, mood: 8.2, water: 2.6, activity: 60 },
  { day: "Thu", sleep: 6.9, mood: 7.4, water: 1.9, activity: 30 },
  { day: "Fri", sleep: 7.1, mood: 7.8, water: 2.3, activity: 0 },
  { day: "Sat", sleep: 8.0, mood: 8.5, water: 2.7, activity: 95 },
];

const Page = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [timeRange, setTimeRange] = useState("week");

  const metrics = [
    {
      id: 1,
      name: "Sleep",
      value: "7.2h",
      change: "+0.3h",
      icon: Moon,
      color: "blue",
      bg: "from-blue-400 to-blue-600",
    },
    {
      id: 2,
      name: "Mood",
      value: "8.1/10",
      change: "+0.5",
      icon: Brain,
      color: "purple",
      bg: "from-purple-400 to-purple-600",
    },
    {
      id: 3,
      name: "Hydration",
      value: "2.4L",
      change: "+0.2L",
      icon: Droplets,
      color: "cyan",
      bg: "from-cyan-400 to-cyan-600",
    },
    {
      id: 4,
      name: "Activity",
      value: "165min",
      change: "+15%",
      icon: Activity,
      color: "emerald",
      bg: "from-emerald-400 to-emerald-600",
    },
  ];

  const features = [
    {
      icon: BarChart3,
      title: "Sleep Tracking",
      description:
        "Monitor sleep patterns with smart analytics. Build consistent sleep habits.",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      iconBg: "bg-blue-100",
      stats: "7.2h avg",
    },
    {
      icon: Brain,
      title: "Mood Tracking",
      description:
        "Track emotional patterns and identify what affects your wellbeing.",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      iconBg: "bg-purple-100",
      stats: "8.1/10 avg",
    },
    {
      icon: Droplet,
      title: "Hydration",
      description:
        "Stay on top of your water intake with smart reminders and tracking.",
      color: "text-cyan-600",
      bgColor: "bg-cyan-50",
      iconBg: "bg-cyan-100",
      stats: "2.4L avg",
    },
    {
      icon: Dumbbell,
      title: "Workouts",
      description: "Log exercises, track progress, and maintain consistency.",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      iconBg: "bg-emerald-100",
      stats: "165min/wk",
    },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-slate-200">
          <p className="font-bold text-slate-900 mb-2">{label}</p>
          <div className="space-y-1">
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-slate-700">{entry.dataKey}: </span>
                <span className="font-bold text-slate-900">
                  {entry.dataKey === "sleep"
                    ? `${entry.value}h`
                    : entry.dataKey === "mood"
                    ? entry.value
                    : entry.dataKey === "water"
                    ? `${entry.value}L`
                    : `${entry.value}min`}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen">
      <Navbar variant="solid" />
      {/* Hero Section */}
      <div className="relative min-h-screen pt-20 overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-400 animate-gradient-x" />

        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-cyan-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />
        </div>

        <div className="relative z-10 flex flex-col items-center mx-auto max-w-6xl px-4 text-center gap-8 py-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-4">
            <Sparkles className="w-4 h-4 text-white" />
            <span className="text-sm font-medium text-white">
              Now with AI Insights
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white">
            Understand Your
            <span className="block bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              Daily Wellness
            </span>
          </h1>

          <div className="mx-auto max-w-3xl">
            <p className="text-xl text-white/90 leading-relaxed">
              Track sleep, mood, hydration, and workouts in one beautiful
              dashboard. Discover patterns, build streaks, and optimize what
              makes you feel best.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl">
            {metrics.map((metric) => (
              <div
                key={metric.id}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  <metric.icon className="w-5 h-5 text-white" />
                  <span className="text-sm text-white/80">{metric.name}</span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {metric.value}
                </div>
                <div className="text-xs text-emerald-200 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {metric.change}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-col sm:flex-row items-center gap-4">
            <Link href="/login" className="group px-8 py-4 rounded-full bg-white text-indigo-600 font-semibold shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2">
              <span>View Dashboard</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/login" className="px-8 py-4 rounded-full border-2 border-white text-white font-semibold bg-white/5 hover:bg-white/20 backdrop-blur-sm transition-all duration-300">
              Explore Features
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gradient-to-b from-white to-slate-50 py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900">
              Track What
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                {" "}
                Matters Most
              </span>
            </h2>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
              Four essential pillars for complete wellness tracking and insights
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group relative rounded-3xl p-8 ${feature.bgColor} border border-slate-200 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2`}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Sparkles className={`w-6 h-6 ${feature.color}`} />
                </div>

                <div
                  className={`inline-flex items-center justify-center rounded-2xl ${feature.iconBg} ${feature.color} w-14 h-14 mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className="w-7 h-7" />
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed mb-4">
                  {feature.description}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                  <span className="text-sm font-medium text-slate-500">
                    Weekly Average
                  </span>
                  <span className={`font-bold ${feature.color}`}>
                    {feature.stats}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Insights Section */}
      <section className="py-24 bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm mb-6">
                <Zap className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-medium text-cyan-100">
                  AI-Powered Insights
                </span>
              </div>

              <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                Smart Analytics for
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                  Better Decisions
                </span>
              </h2>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-lg font-semibold text-white">
                      Weekly Patterns
                    </h4>
                    <p className="text-slate-300">
                      Automatically detect trends in your sleep, mood, and
                      activity.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Target className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-lg font-semibold text-white">
                      Personalized Goals
                    </h4>
                    <p className="text-slate-300">
                      Smart recommendations based on your unique patterns and
                      goals.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <TrendingUp className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-lg font-semibold text-white">
                      Progress Tracking
                    </h4>
                    <p className="text-slate-300">
                      Visualize your improvement over time with detailed
                      analytics.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Dashboard */}
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-3xl blur-xl" />
              <div className="relative bg-slate-800/50 backdrop-blur-sm rounded-3xl border border-slate-700 p-8">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      Weekly Overview
                    </h3>
                    <p className="text-slate-400">Last 7 days performance</p>
                  </div>
                  <Calendar className="w-6 h-6 text-slate-400" />
                </div>

                <div className="space-y-6">
                  {[
                    { label: "Sleep Quality", value: 85, color: "bg-blue-500" },
                    {
                      label: "Mood Stability",
                      value: 78,
                      color: "bg-purple-500",
                    },
                    {
                      label: "Hydration Goal",
                      value: 92,
                      color: "bg-cyan-500",
                    },
                    {
                      label: "Activity Target",
                      value: 65,
                      color: "bg-emerald-500",
                    },
                  ].map((item, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-slate-300">
                          {item.label}
                        </span>
                        <span className="text-sm font-semibold text-white">
                          {item.value}%
                        </span>
                      </div>
                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${item.color} rounded-full transition-all duration-1000 ease-out`}
                          style={{ width: `${item.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-8 border-t border-slate-700">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-2xl font-bold text-white">
                        Current Streak
                      </div>
                      <div className="text-slate-400">
                        14 days • Personal Best
                      </div>
                    </div>
                    <Award className="w-8 h-8 text-yellow-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Chart Section */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
              Your Week at a Glance
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              See all your health metrics in one beautiful chart. Spot trends,
              understand patterns, and make informed decisions about your
              wellness.
            </p>
          </div>

          {/* Chart Container */}
          <div className="rounded-3xl bg-gradient-to-br from-white to-slate-50 border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
            {/* Chart Header */}
            <div className="px-8 py-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Weekly Metrics Overview
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">
                    Last 7 days • All metrics in one view
                  </p>
                </div>
                <div className="flex items-center gap-3 mt-3 sm:mt-0">
                  <button
                    className={`text-sm px-4 py-2 rounded-lg font-medium border ${
                      timeRange === "week"
                        ? "bg-blue-50 text-blue-600 border-blue-100"
                        : "text-slate-600 border-slate-200 hover:bg-slate-50"
                    }`}
                    onClick={() => setTimeRange("week")}
                  >
                    Week
                  </button>
                  <button
                    className={`text-sm px-4 py-2 rounded-lg font-medium border ${
                      timeRange === "month"
                        ? "bg-blue-50 text-blue-600 border-blue-100"
                        : "text-slate-600 border-slate-200 hover:bg-slate-50"
                    }`}
                    onClick={() => setTimeRange("month")}
                  >
                    Month
                  </button>
                </div>
              </div>
            </div>

            {/* Chart Area */}
            <div className="p-8">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={data}
                    margin={{ top: 20, right: 30, left: 0, bottom: 10 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#e5e7eb"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="day"
                      stroke="#6b7280"
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      stroke="#6b7280"
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(value) => `${value}`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    {/* Sleep */}
                    <Line
                      type="monotone"
                      dataKey="sleep"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      dot={{ r: 6, strokeWidth: 2, stroke: "#3b82f6" }}
                      activeDot={{ r: 8, strokeWidth: 2, stroke: "#3b82f6" }}
                    />
                    {/* Mood */}
                    <Line
                      type="monotone"
                      dataKey="mood"
                      stroke="#ec4899"
                      strokeWidth={3}
                      dot={{ r: 6, strokeWidth: 2, stroke: "#ec4899" }}
                      activeDot={{ r: 8, strokeWidth: 2, stroke: "#ec4899" }}
                    />
                    {/* Water */}
                    <Line
                      type="monotone"
                      dataKey="water"
                      stroke="#06b6d4"
                      strokeWidth={3}
                      dot={{ r: 6, strokeWidth: 2, stroke: "#06b6d4" }}
                      activeDot={{ r: 8, strokeWidth: 2, stroke: "#06b6d4" }}
                    />
                    {/* Activity */}
                    <Line
                      type="monotone"
                      dataKey="activity"
                      stroke="#10b981"
                      strokeWidth={3}
                      dot={{ r: 6, strokeWidth: 2, stroke: "#10b981" }}
                      activeDot={{ r: 8, strokeWidth: 2, stroke: "#10b981" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Legend */}
              <div className="mt-8 pt-6 border-t border-slate-200">
                <div className="flex flex-wrap justify-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-blue-500" />
                    <span className="text-sm font-medium text-slate-700">
                      Sleep (hrs)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-pink-500" />
                    <span className="text-sm font-medium text-slate-700">
                      Mood
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-cyan-500" />
                    <span className="text-sm font-medium text-slate-700">
                      Water (L)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-emerald-500" />
                    <span className="text-sm font-medium text-slate-700">
                      Activity (min)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Chart Footer */}
            <div className="px-8 py-4 border-t border-slate-200 bg-slate-50/50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-500">
                  <span className="font-medium">Trend:</span> Upward mood
                  correlation with hydration
                </div>
                <button className="text-sm text-blue-600 font-medium hover:text-blue-700 flex items-center gap-1">
                  <span>View Detailed Report</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Additional Stats */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">7.5h</div>
              <div className="text-sm text-slate-600">Average Sleep</div>
              <div className="text-xs text-emerald-600 mt-1">
                +0.3h from last week
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-600">78.6</div>
              <div className="text-sm text-slate-600">Average Mood Score</div>
              <div className="text-xs text-emerald-600 mt-1">
                +2.4 points from last week
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600">42min</div>
              <div className="text-sm text-slate-600">Daily Activity</div>
              <div className="text-xs text-emerald-600 mt-1">
                +8min from last week
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-cyan-500 animate-gradient-x" />

        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          

          <h2 className="text-5xl sm:text-6xl font-bold text-white mb-6">
            Start Your
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-200">
              Wellness Journey Today
            </span>
          </h2>

          <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto">
            Transform how you track and understand your health. No credit card
            required.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link href="/signup" className="group px-10 py-5 rounded-2xl bg-white text-slate-900 font-bold text-lg shadow-2xl hover:shadow-3xl hover:-translate-y-1 transition-all duration-300 flex items-center gap-3">
              <span>Get Started Free</span>
              <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </Link>

            
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-8 text-white/70">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-300" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-300" />
              <span>14-day free trial</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-300" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes gradient-x {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }

        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 15s ease infinite;
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .bg-grid-white\/\[0\.02\] {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(255 255 255 / 0.02)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e");
        }
      `}</style>
    </div>
  );
};

export default Page;