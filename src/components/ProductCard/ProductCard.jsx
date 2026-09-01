// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { ShoppingCart, Heart, Percent, Truck } from 'lucide-react';

// const SERVER_URL = import.meta.env.VITE_API_URL
//   ? import.meta.env.VITE_API_URL.replace('/api', '')
//   : '';

// const ProductCard = ({ product, index, theme, onAddToCart, onAddToWishlist }) => {
//   const [isWishlisted, setIsWishlisted] = useState(false);

//   // Base Prices Extraction
//   const sellingPrice =
//     product.pricing?.sellingPrice ?? product.sellingPrice ?? product.price ?? 0;
//   const mrp =
//     product.pricing?.mrp ?? product.mrp ?? product.originalPrice ?? 0;

//   // Offer Calculation Logic
//   const offer = product.offer || null;
//   let finalPrice = sellingPrice;
//   let offerDiscount = 0;

//   if (offer) {
//     if (offer.discountType === 'PERCENTAGE') {
//       offerDiscount = (sellingPrice * Number(offer.discountValue)) / 100;
//       finalPrice = sellingPrice - offerDiscount;
//     } else if (offer.discountType === 'FIXED') {
//       offerDiscount = Number(offer.discountValue);
//       finalPrice = sellingPrice - offerDiscount;
//     }
//     finalPrice = Math.max(0, finalPrice);
//   }

//   // Savings / Discount Percent Calculation
//   let discountPercent = product.pricing?.discount ?? product.discount ?? 0;
//   if (!discountPercent && mrp > sellingPrice && sellingPrice > 0) {
//     discountPercent = Math.round(((mrp - sellingPrice) / mrp) * 100);
//   }

//   let offerPercentage = 0;
//   if (offer) {
//     if (offer.discountType === 'PERCENTAGE') {
//       offerPercentage = Number(offer.discountValue);
//     } else if (offer.discountType === 'FIXED' && sellingPrice > 0) {
//       offerPercentage = Math.round((Number(offer.discountValue) / sellingPrice) * 100);
//     }
//   }

//   // Dynamic Badge Flags
//   const isBestSeller =
//     product.badge === 'BEST SELLER' ||
//     product.isBestSeller ||
//     product.isBestseller ||
//     (index !== undefined && index % 2 === 0);

//   const isNew =
//     product.badge === 'NEW' ||
//     product.isNew ||
//     product.newArrival ||
//     (index !== undefined && index % 3 === 1);

//   // Image Source Resolution
//   const getImageUrl = (imgSource) => {
//     if (!imgSource) return '';
//     if (typeof imgSource === 'object' && imgSource.url) imgSource = imgSource.url;
//     if (imgSource.startsWith('http')) return imgSource;
//     return `${SERVER_URL}${imgSource.startsWith('/') ? '' : '/'}${imgSource}`;
//   };

//   const primaryImage = product.images?.length
//     ? getImageUrl(product.images[0])
//     : product.primaryImage
//     ? getImageUrl(product.primaryImage)
//     : product.image
//     ? getImageUrl(product.image)
//     : '';

//   const hoverImage = product.images?.length > 1
//     ? getImageUrl(product.images[1])
//     : product.hoverImage
//     ? getImageUrl(product.hoverImage)
//     : primaryImage;

//   // Handlers
//   const handleWishlistClick = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setIsWishlisted((prev) => !prev);
//     if (onAddToWishlist) {
//       onAddToWishlist(product);
//     }
//   };

//   const handleAddToCartClick = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     if (onAddToCart) {
//       onAddToCart(product);
//     }
//   };

//   const activeDiscount = offerPercentage || discountPercent;

//   return (
//     <div className="group relative w-full bg-transparent flex flex-col justify-between font-sans transition-colors duration-300">
      
//       {/* Upper Container Box (Clean White Background Stage for JPG product photos) */}
//       <div className="relative w-full border border-gray-200 dark:border-slate-800 rounded-[28px] p-4 bg-white overflow-hidden shadow-sm transition-colors duration-300">
        
//         {/* Top Left Floating Pill Badge */}
//         <div className="absolute top-4 left-4 z-10">
//           <span className="bg-black text-white text-[11px] font-bold px-3 py-1 rounded-full tracking-wide shadow-sm inline-flex items-center justify-center">
//             {offer?.title || product.badge || (isBestSeller ? 'Best Seller' : isNew ? 'New Arrival' : 'End of Season Sale')}
//           </span>
//         </div>

//         {/* Product Image Link Container */}
//         <Link to={`/shop/product/${product._id || product.id}`} className="block relative w-full h-48 sm:h-52 pt-8 pb-2">
//           {primaryImage ? (
//             <>
//               <img
//                 src={primaryImage}
//                 alt=""
//                 className="w-full h-full object-contain transition-all duration-500 group-hover:opacity-0"
//                 onError={(e) => { e.currentTarget.style.display = 'none'; }}
//               />
//               <img
//                 src={hoverImage || primaryImage}
//                 alt=""
//                 className="absolute inset-0 w-full h-full object-contain pt-8 pb-2 opacity-0 transition-all duration-500 group-hover:opacity-100"
//                 onError={(e) => { e.currentTarget.style.display = 'none'; }}
//               />
//             </>
//           ) : (
//             <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs font-medium">
//               No Image Available
//             </div>
//           )}
//         </Link>
//       </div>

//       {/* Details Container */}
//       <div className="pt-3.5 pb-1 flex flex-col flex-grow">
        
//         {/* Product Title */}
//         <Link to={`/shop/product/${product._id || product.id}`}>
//           <h3 className="font-semibold text-gray-900 dark:text-slate-100 text-base leading-snug line-clamp-2 hover:text-gray-700 dark:hover:text-slate-300 transition-colors">
//             {product.title || product.name}
//           </h3>
//         </Link>

//         {/* Pricing & Discount */}
//         <div className="flex items-center gap-2 mt-2 flex-wrap">
//           <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
//             ₹{finalPrice.toLocaleString('en-IN')}
//           </span>

//           {(offer && finalPrice < sellingPrice) || (!offer && Number(mrp) > Number(sellingPrice)) ? (
//             <span className="text-xs sm:text-sm text-gray-400 dark:text-slate-500 line-through">
//               MRP₹{(offer && finalPrice < sellingPrice ? sellingPrice : mrp).toLocaleString('en-IN')}
//             </span>
//           ) : null}

//           {activeDiscount > 0 && (
//             <span className="bg-[#d90429] dark:bg-red-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
//               {activeDiscount}%Off
//             </span>
//           )}
//         </div>

//         {/* Extra Deals Available Badge */}
//         <div className="mt-2.5 bg-[#e8f5e9] dark:bg-emerald-950/60 text-[#00796b] dark:text-emerald-300 border border-emerald-100 dark:border-emerald-800/40 px-3 py-1.5 rounded-lg flex items-center gap-2 transition-colors duration-300">
//           <div className="w-4 h-4 rounded-full border border-[#00796b] dark:border-emerald-300 flex items-center justify-center shrink-0">
//             <Percent className="w-2.5 h-2.5 stroke-[2.5]" />
//           </div>
//           <span className="text-xs font-semibold tracking-tight">
//             Extra Deals Available
//           </span>
//         </div>

//         {/* Delivery & Action Buttons */}
//         <div className="mt-3.5 pt-1 flex items-center justify-between gap-2">
          
//           <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-slate-400">
//             <Truck className="w-4 h-4 text-gray-800 dark:text-slate-300 shrink-0" />
//             <span>
//               {product.deliveryText || 'Free delivery by 27th August, 2026'}
//             </span>
//           </div>

//           <div className="flex items-center gap-2 shrink-0">
//             {/* Wishlist Button */}
//             <button
//               onClick={handleWishlistClick}
//               aria-label="Add to Wishlist"
//               className="w-9 h-9 rounded-full border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-center text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
//             >
//               <Heart
//                 className={`w-4 h-4 transition-colors ${
//                   isWishlisted
//                     ? 'fill-red-500 text-red-500'
//                     : 'text-gray-700 dark:text-slate-300'
//                 }`}
//               />
//             </button>

//             {/* Cart Button */}
//             <button
//               onClick={handleAddToCartClick}
//               aria-label="Add to Cart"
//               className="w-9 h-9 rounded-full bg-black dark:bg-slate-100 text-white dark:text-black flex items-center justify-center hover:opacity-90 transition-all shadow-sm"
//             >
//               <ShoppingCart className="w-4 h-4" />
//             </button>
//           </div>

//         </div>

//       </div>
//     </div>
//   );
// };

// export default ProductCard;




import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Percent, Truck, SlidersHorizontal } from 'lucide-react';
import { useCompare } from '../../context/CompareContext';

const SERVER_URL = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace('/api', '')
  : '';

// =====================================================
// GET CATEGORY LABEL
//
// Reads the category name straight off the product
// object — same data source Shop.jsx already uses to
// build filters and sections. No new prop needed.
// =====================================================

const getCategoryLabel = (product) => {
  const raw =
    product?.category ??
    product?.categoryId ??
    product?.categoryData;

  if (!raw) return '';

  if (typeof raw === 'object') {
    return String(raw.name ?? raw.title ?? raw.categoryName ?? '').trim();
  }

  return String(raw).trim();
};

const ProductCard = ({ product, index, theme, onAddToCart, onAddToWishlist }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Compare Context
  const { addToCompare, removeFromCompare, isInCompare } = useCompare();
  const productId = product._id || product.id;

  // Base Prices Extraction
  const sellingPrice =
    product.pricing?.sellingPrice ?? product.sellingPrice ?? product.price ?? 0;
  const mrp =
    product.pricing?.mrp ?? product.mrp ?? product.originalPrice ?? 0;

  // Offer Calculation Logic
  const offer = product.offer || null;
  let finalPrice = sellingPrice;
  let offerDiscount = 0;

  if (offer) {
    if (offer.discountType === 'PERCENTAGE') {
      offerDiscount = (sellingPrice * Number(offer.discountValue)) / 100;
      finalPrice = sellingPrice - offerDiscount;
    } else if (offer.discountType === 'FIXED') {
      offerDiscount = Number(offer.discountValue);
      finalPrice = sellingPrice - offerDiscount;
    }
    finalPrice = Math.max(0, finalPrice);
  }

  // Savings / Discount Percent Calculation
  let discountPercent = product.pricing?.discount ?? product.discount ?? 0;
  if (!discountPercent && mrp > sellingPrice && sellingPrice > 0) {
    discountPercent = Math.round(((mrp - sellingPrice) / mrp) * 100);
  }

  let offerPercentage = 0;
  if (offer) {
    if (offer.discountType === 'PERCENTAGE') {
      offerPercentage = Number(offer.discountValue);
    } else if (offer.discountType === 'FIXED' && sellingPrice > 0) {
      offerPercentage = Math.round((Number(offer.discountValue) / sellingPrice) * 100);
    }
  }

  // Dynamic Badge Flags
  const isBestSeller =
    product.badge === 'BEST SELLER' ||
    product.isBestSeller ||
    product.isBestseller ||
    (index !== undefined && index % 2 === 0);

  const isNew =
    product.badge === 'NEW' ||
    product.isNew ||
    product.newArrival ||
    (index !== undefined && index % 3 === 1);

  // Category label for the pill (uses theme.pillBg passed down from Shop.jsx)
  const categoryLabel = getCategoryLabel(product);

  // Image Source Resolution
  const getImageUrl = (imgSource) => {
    if (!imgSource) return '';
    if (typeof imgSource === 'object' && imgSource.url) imgSource = imgSource.url;
    if (imgSource.startsWith('http')) return imgSource;
    return `${SERVER_URL}${imgSource.startsWith('/') ? '' : '/'}${imgSource}`;
  };

  const primaryImage = product.images?.length
    ? getImageUrl(product.images[0])
    : product.primaryImage
    ? getImageUrl(product.primaryImage)
    : product.image
    ? getImageUrl(product.image)
    : '';

  const hoverImage = product.images?.length > 1
    ? getImageUrl(product.images[1])
    : product.hoverImage
    ? getImageUrl(product.hoverImage)
    : primaryImage;

  // Handlers
  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted((prev) => !prev);
    if (onAddToWishlist) {
      onAddToWishlist(product);
    }
  };

  const handleAddToCartClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  const handleCompareClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInCompare(productId)) {
      removeFromCompare(productId);
    } else {
      addToCompare(product);
    }
  };

  const activeDiscount = offerPercentage || discountPercent;

  return (
    <div className="group relative w-full bg-transparent flex flex-col justify-between font-sans transition-colors duration-300">
      
      {/* Upper Container Box (Clean White Background Stage for JPG product photos) */}
      <div className="relative w-full border border-gray-200 dark:border-slate-800 rounded-[28px] p-4 bg-white overflow-hidden shadow-sm transition-colors duration-300">
        
        {/* Top Left Floating Pill Badge */}
        <div className="absolute top-4 left-4 z-10">
          <span className="bg-black text-white text-[11px] font-bold px-3 py-1 rounded-full tracking-wide shadow-sm inline-flex items-center justify-center">
            {offer?.title || product.badge || (isBestSeller ? 'Best Seller' : isNew ? 'New Arrival' : 'End of Season Sale')}
          </span>
        </div>

        {/* Product Image Link Container */}
        <Link to={`/shop/product/${product._id || product.id}`} className="block relative w-full h-48 sm:h-52 pt-8 pb-2">
          {primaryImage ? (
            <>
              <img
                src={primaryImage}
                alt=""
                className="w-full h-full object-contain transition-all duration-500 group-hover:opacity-0"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
              <img
                src={hoverImage || primaryImage}
                alt=""
                className="absolute inset-0 w-full h-full object-contain pt-8 pb-2 opacity-0 transition-all duration-500 group-hover:opacity-100"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs font-medium">
              No Image Available
            </div>
          )}
        </Link>
      </div>

      {/* Details Container */}
      <div className="pt-3.5 pb-1 flex flex-col flex-grow">
        
        {/* Product Title */}
        <Link to={`/shop/product/${product._id || product.id}`}>
          <h3 className="font-semibold text-gray-900 dark:text-slate-100 text-base leading-snug line-clamp-2 hover:text-gray-700 dark:hover:text-slate-300 transition-colors">
            {product.title || product.name}
          </h3>
        </Link>

        {/* Category Pill */}
        {categoryLabel && (
          <span
            className={`inline-flex items-center w-fit mt-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
              theme?.pillBg || 'bg-gray-50 text-gray-700 border-gray-200'
            }`}
          >
            {categoryLabel}
          </span>
        )}

        {/* Pricing & Discount */}
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
            ₹{finalPrice.toLocaleString('en-IN')}
          </span>

          {(offer && finalPrice < sellingPrice) || (!offer && Number(mrp) > Number(sellingPrice)) ? (
            <span className="text-xs sm:text-sm text-gray-400 dark:text-slate-500 line-through">
              MRP₹{(offer && finalPrice < sellingPrice ? sellingPrice : mrp).toLocaleString('en-IN')}
            </span>
          ) : null}

          {activeDiscount > 0 && (
            <span className="bg-[#d90429] dark:bg-red-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
              {activeDiscount}%Off
            </span>
          )}
        </div>

        {/* Extra Deals Available Badge */}
        <div className="mt-2.5 bg-[#e8f5e9] dark:bg-emerald-950/60 text-[#00796b] dark:text-emerald-300 border border-emerald-100 dark:border-emerald-800/40 px-3 py-1.5 rounded-lg flex items-center gap-2 transition-colors duration-300">
          <div className="w-4 h-4 rounded-full border border-[#00796b] dark:border-emerald-300 flex items-center justify-center shrink-0">
            <Percent className="w-2.5 h-2.5 stroke-[2.5]" />
          </div>
          <span className="text-xs font-semibold tracking-tight">
            Extra Deals Available
          </span>
        </div>

        {/* Delivery & Action Buttons */}
        <div className="mt-3.5 pt-1 flex items-center justify-between gap-2">
          
          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-slate-400">
            <Truck className="w-4 h-4 text-gray-800 dark:text-slate-300 shrink-0" />
            <span>
              {product.deliveryText || 'Free delivery by 27th August, 2026'}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Compare Button */}
            <button
              onClick={handleCompareClick}
              aria-label="Add to Compare"
              className={`w-9 h-9 rounded-full border flex items-center justify-center transition-colors shadow-sm ${
                isInCompare(productId)
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-600 dark:bg-emerald-950/40 dark:border-emerald-400 dark:text-emerald-400'
                  : 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>

            {/* Wishlist Button */}
            <button
              onClick={handleWishlistClick}
              aria-label="Add to Wishlist"
              className="w-9 h-9 rounded-full border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-center text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
            >
              <Heart
                className={`w-4 h-4 transition-colors ${
                  isWishlisted
                    ? 'fill-red-500 text-red-500'
                    : 'text-gray-700 dark:text-slate-300'
                }`}
              />
            </button>

            {/* Cart Button */}
            <button
              onClick={handleAddToCartClick}
              aria-label="Add to Cart"
              className="w-9 h-9 rounded-full bg-black dark:bg-slate-100 text-white dark:text-black flex items-center justify-center hover:opacity-90 transition-all shadow-sm"
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

export default ProductCard;