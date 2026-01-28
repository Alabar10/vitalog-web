import React from "react";
import { Moon, Droplets, Flame, HeartPulse, TrendingUp } from "lucide-react";
import { GlassStatsProps } from "./GlassStatsForUser";

const GlassStats = ({ sleep, mood, water, calories, bars }: GlassStatsProps) => {
  return (
    <div className=" relative max-w-xl rounded-3xl p-1">
      <div className=" pointer-events-none absolute -inset-1 rounded-[28px] bg-white/10 blur-xl "></div>
      <div className=" relative rounded-3xl border border-white/20 bg-white/10 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.15)]">
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/10 via-white/5 to-transparent"></div>
        <div className="relative p-6 md:p-8">
          <div className=" grid grid-cols-2 gap-4 md:gap-5">
            <div className="rounded-2xl border border-white/20 bg-white/10 p-4 md:p-5 hover:scale-105 hover:bg-white/15 transition-transform duration-300 ease-out">
              <div className="text-white/80 text-sm font-semibold flex items-center gap-2">
                <Moon className="h-5 w-5 text-white/90" />
              </div>
              <div className="mt-2 text-2xl md:text-3xl font-extrabold text-white">
                {sleep}
              </div>
            </div>
            <div className="rounded-2xl border border-white/20 bg-white/10 p-4 md:p-5 hover:scale-105 hover:bg-white/15 transition-transform duration-300 ease-out">
              <div className="text-white/80 text-sm font-semibold flex items-center gap-2">
                <HeartPulse className="h-5 w-5 text-white/90" />
              </div>
              <div className="mt-2 text-2xl md:text-3xl font-extrabold text-white">
                {mood}
              </div>
            </div>
            <div className="rounded-2xl border border-white/20 bg-white/10 p-4 md:p-5 hover:scale-105 hover:bg-white/15 transition-transform duration-300 ease-out">
              <div className="text-white/80 text-sm font-semibold flex items-center gap-2">
                <Droplets className="h-5 w-5 text-white/90" />
              </div>
              <div className="mt-2 text-2xl md:text-3xl font-extrabold text-white">
                {water}
              </div>
            </div>
            <div className="rounded-2xl border border-white/20 bg-white/10 p-4 md:p-5 hover:scale-105 hover:bg-white/15 transition-transform duration-300 ease-out">
              <div className="text-white/80 text-sm font-semibold flex items-center gap-2">
                <Flame className="h-5 w-5 text-white/90" />
              </div>
              <div className="mt-2 text-2xl md:text-3xl font-extrabold text-white">
                {calories}
              </div>
            </div>
            <div className="mt-6 rounded-2xl border border-white/20 bg-white/10 p-4 md:p-5 hover:scale-105 hover:bg-white/15 transition-transform duration-300 ease-out">
              <div className="mb-3 flex items-center gap-2 text-white/90 font-semibold">
                <TrendingUp className="h-8 w-8 text-white/90" />
                <span>Weekly Trends</span>
              </div>

              <div className="mt-2 flex items-end gap-3 h-32">
                {bars.map((h, i) => (
                  <div
                    key={i}
                    className="w-8 flex-1 rounded-md bg-white/30"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlassStats;
