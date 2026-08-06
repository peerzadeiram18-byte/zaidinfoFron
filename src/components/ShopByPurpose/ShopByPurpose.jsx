// ShopByPurpose.jsx

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import ShopCard from './ShopCard';

// importing assets from assets/images folder
import buisnesslaptop from '../../assets/images/buisnesslaptop.jpg';
import gaminglaptop from '../../assets/images/gaminglaptop.jpg';
import studentlaptop from '../../assets/images/studentlaptop.jpg';
import refurbishedlaptop from '../../assets/images/refurbishedlaptop.jpg';
import Macbook from '../../assets/images/Macbook.jpg';
import accessories from '../../assets/images/accessoriess.jpg';

const ShopByPurpose = () => {
  const categories = [
    {
      id: 1,
      title: 'Business Laptops',
      description: 'Powerful. Reliable. Secure.',
      image: buisnesslaptop,
    },
    {
      id: 2,
      title: 'Gaming Laptops',
      description: 'High Performance. No Limits.',
      image: gaminglaptop,
    },
    {
      id: 3,
      title: 'Student Laptops',
      description: 'Study. Learn. Achieve.',
      image: studentlaptop,
    },
    {
      id: 4,
      title: 'Refurbished Laptops',
      description: 'Certified. Tested. Trusted.',
      image: refurbishedlaptop,
    },
    {
      id: 5,
      title: 'MacBooks',
      description: 'Power. Performance. Style.',
      image: Macbook,
    },
    {
      id: 6,
      title: 'Accessories',
      description: 'Enhance Your Experience.',
      image: accessories,
    },
  ];

  const headerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: headerRef,
    offset: ['start 0.9', 'center 0.6'],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [0.95, 1.1]);
  const letterSpacing = useTransform(scrollYProgress, [0, 1], ['0px', '2px']);
  const fontWeight = useTransform(scrollYProgress, [0, 1], [500, 800]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0.7, 1]);

  return (
    <section className="max-w-7xl mx-auto px-4 pt-12 sm:pt-16 pb-8 transition-colors duration-300">

      {/* Heading */}
      <div
        ref={headerRef}
        className="text-center mb-6 overflow-hidden"
      >
        <motion.h2
          style={{
            scale,
            letterSpacing,
            fontWeight,
            opacity,
          }}
          className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white uppercase inline-block relative origin-center"
        >
          SHOP BY PURPOSE

          <motion.span
            style={{ scaleX: scrollYProgress }}
            className="block h-1 w-12 bg-[#22c55e] mx-auto mt-2 rounded-full origin-center"
          />
        </motion.h2>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
        {categories.map((category) => (
          <ShopCard
            key={category.id}
            title={category.title}
            description={category.description}
            image={category.image}
            badge={category.badge}
          />
        ))}
      </div>

      {/* View All Categories Link */}
      <div className="flex justify-center mt-5">
        <a
          href="#categories"
          className="inline-flex items-center text-sm font-semibold text-[#16a34a] dark:text-emerald-400 hover:text-[#15803d] dark:hover:text-emerald-300 transition-colors"
        >
          <span>View All Categories</span>

          <svg
            className="w-4 h-4 ml-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </a>
      </div>

    </section>
  );
};

export default ShopByPurpose;


// ShopCard.jsx

// import React from 'react';
// import { motion } from 'framer-motion';

// const ShopCard = ({ image, title, description, badge }) => {
//   return (
//     <motion.div
//       initial={{ scale: 0.1, opacity: 0 }}
//       animate={{ scale: 1, opacity: 1 }}
//       transition={{
//         duration: 2.2, // Slower, expansion speed
//         ease: 'easeOut',
//       }}
//       style={{ transformOrigin: 'center center' }}
//       className="relative flex flex-col h-full bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden hover:shadow-md transition-all duration-300 w-full"
//     >
//       {/* Fixed Aspect Ratio Image Container */}
//       <div className="relative w-full aspect-[4/3] bg-gray-50 dark:bg-slate-800/50 overflow-hidden flex-shrink-0 flex items-center justify-center">
//         <img
//           src={image}
//           alt={title}
//           className="w-full h-full object-cover object-center"
//         />
//         {badge && (
//           <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-[#22c55e] text-white text-[9px] sm:text-[10px] font-bold tracking-wider uppercase leading-tight px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-full shadow-md text-center max-w-[50px] sm:max-w-[54px] z-10">
//             {badge}
//           </div>
//         )}
//       </div>

//       {/* Content Container with Uniform Alignment */}
//       <div className="p-3 sm:p-4 text-center flex flex-col justify-start items-center flex-grow bg-white dark:bg-slate-900 transition-colors duration-300">
//         <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white tracking-tight leading-snug min-h-[2.5rem] flex items-center justify-center">
//           {title}
//         </h3>
//         <p className="text-[11px] sm:text-xs text-gray-500 dark:text-slate-400 font-medium mt-1 leading-normal">
//           {description}
//         </p>
//       </div>
//     </motion.div>
//   );
// };

// export default ShopCard;