import React from 'react';
import { motion } from 'framer-motion';

const ShopCard = ({ image, title, description, badge }) => {
  return (
    <motion.div
      initial={{ scale: 0.1, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        duration: 2.2, // Slower, expansion speed
        ease: 'easeOut',
      }}
      style={{ transformOrigin: 'center center' }}
      className="relative flex flex-col h-full bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden hover:shadow-md transition-all duration-300 w-full"
    >
      {/* Fixed Aspect Ratio Image Container */}
      <div className="relative w-full aspect-[4/3] bg-gray-50 dark:bg-slate-800/50 overflow-hidden flex-shrink-0 flex items-center justify-center">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover object-center"
        />
        {badge && (
          <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-[#22c55e] text-white text-[9px] sm:text-[10px] font-bold tracking-wider uppercase leading-tight px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-full shadow-md text-center max-w-[50px] sm:max-w-[54px] z-10">
            {badge}
          </div>
        )}
      </div>

      {/* Content Container with Uniform Alignment */}
      <div className="p-3 sm:p-4 text-center flex flex-col justify-start items-center flex-grow bg-white dark:bg-slate-900 transition-colors duration-300">
        <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white tracking-tight leading-snug min-h-[2.5rem] flex items-center justify-center">
          {title}
        </h3>
        <p className="text-[11px] sm:text-xs text-gray-500 dark:text-slate-400 font-medium mt-1 leading-normal">
          {description}
        </p>
      </div>
    </motion.div>
  );
};

export default ShopCard;