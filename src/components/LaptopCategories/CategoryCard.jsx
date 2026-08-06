import React from "react";
import { ArrowRight } from "lucide-react";

const CategoryCard = ({ title, badge, description, image }) => {
  return (
    <div className="group relative bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-slate-100/90 shadow-md hover:shadow-2xl hover:border-green-500/40 hover:-translate-y-2 transition-all duration-300 ease-out flex flex-col justify-between overflow-hidden h-full">
      {/* Subtle Card Internal Gradient Glow on Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      <div>
        {/* Image Container with Floating & Zoom Hover Effect */}
        <div className="relative w-full h-48 sm:h-56 flex items-center justify-center p-4 bg-gradient-to-b from-slate-50/60 to-slate-100/40 rounded-2xl border border-slate-100/80 mb-6 group-hover:border-green-100 transition-colors duration-300">
          
          {/* Discount Badge */}
          <div className="absolute top-3 left-3 z-20">
            <span className="bg-gradient-to-r from-green-600 to-emerald-500 text-white font-bold text-xs px-3.5 py-1.5 rounded-full shadow-md tracking-wide">
              {badge}
            </span>
          </div>

          <img
            src={image}
            alt={title}
            className="max-h-36 sm:max-h-44 w-auto object-contain transition-all duration-500 ease-out group-hover:scale-105 group-hover:-translate-y-1 drop-shadow-md"
          />
        </div>

        {/* Card Title & Description */}
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 group-hover:text-green-600 transition-colors duration-300 mb-2.5">
          {title}
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed mb-6">
          {description}
        </p>
      </div>

      {/* Action Button */}
      <div className="pt-2">
        <button className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 via-green-500 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white font-semibold text-sm py-3 px-6 rounded-full shadow-md hover:shadow-green-500/25 hover:shadow-lg active:scale-95 transition-all duration-300 cursor-pointer">
          <span>Explore Collection</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
        </button>
      </div>
    </div>
  );
};

export default CategoryCard;