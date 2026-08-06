import React, { useState } from 'react';
import LaptopCard from './LaptopCard';
import { ArrowRight } from 'lucide-react';

const mockLaptops = [
  {
    id: 1,
    badge: 'NEW',
    badgeBg: 'bg-emerald-600',
    title: 'Dell Inspiron 3530',
    subtitle: '13th Gen Intel Core i5',
    price: 45990,
    originalPrice: 52990,
    rating: 4.8,
    primaryImage: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=500',
    hoverImage: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&q=80&w=500',
  },
  {
    id: 2,
    badge: 'BEST SELLER',
    badgeBg: 'bg-amber-500',
    title: 'HP 15s-FQS009TU',
    subtitle: '12th Gen Intel Core i5',
    price: 42990,
    originalPrice: 48990,
    rating: 4.7,
    primaryImage: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=500',
    hoverImage: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=500',
  },
  {
    id: 3,
    badge: 'REFURBISHED',
    badgeBg: 'bg-emerald-600',
    title: 'Lenovo ThinkPad T480',
    subtitle: 'Intel Core i5 8th Gen',
    price: 24990,
    originalPrice: 31990,
    rating: 4.6,
    primaryImage: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&q=80&w=500',
    hoverImage: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=500',
  },
  {
    id: 4,
    badge: 'GAMING',
    badgeBg: 'bg-red-600',
    title: 'ASUS TUF F15',
    subtitle: 'Intel Core i7 13th Gen / RTX 3050',
    price: 79990,
    originalPrice: 89990,
    rating: 4.8,
    primaryImage: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&q=80&w=500',
    hoverImage: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=500',
  },
];

const tabs = ['New Arrivals', 'Best Sellers', 'Refurbished Deals', 'Gaming Laptops'];

const FeaturedLaptops = () => {
  const [activeTab, setActiveTab] = useState('New Arrivals');

  return (
    <section className="pt-4 sm:pt-6 pb-4 sm:pb-6 px-4 max-w-7xl mx-auto font-sans bg-white dark:bg-slate-950 transition-colors duration-300">
      {/* Section Header Title */}
      <div className="text-center mb-6">
        <h2 className="text-xl md:text-2xl font-black uppercase tracking-widest text-gray-900 dark:text-white">
          FEATURED LAPTOPS
        </h2>
      </div>

      {/* Filter Tabs Navigation */}
      <div className="flex items-center justify-center space-x-6 md:space-x-10 mb-8 border-b border-gray-100 dark:border-slate-800 overflow-x-auto scrollbar-hide pb-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-sm font-bold transition-all relative pb-2 whitespace-nowrap ${
              activeTab === tab
                ? 'text-[#008a45] dark:text-emerald-400'
                : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[#008a45] dark:bg-emerald-400 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Laptop Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {mockLaptops.map((laptop) => (
          <LaptopCard key={laptop.id} product={laptop} />
        ))}
      </div>

      {/* Footer Link */}
      <div className="text-center mt-6">
        <a
          href="#all-laptops"
          className="inline-flex items-center space-x-2 text-sm font-bold text-[#008a45] dark:text-emerald-400 hover:underline"
        >
          <span>View All Laptops</span>
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </section>
  );
};

export default FeaturedLaptops;