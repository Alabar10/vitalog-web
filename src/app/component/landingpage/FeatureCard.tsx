import { Icon } from "lucide-react";
import React from "react";
type Props = { icon: React.ReactNode; title: string; desc: string };
const FeatureCard: React.FC<Props> = ({ icon, title, desc }) => {
  return (
    <div className="rounded-3xl border border-white/20 bg-white/10 backdrop-blur-xl p-6 md:p-8 text-white shadow-[0_10px_30px_rgba(0,0,0,0.12)] hover:scale-105 hover:bg-white/15 transition-transform duration-300 ease-out ">
      <div className="text-3xl mb-4">{icon}</div>
      <h3 className="text-2xl font-extrabold">{title}</h3>
      <p className="mt-3 text-white/85">{desc}</p>
    </div>
  );
};

export default FeatureCard;
