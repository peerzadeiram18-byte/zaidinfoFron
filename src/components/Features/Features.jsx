import React from "react";
import FeatureCard from "./FeatureCard";
import {
  FaShippingFast,
  FaBoxes,
  FaTags,
  FaHeadset,
} from "react-icons/fa";

const featuresData = [
  {
    id: 1,
    title: "Fast Delivery",
    description:
      "Deliver laptops quickly and safely with secure packaging and real-time order tracking.",
    icon: FaShippingFast,
    accent: {
      bg: "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/60",
      text: "text-emerald-600 dark:text-emerald-400",
      border: "hover:border-emerald-400/60 dark:hover:border-emerald-500/60",
      glow: "from-emerald-500/5 via-transparent to-emerald-500/10 dark:from-emerald-500/10 dark:to-emerald-500/20",
      bar: "bg-emerald-500",
    },
  },
  {
    id: 2,
    title: "Bulk Orders & Business Solutions",
    description:
      "Special pricing and dedicated support for schools, colleges, startups, offices, and enterprise customers.",
    icon: FaBoxes,
    accent: {
      bg: "bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800/60",
      text: "text-blue-600 dark:text-blue-400",
      border: "hover:border-blue-400/60 dark:hover:border-blue-500/60",
      glow: "from-blue-500/5 via-transparent to-blue-500/10 dark:from-blue-500/10 dark:to-blue-500/20",
      bar: "bg-blue-500",
    },
  },
  {
    id: 3,
    title: "Best Price Guarantee",
    description:
      "Premium laptops, affordable rental plans, and reliable repair services at transparent and competitive prices.",
    icon: FaTags,
    accent: {
      bg: "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800/60",
      text: "text-indigo-600 dark:text-indigo-400",
      border: "hover:border-indigo-400/60 dark:hover:border-indigo-500/60",
      glow: "from-indigo-500/5 via-transparent to-indigo-500/10 dark:from-indigo-500/10 dark:to-indigo-500/20",
      bar: "bg-indigo-500",
    },
  },
  {
    id: 4,
    title: "24/7 Expert Support",
    description:
      "Our experts are available around the clock to help with laptop purchases, rentals, repairs, and technical assistance.",
    icon: FaHeadset,
    accent: {
      bg: "bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 border border-cyan-100 dark:border-cyan-800/60",
      text: "text-cyan-600 dark:text-cyan-400",
      border: "hover:border-cyan-400/60 dark:hover:border-cyan-500/60",
      glow: "from-cyan-500/5 via-transparent to-cyan-500/10 dark:from-cyan-500/10 dark:to-cyan-500/20",
      bar: "bg-cyan-500",
    },
  },
];

const Features = () => {
  return (
    <section className="w-full py-16 md:py-24 bg-gradient-to-b from-white via-slate-50/60 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 relative overflow-hidden transition-colors duration-300">
      {/* Background Decorative Ambient Glows */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-emerald-400/10 dark:bg-emerald-500/10 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute bottom-10 -right-20 w-96 h-96 bg-blue-400/10 dark:bg-blue-500/10 blur-3xl rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 md:mb-20">
          <span className="inline-block text-xs md:text-sm font-bold tracking-widest text-emerald-700 dark:text-emerald-300 uppercase bg-emerald-100/70 dark:bg-emerald-950/60 px-4 py-1.5 rounded-full border border-emerald-200/80 dark:border-emerald-800/60 mb-4 shadow-2xs transition-colors duration-300">
            WHY CHOOSE US
          </span>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight transition-colors duration-300">
            Everything You Need For Your <span className="text-emerald-600 dark:text-emerald-400">Laptop</span>
          </h2>

          <div className="w-20 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500 mx-auto mt-4 rounded-full" />

          <p className="mt-5 text-base md:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal max-w-2xl mx-auto transition-colors duration-300">
            From buying premium laptops to affordable rentals and expert repair
            services, we deliver quality, reliability, and exceptional customer
            support—all in one place.
          </p>
        </div>

        {/* Features Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 items-stretch">
          {featuresData.map((feature) => (
            <FeatureCard
              key={feature.id}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              accent={feature.accent}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;