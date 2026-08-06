import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const { id, image, name, price } = product;
  const [isWishlisted, setIsWishlisted] = useState(false);

  const badges = ['Refurbished Pro', 'Bestseller', 'Top Rated', 'Rental Ready'];
  const currentBadge = badges[id % badges.length];

  return (
    <div className="group relative flex flex-col h-full bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-emerald-500/40 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      
      {/* Top Header Row */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-white/90 backdrop-blur-md text-slate-800 border border-slate-200/80 shadow-sm pointer-events-auto">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block mr-1.5" />
          {currentBadge}
        </span>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            setIsWishlisted(!isWishlisted);
          }}
          aria-label="Add to Wishlist"
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm border pointer-events-auto ${
            isWishlisted
              ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
              : 'bg-white/90 backdrop-blur-md border-slate-200 text-slate-400 hover:text-emerald-600'
          }`}
        >
          <svg
            className={`w-4 h-4 ${isWishlisted ? 'fill-emerald-600' : 'fill-none'}`}
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.293l1.318-1.075a4.5 4.5 0 116.364 6.364L12 21.35l-7.682-7.682a4.5 4.5 0 010-6.364z" />
          </svg>
        </button>
      </div>

      {/* Image Container */}
      <div className="relative w-full pt-[70%] bg-slate-50/80 flex items-center justify-center">
        <div className="absolute inset-0 p-5 flex items-center justify-center">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>
      </div>

      {/* Details Area */}
      <div className="flex flex-col flex-grow p-4 bg-white border-t border-slate-100">
        <div className="flex items-center gap-1 mb-1.5">
          <span className="text-amber-400 text-xs">★★★★★</span>
          <span className="text-[11px] font-semibold text-slate-600">4.9</span>
        </div>

        <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2 min-h-[2.5rem] mb-3 group-hover:text-emerald-600 transition-colors">
          {name}
        </h3>

        <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Price</span>
            <span className="text-base font-extrabold text-emerald-600">
              {typeof price === 'number' ? `₹${price.toLocaleString()}` : price}
            </span>
          </div>

          <Link
            to={`/product/${id}`}
            className="px-3.5 py-1.5 rounded-full bg-slate-900 hover:bg-emerald-600 text-white text-xs font-semibold transition-colors shadow-sm"
          >
            Explore →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;