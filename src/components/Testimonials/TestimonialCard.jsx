import React from "react";
import { Star, CheckCircle2 } from "lucide-react";

const TestimonialCard = ({ avatar, name, role, review, rating, offsetClass }) => {
  return (
    <div
      className={`bg-white rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 ease-out border border-blue-50/80 flex flex-col justify-between ${offsetClass}`}
    >
      <div>
        {/* Star Rating & Verified Badge */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-1">
            {[...Array(rating)].map((_, index) => (
              <Star key={index} className="w-4 h-4 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-[#22C55E] text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Verified</span>
          </div>
        </div>

        {/* Review Text */}
        <p className="text-slate-700 text-base leading-relaxed mb-6 font-normal">
          "{review}"
        </p>
      </div>

      {/* Customer Info */}
      <div className="flex items-center gap-3.5 pt-4 border-t border-slate-100">
        <img
          src={avatar}
          alt={name}
          className="w-11 h-11 rounded-full object-cover ring-2 ring-blue-100"
          loading="lazy"
        />
        <div>
          <h4 className="text-slate-900 font-bold text-sm tracking-tight">{name}</h4>
          <p className="text-slate-500 text-xs font-medium">{role}</p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;