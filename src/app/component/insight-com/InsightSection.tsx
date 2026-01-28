import React from "react";
import { InsightBaseProps } from "./insight.types";
const InsightSection = ({ title, icon, children }: InsightBaseProps) => {
  return (
    <section className=" rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-6 shadow-lg text-white">
      <header className="flex items-center gap-3">
        {icon} {title}
      </header>
      <div className="mt-3 text-white leading-relaxed">{children}</div>
    </section>
  );
};

export default InsightSection;
