import React from "react";

const FeatureCard = ({ icon: Icon, title, description, accent }) => {
  return (
    <div
      className={`group relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2.5 transition-all duration-300 ease-out flex flex-col justify-between overflow-hidden ${accent.border}`}
    >
      {/* Dynamic Background Hover Glow */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${accent.glow} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}
      />

      <div className="relative z-10 flex flex-col items-start text-left">
        {/* Icon Container with Accent Colors */}
        <div
          className={`w-14 h-14 rounded-2xl ${accent.bg} ${accent.text} flex items-center justify-center shadow-md mb-6 group-hover:scale-110 transition-transform duration-300 ease-out`}
        >
          <Icon className="w-7 h-7" />
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-tight group-hover:text-slate-950 transition-colors">
          {title}
        </h3>

        {/* Description */}
        <p className="text-slate-600 text-sm leading-relaxed font-normal">
          {description}
        </p>
      </div>

      {/* Dynamic Bottom Accent Line */}
      <div className="mt-8 relative z-10 w-full flex items-center">
        <div
          className={`h-1 w-10 rounded-full ${accent.bar} group-hover:w-full transition-all duration-500 ease-out`}
        />
      </div>
    </div>
  );
};

export default FeatureCard;