import React from "react";
import CategoryCard from "./CategoryCard";

// Import laptop images from assets folder (adjusting for nested folder depth)
import budgetLaptopImg from "../../assets/images/BudgetLaptop.jpg";
import premiumLaptopImg from "../../assets/images/PremiumLaptop.jpg";
import highPerformanceLaptopImg from "../../assets/images/HighPerformanceLaptop.jpg";

const categories = [
  {
    id: 1,
    title: "Budget Laptops",
    badge: "Up to 50% OFF",
    description:
      "Perfect laptops for students, office work, online classes, and everyday productivity.",
    image: budgetLaptopImg,
  },
  {
    id: 2,
    title: "Premium Laptops",
    badge: "Up to 60% OFF",
    description:
      "Powerful laptops for professionals, creators, business users, and multitasking.",
    image: premiumLaptopImg,
  },
  {
    id: 3,
    title: "High Performance Laptops",
    badge: "Up to 40% OFF",
    description:
      "Built for gaming, software development, AI workloads, video editing, and demanding applications.",
    image: highPerformanceLaptopImg,
  },
];

const LaptopCategories = () => {
  return (
    <section className="w-full py-16 md:py-24 bg-gradient-to-b from-white via-slate-50/80 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 relative overflow-hidden transition-colors duration-300">
      {/* Background Decorative Ambient Glows */}
      <div className="absolute top-1/3 left-10 w-80 h-80 bg-emerald-400/10 dark:bg-emerald-500/10 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-green-500/10 dark:bg-green-500/10 blur-3xl rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <span className="inline-block text-xs md:text-sm font-semibold tracking-wider text-green-700 dark:text-green-300 uppercase bg-green-100/60 dark:bg-green-950/60 px-4 py-1.5 rounded-full border border-green-200/80 dark:border-green-800/60 mb-3.5 shadow-xs transition-colors duration-300">
            Handpicked Selections
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight transition-colors duration-300">
            Featured <span className="text-green-600 dark:text-green-400">Laptops</span>
          </h2>
          <div className="w-20 h-1.5 bg-gradient-to-r from-green-500 to-emerald-400 mx-auto mt-4 rounded-full" />
          <p className="mt-4 text-base md:text-lg text-gray-600 dark:text-slate-300 leading-relaxed font-normal transition-colors duration-300">
            Explore our handpicked collection of reliable laptops for every budget and performance need.
          </p>
        </div>

        {/* Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-8 items-stretch">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              title={category.title}
              badge={category.badge}
              description={category.description}
              image={category.image}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default LaptopCategories;