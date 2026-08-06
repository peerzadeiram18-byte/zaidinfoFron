import React from "react";
import { motion } from "framer-motion";

const AdvantageCard = ({ imageSrc, image, title, description, badge }) => {
  // Support both prop names (imageSrc or image) so it never breaks
  const imgSrc = imageSrc || image;

  return (
    <motion.div
      initial={{ scale: 1.05, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="relative flex flex-col items-center justify-between h-full bg-white rounded-2xl shadow-sm border border-gray-200 p-6 text-center hover:shadow-md transition-shadow duration-300 w-full"
    >
      {/* Badge (Optional) */}
      {badge && (
        <div className="absolute top-3 right-3 bg-[#22c55e] text-white text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full shadow-md z-10">
          {badge}
        </div>
      )}

      {/* Small Icon Container */}
      <div className="w-16 h-16 sm:w-20 sm:h-20 my-4 flex items-center justify-center flex-shrink-0">
        <img
          src={imgSrc}
          alt={title}
          className="max-w-full max-h-full object-contain"
        />
      </div>

      {/* Text Content */}
      <div className="flex flex-col items-center justify-start flex-grow">
        <h3 className="text-base sm:text-lg font-bold text-[#0A1D37] tracking-tight mb-2 uppercase">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-gray-500 font-normal leading-relaxed">
          {description}
        </p>
      </div>
    </motion.div>
  );
};

export default AdvantageCard;