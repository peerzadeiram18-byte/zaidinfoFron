import React from 'react';
import { motion } from 'framer-motion';

const ServiceCard = ({ 
  title, 
  subtitle, 
  points = [], 
  buttonText, 
  bgImage, 
  bgPosition = 'center', 
  onButtonClick 
}) => {
  return (
    <motion.div
      variants={{
        hidden: { scale: 0.7, opacity: 0 },
        visible: { 
          scale: 1, 
          opacity: 1,
          transition: {
            duration: 0.5,
            ease: [0.16, 1, 0.3, 1],
          }
        }
      }}
      className="relative group rounded-2xl overflow-hidden shadow-xl min-h-[440px] flex flex-col justify-between p-6 transition-shadow duration-300 hover:shadow-2xl border border-gray-100/10 origin-center"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover transition-transform duration-500 group-hover:scale-105"
        style={{ 
          backgroundImage: `url(${bgImage})`,
          backgroundPosition: bgPosition 
        }}
      />

      {/* Enhanced Dark Gradient Overlay for Maximum Text Contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/75 to-slate-900/50" />

      {/* Content Container */}
      <div className="relative z-10 space-y-4">
        <div>
          <h3 className="text-xl font-bold text-white tracking-wide uppercase mb-1.5 drop-shadow-md">
            {title}
          </h3>
          {/* Subtitle with slate-200 for crisp readability against the dark backdrop */}
          <p className="text-sm text-slate-200 font-medium leading-snug drop-shadow-sm">
            {subtitle}
          </p>
        </div>

        {/* Bullet Points */}
        <ul className="space-y-2.5 pt-2">
          {points?.map((point, index) => (
            <li key={index} className="flex items-center text-xs text-white font-semibold drop-shadow-md">
              <svg
                className="w-4 h-4 text-[#22c55e] mr-2 shrink-0 filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Action Button */}
      <div className="relative z-10 pt-6">
        <button
          onClick={onButtonClick}
          className="w-auto px-5 py-2.5 bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-semibold rounded-lg flex items-center justify-center space-x-2 transition-all duration-200 shadow-lg"
        >
          <span>{buttonText}</span>
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </button>
      </div>
    </motion.div>
  );
};

export default ServiceCard;