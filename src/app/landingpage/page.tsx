"use client";
import React, { useEffect, useState } from "react";
import Navbar, { User } from "../component/landingpage/Navbar";
import GlassStats from "../component/landingpage/GlassStats";
import Features from "../component/landingpage/Features";
import GlassStatsForUser from "../component/landingpage/GlassStatsForUser";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
const page = () => {
  const { user, loading } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div>
      <div className="min-h-screen pt-20 bg-gradient-to-r from-indigo-500 via-sky-400 to-cyan-300">
        <Navbar />
        <div className="flex flex-col items-center justify-between gap-10 px-6 pb-10 pt-8 md:flex-row md:gap-0 md:px-0 md:pb-0 md:pt-0">
          <div className="w-full max-w-3xl text-white md:ml-8 md:text-left">
            <h1 className="text-center text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl md:text-left md:text-7xl">
              Understand your health. Track your progress. Live better.
            </h1>
            <p className="mt-6 max-w-2xl text-center text-base leading-7 text-white/85 sm:text-lg md:text-left">
              VitaLog helps you monitor your sleep, mood, workouts, and
              nutrition — all in one easy, intelligent dashboard. Take control
              of your wellness journey today.
            </p>
            <br />
            <div className="flex justify-center md:justify-start">
              {mounted && !loading && user ? (
                <Link
                  href="/dashboard"
                  className="relative z-10 inline-flex items-center rounded-full bg-white px-6 py-3 text-base font-semibold text-indigo-600 shadow-lg shadow-black/10 transition hover:bg-indigo-600 hover:text-white"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="relative z-10 inline-flex items-center rounded-full bg-white px-6 py-3 text-base font-semibold text-indigo-600 shadow-lg shadow-black/10 transition hover:bg-indigo-600 hover:text-white"
                >
                  Start Tracking for free
                </Link>
              )}
            </div>
          </div>
          <div className="w-full max-w-xl md:mr-5 md:shrink-0">
            <GlassStatsForUser />
          </div>
        </div>
        <br />
        <br />
        <div>
          <Features />
        </div>
      </div>
    </div>
  );
};

export default page;
