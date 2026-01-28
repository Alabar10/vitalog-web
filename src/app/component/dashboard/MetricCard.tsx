"use client";
import React from "react";
import { LucideIcon } from "lucide-react";

type MetricCardProps = {
  title: string;
  value?: string | number | null;
  suffix?: string;
  Icon?: LucideIcon;
  iconColor?: string;
  onClick?: () => void;
};

const MetricCard = ({
  title,
  value = "—",
  suffix = "",
  Icon,
  iconColor = "text-white",
  onClick,
}: MetricCardProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-2xl bg-white/10 backdrop-blur-3xl border border-white/20
                 shadow-[0_8px_30px_rgba(0,0,0,0.12)] p-5 flex flex-col gap-6 hover:bg-white/20 hover:scale-110 hover:shadow-lg transition-transform duration-300"
    >
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-xl bg-white/10 ${iconColor}`}>
          {Icon ? <Icon size={20} /> : <span>•</span>}
        </div>
        <span className="text-white/95 font-semibold">{title}</span>
      </div>

      <div className="mt-auto">
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-semibold text-white/95">{value}</span>
          {suffix && <span className="text-white/80">{suffix}</span>}
        </div>
      </div>
    </button>
  );
};

export default MetricCard;
