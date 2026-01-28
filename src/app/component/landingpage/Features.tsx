import React from "react";
import { Moon, HeartPulse, TrendingUp } from "lucide-react";
import FeatureCard from "./FeatureCard";
const Features = () => {
  return (
    <div className=" relative mx-auto max-w-6xl px-6 py-12 md:py-20">
      <h2 className="text-center text-white text-3xl md:text-4xl font-extrabold">
        Everything you need to track your wellness
      </h2>
      <br /><br />
      <div className="mt-10 flex flex-col md:flex-row  justify-center  gap-6   md:gap-8">
        <FeatureCard
          icon={<Moon className="h-6 w-6" />}
          title="Sleep Tracking"
          desc="Monitor your sleep patterns and get insights to improve your rest quality."
        />
        <FeatureCard
          icon={<HeartPulse className="h-6 w-6" />}
          title="Mood Analytics"
          desc="Track your emotional wellbeing and discover patterns in your daily life."
        />
        <FeatureCard
          icon={<TrendingUp className="h-6 w-6" />}
          title="Progress Reports"
          desc="Visualize your health journey with beautiful charts and personalized insights."
        />
      </div>
    </div>
  );
};

export default Features;
