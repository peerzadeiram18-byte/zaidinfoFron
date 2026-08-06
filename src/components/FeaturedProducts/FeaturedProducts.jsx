import React, { useState } from 'react';
import ProductCard from './ProductCard';

// Importing all 10 image assets from your folder structure
import img1 from '../../assets/images/imageone.png';
import img2 from '../../assets/images/imagetwo.png';
import img3 from '../../assets/images/imagethree.png';
import img4 from '../../assets/images/imagefour.png';
import img5 from '../../assets/images/imagefive.png';
import img6 from '../../assets/images/imagesix.png';
import img7 from '../../assets/images/imageseven.png';
import img8 from '../../assets/images/imageeight.png';
import img9 from '../../assets/images/imagenine.png';
import img10 from '../../assets/images/image10.png';

// Fallback array with all 10 products
const DEFAULT_PRODUCTS = [
  { id: 1, name: 'MacBook Pro 16" M2 Max', price: 2199, image: img1 },
  { id: 2, name: 'Dell XPS 15 Touchscreen', price: 1499, image: img2 },
  { id: 3, name: 'Lenovo ThinkPad X1 Carbon', price: 1299, image: img3 },
  { id: 4, name: 'ASUS ROG Zephyrus G14', price: 1599, image: img4 },
  { id: 5, name: 'HP Spectre x360 Convertible', price: 1199, image: img5 },
  { id: 6, name: 'Razer Blade 15 Advanced', price: 1899, image: img6 },
  { id: 7, name: 'Microsoft Surface Laptop 5', price: 999, image: img7 },
  { id: 8, name: 'Framework Laptop 13 Modular', price: 1099, image: img8 },
  { id: 9, name: 'Acer Predator Helios 300', price: 1249, image: img9 },
  { id: 10, name: 'Custom Pro Workstation Desktop', price: 2499, image: img10 },
];

const FeaturedProducts = ({ products = [] }) => {
  const [activeTab, setActiveTab] = useState('all');

  // Use passed props if available and non-empty; otherwise, use all 10 fallback items
  const displayProducts = (products && products.length > 0) ? products : DEFAULT_PRODUCTS;

  const categories = [
    { id: 'all', name: 'All Featured' },
    { id: 'refurbished', name: 'Certified Refurbished' },
    { id: 'rental', name: 'Laptop Rentals' },
    { id: 'desktop', name: 'Desktops & Workstations' },
  ];

  return (
    <section className="relative py-16 sm:py-20 bg-slate-50/60 dark:bg-slate-900/60 overflow-hidden border-t border-slate-100 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200/80 dark:border-emerald-800/60 mb-4 transition-colors duration-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 uppercase tracking-wide">
              Next-Gen Hardware
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3 transition-colors duration-300">
            Pro-Grade <span className="text-emerald-600 dark:text-emerald-400">Featured Devices.</span>
          </h2>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-normal max-w-2xl mx-auto transition-colors duration-300">
            Rigorously certified laptops, custom desktops, and rental-ready workstations.
          </p>

          <div className="flex flex-wrap justify-center items-center gap-2 mt-6">
            {categories.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-slate-900 text-white dark:bg-emerald-500 dark:text-slate-950 shadow-md'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid - Displays all items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-5 items-stretch">
          {displayProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;