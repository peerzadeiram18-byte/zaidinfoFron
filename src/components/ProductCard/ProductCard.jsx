import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const SERVER_URL = import.meta.env.VITE_API_URL.replace("/api", "");

const ProductCard = ({ product, index, theme, onAddToCart, onAddToWishlist }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const sellingPrice =
    product.pricing?.sellingPrice ?? product.sellingPrice ?? product.price ?? 0;
  const mrp =
    product.pricing?.mrp ?? product.mrp ?? product.originalPrice ?? 0;

  let discount = product.pricing?.discount ?? product.discount ?? 0;

  if (!discount && mrp > sellingPrice && sellingPrice > 0) {
    discount = Math.round(((mrp - sellingPrice) / mrp) * 100);
  }

  // Badges calculation logic
  const isBestSeller =
    product.isBestSeller ?? product.isBestseller ?? product.bestseller ?? (index % 2 === 0);

  const isNew =
    product.isNew ?? product.is_new ?? product.newArrival ?? (index % 3 === 1);

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted((prev) => !prev);
    if (onAddToWishlist) {
      onAddToWishlist(product);
    }
  };

  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.85,
        y: 20
      }}
      whileInView={{
        opacity: 1,
        scale: 1,
        y: 0
      }}
      transition={{
        duration: 0.6,
        delay: (index % 3) * 0.1,
        ease: [0.25, 1, 0.5, 1],
      }}
      viewport={{ once: true, amount: 0.2 }}
      className="flex flex-col justify-between group"
    >
      <div>
        {/* Image Card Container */}
        <div className="relative bg-[#e9ecef]/60 hover:bg-[#e2e6ea]/80 dark:bg-slate-900/90 dark:hover:bg-slate-900 border border-transparent dark:border-slate-800 rounded-3xl aspect-[1.25/1] flex flex-col justify-between p-4 transition-all duration-300 shadow-inner">

          {/* Top Bar: Badges + Wishlist Button */}
          <div className="flex items-center justify-between z-10 w-full gap-2 relative">

            {/* Dynamic Badges Row */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {isBestSeller && (
                <span className="bg-gray-950 dark:bg-slate-800 text-white text-[10px] font-extrabold tracking-wider px-3 py-1 rounded-full shadow-sm">
                  BEST SELLER
                </span>
              )}

              {Number(discount) > 0 && (
                <span className="bg-[#10b981]/90 text-white text-[10px] font-extrabold tracking-wider px-3 py-1 rounded-full shadow-sm">
                  SAVE {discount}%
                </span>
              )}

              {isNew && (
                <span className="bg-[#2563eb]/90 text-white text-[10px] font-extrabold tracking-wider px-3 py-1 rounded-full shadow-sm">
                  NEW
                </span>
              )}
            </div>

            {/* Wishlist Button */}
            <button
              onClick={handleWishlistClick}
              aria-label="Add to wishlist"
              className="p-2 rounded-full bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 text-gray-700 dark:text-slate-300 hover:text-red-500 dark:hover:text-red-400 shadow-sm transition-all duration-200 focus:outline-none shrink-0 z-20"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill={isWishlisted ? "currentColor" : "none"}
                viewBox="0 0 24 24"
                strokeWidth={1.8}
                stroke="currentColor"
                className={`w-4 h-4 transition-colors ${isWishlisted ? "text-red-500 stroke-red-500" : "text-gray-600 dark:text-slate-300"
                  }`}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                />
              </svg>
            </button>
          </div>

          {/* Product Image */}
          <Link
            to={`/shop/product/${product._id}`}
            className="relative w-full h-36 my-auto flex items-center justify-center p-2 cursor-pointer z-10"
          >
            <img
              // src={
              //   product.images?.length
              //     ? `http://localhost:5000${product.images[0].url}`
              //     : product.image
              //       ? `http://localhost:5000${product.image}`
              //       : "/no-image.png"
              // }
            
  src={
    product.images?.length
      ? `${SERVER_URL}${product.images[0].url}`
      : product.image
      ? `${SERVER_URL}${product.image}`
      : "/no-image.png"
  }
  alt={product.name}
  className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
/>
          </Link>

          {/* Add to Cart Button */}
          <div className="flex justify-end z-20">
            <button
              onClick={() => onAddToCart(product)}
              className="bg-white/95 hover:bg-white dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-900 dark:text-white px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-sm hover:shadow transition-all duration-200 border border-gray-100 dark:border-slate-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-3.5 h-3.5 text-gray-700 dark:text-slate-200"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                />
              </svg>
              Add to Cart
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="mt-3.5 space-y-1">
          <Link
            to={`/shop/product/${product._id}`}
            className="block group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
          >
            <h3 className="font-bold text-gray-900 dark:text-white text-base leading-tight tracking-tight line-clamp-1">
              {product.name}
            </h3>
          </Link>

          <p className="text-xs font-normal text-gray-500 dark:text-slate-400 line-clamp-1">
            {product.description ||
              `${product.brand?.name || product.brand || "Laptop"} • ${product.processor || "High Performance"
              }`}
          </p>

          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-base font-extrabold text-gray-900 dark:text-white">
              ₹{sellingPrice.toLocaleString("en-IN")}
            </span>
            {Number(mrp) > Number(sellingPrice) && (
              <span className="text-xs text-gray-400 dark:text-slate-500 font-medium line-through">
                ₹{mrp.toLocaleString("en-IN")}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;