// ReviewsSection

// import React, { useState, useEffect, useRef } from 'react';
// import ReviewCard from './ReviewCard';
// import { Star, Info, ChevronLeft, ChevronRight } from 'lucide-react';

// const mockReviews = [
//   {
//     id: 1,
//     name: 'ADITYA RAAZ',
//     timeAgo: '1 year ago',
//     text: 'Best price and reparing time very fast Thanks you LAPTOP MARK',
//     avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
//   },
//   {
//     id: 2,
//     name: 'keshav sharma',
//     timeAgo: '1 year ago',
//     text: 'The service provided by the team is good...they don\'t overcharged...the service is genuine and satisfactory',
//     avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=150',
//   },
//   {
//     id: 3,
//     name: 'Mukund Jamdar',
//     timeAgo: '1 year ago',
//     text: 'Best laptop repair shop in Chennai best price fast service',
//     avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
//   },
//   {
//     id: 4,
//     name: 'Roch Enterprises',
//     timeAgo: '1 year ago',
//     text: 'BEST SERVICE',
//     avatar: null,
//   },
//   {
//     id: 5,
//     name: 'Tushar Gundal',
//     timeAgo: '1 year ago',
//     text: 'best service in Chennai area',
//     avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
//   },
//   {
//     id: 6,
//     name: 'Rahul Verma',
//     timeAgo: '2 months ago',
//     text: 'Reasonable price and genuine parts used.',
//     avatar: null,
//   },
//   {
//     id: 7,
//     name: 'Neha Kulkarni',
//     timeAgo: '1 month ago',
//     text: 'Excellent customer support and quick resolution.',
//     avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150',
//   },
// ];

// const ReviewsSection = () => {
//   const scrollContainerRef = useRef(null);

//   const scroll = (direction) => {
//     if (scrollContainerRef.current) {
//       const distance = scrollContainerRef.current.clientWidth * 0.75;
//       const scrollAmount = direction === 'left' ? -distance : distance;
//       scrollContainerRef.current.scrollBy({
//         left: scrollAmount,
//         behavior: 'smooth',
//       });
//     }
//   };

//   useEffect(() => {
//     const interval = setInterval(() => {
//       if (scrollContainerRef.current) {
//         const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
//         const maxScrollLeft = scrollWidth - clientWidth;

//         if (scrollLeft >= maxScrollLeft - 10) {
//           scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
//         } else {
//           scrollContainerRef.current.scrollBy({
//             left: clientWidth * 0.75,
//             behavior: 'smooth',
//           });
//         }
//       }
//     }, 6000);

//     return () => clearInterval(interval);
//   }, []);

//   const handleCardClick = (id) => {
//     const cardIndex = mockReviews.findIndex((r) => r.id === id);
//     if (scrollContainerRef.current) {
//       const card = scrollContainerRef.current.children[cardIndex];
//       if (card) {
//         card.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
//       }
//     }
//   };

//   return (
//     <section className="pt-6 sm:pt-8 pb-2 bg-white dark:bg-slate-950 transition-colors duration-300 w-full px-4 md:px-8 font-sans relative">
//       {/* Top Header Section */}
//       <div className="flex flex-col items-center justify-center text-center mb-8">
//         <h2 className="text-2xl font-black tracking-wider uppercase text-black dark:text-white mb-1">
//           EXCELLENT
//         </h2>

//         {/* 5 Rating Stars */}
//         <div className="flex space-x-1 my-1">
//           {[...Array(5)].map((_, i) => (
//             <Star key={i} className="w-8 h-8 fill-amber-400 text-amber-400" />
//           ))}
//         </div>

//         {/* Reviews Subtext */}
//         <p className="text-sm font-semibold text-gray-800 dark:text-slate-300 mb-3">
//           Based on <span className="font-bold">160 reviews</span>
//         </p>

//         {/* Google Branding */}
//         <div className="flex items-center space-x-1 text-2xl font-semibold">
//           <span className="text-[#4285F4]">G</span>
//           <span className="text-[#EA4335]">o</span>
//           <span className="text-[#FBBC05]">o</span>
//           <span className="text-[#4285F4]">g</span>
//           <span className="text-[#34A853]">l</span>
//           <span className="text-[#EA4335]">e</span>
//         </div>
//       </div>

//       {/* Cards Container */}
//       <div className="relative group max-w-[1700px] mx-auto px-6">
//         {/* Left Arrow Button */}
//         <button
//           onClick={() => scroll('left')}
//           aria-label="Previous Review"
//           className="absolute -left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-md flex items-center justify-center text-gray-600 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700 hover:scale-105 active:scale-95 transition-all"
//         >
//           <ChevronLeft className="w-5 h-5" />
//         </button>

//         {/* Scrollable Container */}
//         <div
//           ref={scrollContainerRef}
//           className="flex space-x-5 overflow-x-auto scrollbar-hide py-4 px-1 scroll-smooth"
//           style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
//         >
//           {mockReviews.map((review) => (
//             <div
//               key={review.id}
//               className="flex-shrink-0 w-full sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)] xl:w-[calc(25%-15px)]"
//             >
//               <ReviewCard review={review} onClick={handleCardClick} />
//             </div>
//           ))}
//         </div>

//         {/* Right Arrow Button */}
//         <button
//           onClick={() => scroll('right')}
//           aria-label="Next Review"
//           className="absolute -right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-[#424242] dark:bg-slate-700 text-white shadow-md flex items-center justify-center hover:bg-black dark:hover:bg-slate-600 hover:scale-105 active:scale-95 transition-all"
//         >
//           <ChevronRight className="w-5 h-5" />
//         </button>
//       </div>

//       {/* Trustindex Badge Footer */}
//       <div className="flex justify-end mt-2 max-w-[1700px] mx-auto px-6">
//         <div className="inline-flex items-center space-x-1 bg-[#cbeee2] dark:bg-emerald-950/80 text-black dark:text-emerald-200 border border-transparent dark:border-emerald-800/50 px-3 py-1 rounded-md text-xs font-semibold">
//           <span>Verified by Trustindex</span>
//           <Info className="w-3.5 h-3.5 text-black dark:text-emerald-200" />
//         </div>
//       </div>
//     </section>
//   );
// };

// export default ReviewsSection;

import React, { useState, useEffect, useRef } from 'react';
import ReviewCard from './ReviewCard';
import { Star, Info, ChevronLeft, ChevronRight } from 'lucide-react';

const mockReviews = [
  {
    id: 1,
    name: 'ADITYA RAAZ',
    timeAgo: '1 year ago',
    text: 'Best price and reparing time very fast Thanks you LAPTOP MARK',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
  },
  {
    id: 2,
    name: 'keshav sharma',
    timeAgo: '1 year ago',
    text: 'The service provided by the team is good...they don\'t overcharged...the service is genuine and satisfactory',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=150',
  },
  {
    id: 3,
    name: 'Mukund Jamdar',
    timeAgo: '1 year ago',
    text: 'Best laptop repair shop in Chennai best price fast service',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
  },
  {
    id: 4,
    name: 'Roch Enterprises',
    timeAgo: '1 year ago',
    text: 'BEST SERVICE',
    avatar: null,
  },
  {
    id: 5,
    name: 'Tushar Gundal',
    timeAgo: '1 year ago',
    text: 'best service in Chennai area',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
  },
  {
    id: 6,
    name: 'Rahul Verma',
    timeAgo: '2 months ago',
    text: 'Reasonable price and genuine parts used.',
    avatar: null,
  },
  {
    id: 7,
    name: 'Neha Kulkarni',
    timeAgo: '1 month ago',
    text: 'Excellent customer support and quick resolution.',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150',
  },
];

const ReviewsSection = () => {
  const scrollContainerRef = useRef(null);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const distance = scrollContainerRef.current.clientWidth * 0.75;
      const scrollAmount = direction === 'left' ? -distance : distance;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        const maxScrollLeft = scrollWidth - clientWidth;

        if (scrollLeft >= maxScrollLeft - 10) {
          scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollContainerRef.current.scrollBy({
            left: clientWidth * 0.75,
            behavior: 'smooth',
          });
        }
      }
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const handleCardClick = (id) => {
    const cardIndex = mockReviews.findIndex((r) => r.id === id);
    if (scrollContainerRef.current) {
      const card = scrollContainerRef.current.children[cardIndex];
      if (card) {
        card.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
      }
    }
  };

  return (
    <section className="pt-6 sm:pt-8 pb-2 bg-white dark:bg-slate-950 transition-colors duration-300 w-full px-4 md:px-8 font-sans relative">
      {/* Top Header Section */}
      <div className="flex flex-col items-center justify-center text-center mb-8">
        <h2 className="text-2xl font-black tracking-wider uppercase text-black dark:text-white mb-1">
          EXCELLENT
        </h2>

        {/* 5 Rating Stars */}
        <div className="flex space-x-1 my-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-8 h-8 fill-amber-400 text-amber-400" />
          ))}
        </div>

        {/* Reviews Subtext */}
        <p className="text-sm font-semibold text-gray-800 dark:text-slate-300 mb-3">
          Based on <span className="font-bold">160 reviews</span>
        </p>

        {/* Google Branding */}
        <div className="flex items-center space-x-1 text-2xl font-semibold">
          <span className="text-[#4285F4]">G</span>
          <span className="text-[#EA4335]">o</span>
          <span className="text-[#FBBC05]">o</span>
          <span className="text-[#4285F4]">g</span>
          <span className="text-[#34A853]">l</span>
          <span className="text-[#EA4335]">e</span>
        </div>
      </div>

      {/* Cards Container */}
      <div className="relative group max-w-[1700px] mx-auto px-6">
        {/* Left Arrow Button */}
        <button
          onClick={() => scroll('left')}
          aria-label="Previous Review"
          className="absolute -left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-md flex items-center justify-center text-gray-600 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700 hover:scale-105 active:scale-95 transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Scrollable Container */}
        <div
          ref={scrollContainerRef}
          className="flex space-x-5 overflow-x-auto scrollbar-hide py-4 px-1 scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {mockReviews.map((review) => (
            <div
              key={review.id}
              className="flex-shrink-0 w-full sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)] xl:w-[calc(25%-15px)]"
            >
              <ReviewCard review={review} onClick={handleCardClick} />
            </div>
          ))}
        </div>

        {/* Right Arrow Button */}
        <button
          onClick={() => scroll('right')}
          aria-label="Next Review"
          className="absolute -right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-[#424242] dark:bg-slate-700 text-white shadow-md flex items-center justify-center hover:bg-black dark:hover:bg-slate-600 hover:scale-105 active:scale-95 transition-all"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Trustindex Badge Footer */}
      <div className="flex justify-end mt-2 max-w-[1700px] mx-auto px-6">
        <div className="inline-flex items-center space-x-1 bg-[#cbeee2] dark:bg-emerald-950/80 text-black dark:text-emerald-200 border border-transparent dark:border-emerald-800/50 px-3 py-1 rounded-md text-xs font-semibold">
          <span>Verified by Trustindex</span>
          <Info className="w-3.5 h-3.5 text-black dark:text-emerald-200" />
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;