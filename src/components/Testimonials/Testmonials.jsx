import React from "react";
import { Star, Users } from "lucide-react";
import TestimonialCard from "./TestimonialCard";

const testimonialsData = [
  {
    id: 1,
    name: "Aarav Sharma",
    role: "Software Engineer",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    rating: 5,
    review: "The laptop quality exceeded my expectations and the delivery was extremely fast. Upgraded my dev setup effortlessly with ZAID INFOTECH!",
    offsetClass: "lg:mt-0"
  },
  {
    id: 2,
    name: "Priya Patel",
    role: "Startup Founder",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    rating: 5,
    review: "We purchased 15 laptops for our office and the entire experience was deeply professional. Seamless invoicing, bulk discounts, and setup support.",
    offsetClass: "lg:mt-12"
  },
  {
    id: 3,
    name: "Rohan Verma",
    role: "Freelance Designer",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    rating: 5,
    review: "The rental process was smooth, transparent, and super affordable. Highly recommended for short-term projects or freelancing gigs!",
    offsetClass: "lg:mt-4"
  },
  {
    id: 4,
    name: "Ananya Iyer",
    role: "College Student",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    rating: 5,
    review: "Got a certified refurbished MacBook for my engineering studies. Looks and works like brand new, plus saved me a huge chunk of cash.",
    offsetClass: "lg:-mt-6"
  },
  {
    id: 5,
    name: "Vikram Malhotra",
    role: "IT Manager",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    rating: 5,
    review: "The repair team fixed my crashed ThinkPad within 24 hours. Excellent customer support, genuine spare parts, and super transparent diagnosis.",
    offsetClass: "lg:mt-8"
  },
  {
    id: 6,
    name: "Neha Gupta",
    role: "Business Owner",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    rating: 5,
    review: "Hands down the best place to buy and rent laptops in the region. Excellent customer care and reliable products every single time.",
    offsetClass: "lg:mt-0"
  }
];

const Testimonials = () => {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-white via-blue-50/40 to-blue-50/80 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-20 lg:py-28 transition-colors duration-300">
      {/* Subtle Background Glow Orbs */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute top-12 left-10 w-96 h-96 rounded-full bg-blue-200/40 dark:bg-blue-600/10 blur-3xl" 
      />
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute bottom-10 right-10 w-96 h-96 rounded-full bg-emerald-200/30 dark:bg-emerald-500/10 blur-3xl" 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* SECTION HEADER */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 dark:bg-slate-800/80 border border-blue-200 dark:border-slate-700 text-blue-800 dark:text-blue-300 text-xs sm:text-sm font-medium tracking-wide shadow-sm mb-6 hover:scale-105 transition duration-200 cursor-default">
            <span>⭐ Customer Reviews</span>
          </div>

          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15] mb-6 transition-colors duration-300">
            What Our <br className="hidden sm:inline" />
            <span className="text-[#2563EB] dark:text-blue-400">Customers Say</span>
          </h2>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-gray-600 dark:text-slate-300 leading-relaxed mb-8 transition-colors duration-300">
            Trusted by businesses, students, and professionals across India for premium laptops, rentals, and expert repair services.
          </p>

          {/* Aggregate Rating Banner */}
          <div className="inline-flex flex-wrap items-center justify-center gap-4 sm:gap-6 px-6 py-3 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-blue-100 dark:border-slate-800 shadow-sm transition-colors duration-300">
            <div className="flex items-center gap-1.5">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-sm font-bold text-slate-900 dark:text-white ml-1">4.9/5</span>
            </div>
            <span className="hidden sm:inline text-slate-300 dark:text-slate-700">|</span>
            <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
              <Users className="w-4 h-4 text-[#2563EB] dark:text-blue-400" />
              <span>1500+ Happy Customers</span>
            </div>
          </div>
        </div>

        {/* FLOATING CARD LAYOUT */}
        {/* Mobile: 1 Column | Tablet: 2 Columns | Desktop: 3 Columns with Staggered Offsets */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
          {testimonialsData.map((item) => (
            <TestimonialCard
              key={item.id}
              avatar={item.avatar}
              name={item.name}
              role={item.role}
              review={item.review}
              rating={item.rating}
              offsetClass={item.offsetClass}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default Testimonials;