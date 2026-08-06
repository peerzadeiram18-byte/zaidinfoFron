import React from 'react';
import { Star, ShoppingCart } from 'lucide-react';

const LaptopCard = ({ product }) => {
  // Calculate discount percentage automatically if needed
  const discountPercent = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  return (
    <div className="group relative bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800 p-4 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between">
      
      {/* Top Section: Badge & Images */}
      <div>
        {/* Badge */}
        {product.badge && (
          <div className="absolute top-3 left-3 z-10">
            <span
              className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded text-white ${product.badgeBg}`}
            >
              {product.badge}
            </span>
          </div>
        )}

        {/* Image Container with Hover Swap Effect */}
        <div className="relative w-full h-48 mb-4 overflow-hidden rounded-lg flex items-center justify-center bg-gray-50/50 dark:bg-slate-800/40">
          {/* Primary Image */}
          <img
            src={product.primaryImage}
            alt={product.title}
            className="absolute inset-0 w-full h-full object-contain transition-opacity duration-500 ease-in-out group-hover:opacity-0"
          />
          {/* Hover Image */}
          <img
            src={product.hoverImage}
            alt={`${product.title} angle view`}
            className="absolute inset-0 w-full h-full object-contain opacity-0 transition-opacity duration-500 ease-in-out group-hover:opacity-100 group-hover:scale-105"
          />
        </div>

        {/* Product Titles */}
        <h3 className="font-bold text-gray-900 dark:text-white text-sm leading-tight line-clamp-1">
          {product.title}
        </h3>
        <p className="text-xs text-gray-500 dark:text-slate-400 mt-1 mb-3">
          {product.subtitle}
        </p>
      </div>

      {/* Bottom Section: Strikethrough Price, Discounted Price, Rating & Cart Button */}
      <div className="flex items-end justify-between mt-2 pt-2 border-t border-gray-50 dark:border-slate-800">
        <div>
          {/* Prices Row */}
          <div className="flex items-baseline space-x-2">
            {/* Discounted Price */}
            <span className="text-base font-extrabold text-gray-900 dark:text-white">
              ₹{product.price.toLocaleString('en-IN')}
            </span>

            {/* Original Strikethrough Price */}
            <span className="text-xs text-gray-400 dark:text-slate-500 line-through font-medium">
              ₹{product.originalPrice.toLocaleString('en-IN')}
            </span>

            {/* Optional Discount Badge */}
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
              {discountPercent}% OFF
            </span>
          </div>

          {/* Rating */}
          <div className="flex items-center space-x-1 mt-1">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
              ))}
            </div>
            <span className="text-xs font-semibold text-gray-600 dark:text-slate-300 ml-1">
              {product.rating}
            </span>
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          aria-label="Add to Cart"
          className="bg-[#008a45] dark:bg-emerald-600 hover:bg-[#007038] dark:hover:bg-emerald-700 text-white p-2.5 rounded-lg transition-colors duration-200 shadow-sm active:scale-95"
        >
          <ShoppingCart className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default LaptopCard;